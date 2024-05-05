import { collection, getDocs, or, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import _ from 'lodash';

type Group = {
    id: string,
    name: string,
    createdBy: string,
    visibility: string,
    members: string[],
    managers: string[],
}

type Player = {
    id: string,
    name: string
}

type Stats = {
    id: string,
    name: string,
    wins: number,
    gamesWon: number,
    gamesPlayed: number
    matches: number,
    ratio: string,
    gamesRatio: string,
}

type Teams = {
    [ids: string]: Stats
}

const initialStats: Stats = { id: "", name: "", wins: 0, gamesWon: 0, gamesPlayed: 0, matches: 0, ratio: '0', gamesRatio: '0' };

const incrementStats = (object: any, index: string, mypoints: number, theirpoints: number) => {
    object[index] = {
        ...object[index],
        gamesWon: object[index].gamesWon + mypoints,
        gamesPlayed: object[index].gamesPlayed + mypoints + theirpoints,
        wins: object[index].wins + (mypoints > theirpoints ? 1 : 0),
        matches: object[index].matches + 1
    };
}

const fetchPlayers = async (groupId: string) => {
    if (!groupId.length) return;
    const q = query(collection(db, "players"), where("group", "==", groupId));
    const querySnapshot = await getDocs(q);
    const updatedplayers: any = []
    querySnapshot.forEach((doc) => {
        updatedplayers.push({ id: doc.id, name: doc.data().name })
    });
    return updatedplayers;
};

const fetchGroups = async (userEmail: string | null) => {
    const updatedGroups: Group[] = []
    const q = !!userEmail ? query(collection(db, "groups"), or(
        where("visibility", "==", "public"),
        where("members", "array-contains", userEmail),
        where("managers", "array-contains", userEmail),
        where("createdBy", "==", userEmail),
    )) : query(collection(db, "groups"), where("visibility", "==", "public"))

    const querySnapshot = await getDocs(q);
    querySnapshot?.forEach((doc) => {
        const group: Group = {
            id: doc.id,
            name: doc.data().name ? doc.data().name : "",
            createdBy: doc.data().createdBy ? doc.data().createdBy : "",
            visibility: doc.data().visibility ? doc.data().visibility : "",
            members: doc.data().members ? doc.data().members : [],
            managers: doc.data().managers ? doc.data().managers : [],
        }
        updatedGroups.push(group)
    });
    return updatedGroups;
};

const fetchMatches: (groupId: string, dateFrom?: Date, dateUntil?: Date) => Promise<any> = async (groupId: string, dateFrom?: Date, dateUntil?: Date) => {
    if (!groupId) return;
    const q = !!dateFrom && !!dateUntil
        ? query(collection(db, "groups", groupId, "matches"),
            where("date", "<=", dateUntil),
            where("date", ">=", dateFrom), orderBy('date', 'desc'))
        : query(collection(db, "groups", groupId, "matches"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const updatedMatches: any = []
    querySnapshot.forEach((doc) => {
        const date = doc.data().date;
        updatedMatches.push({ ...doc.data(), id: doc.id, date: date.toDate().toDateString() })
    });
    const grouped = _.groupBy(updatedMatches, 'date')
    return grouped;
};

const fetchLeaderboard = async (groupId: string, dateFrom?: Date, dateUntil?: Date) => {
    if (!groupId) return;
    const playerq = query(collection(db, "players"), where("group", "==", groupId));
    const playerQuerySnapshot = await getDocs(playerq);
    const playersMap: any = {};
    playerQuerySnapshot.forEach((doc) => {
        playersMap[doc.id] = { ...initialStats, id: doc.id, name: doc.data().name }
    });

    const matchq = !!dateFrom && !!dateUntil
        ? query(collection(db, "groups", groupId, "matches"),
            where("date", "<=", dateUntil),
            where("date", ">=", dateFrom))
        : query(collection(db, "groups", groupId, "matches"));
    const matchQuerySnapshot = await getDocs(matchq);
    matchQuerySnapshot.forEach((doc) => {
        const match = doc.data();
        match.teamOne.players.forEach((player: any) => {
            if (playersMap[player.id]) incrementStats(playersMap, player.id, match.teamOne.points, match.teamTwo.points);
        });
        match.teamTwo.players.forEach((player: any) => {
            if (playersMap[player.id]) incrementStats(playersMap, player.id, match.teamTwo.points, match.teamOne.points);
        });
    });

    const updatedPlayers = [] as Stats[]

    Object.keys(playersMap).forEach(key => {
        playersMap[key] = {
            ...playersMap[key],
            ratio: playersMap[key].matches > 0 ? (playersMap[key].wins / playersMap[key].matches).toFixed(2) : '0',
            gamesRatio: playersMap[key].matches > 0 ? (playersMap[key].gamesWon / playersMap[key].gamesPlayed).toFixed(2) : '0'
        }
        updatedPlayers.push(playersMap[key])
    });
    return updatedPlayers;
};
const fetchTeams = async (groupId: string) => {
    if (!groupId) return [] as Stats[];
    const q = query(collection(db, "groups", groupId, "matches"));
    const querySnapshot = await getDocs(q);
    const tsMap: Teams = {}
    querySnapshot.forEach(doc => {
        const match = doc.data()
        const players1 = _.sortBy(match.teamOne.players, 'id').map(p => p.id).join('_')
        const players2 = _.sortBy(match.teamTwo.players, 'id').map(p => p.id).join('_')

        if (!tsMap[players1])
            tsMap[players1] = { ...initialStats, id: doc.id, name: match.teamOne.players.map((p: Player) => p.name).join(" e ") };

        if (!tsMap[players2])
            tsMap[players2] = { ...initialStats, id: doc.id, name: match.teamTwo.players.map((p: Player) => p.name).join(" e ") };

        incrementStats(tsMap, players1, match.teamOne.points, match.teamTwo.points);
        incrementStats(tsMap, players2, match.teamTwo.points, match.teamOne.points);
    });
    Object.keys(tsMap).forEach(key => {
        tsMap[key] = {
            ...tsMap[key],
            ratio: tsMap[key].matches > 0 ? (tsMap[key].wins / tsMap[key].matches).toFixed(2) : '0',
            gamesRatio: tsMap[key].matches > 0 ? (tsMap[key].gamesWon / tsMap[key].gamesPlayed).toFixed(2) : '0'
        }
    })
    return Object.keys(tsMap).map(k => tsMap[k]);
};

const fetchPlayerInfo = async (groupId: string, playerId: string, dateFrom?: Date, dateUntil?: Date) => {
    const matches = await fetchMatches(groupId, dateFrom, dateUntil);
    const leaderboard = await fetchLeaderboard(groupId, dateFrom, dateUntil);
    let newData: any = [];
    Object.keys(matches).reverse().forEach(day => {
        const d = matches[day].reduce((acc: any, match: any) => {
            let won = false;
            let played = true;
            let gamesPlayed = 0;
            let gamesWon = 0;
            if (match.teamOne.players.find((p: any) => p.id === playerId)) {
                won = match.teamOne.points > match.teamTwo.points
                gamesWon += match.teamOne.points;
            } else if (match.teamTwo.players.find((p: any) => p.id === playerId)) {
                won = match.teamTwo.points > match.teamOne.points;
                gamesWon += match.teamTwo.points;
            } else played = false;

            if (played) gamesPlayed += match.teamOne.points + match.teamTwo.points;
            return {
                ...acc,
                m: acc.m + (played ? 1 : 0),
                wins: acc.wins + (won ? 1 : 0),
                gamesWon: acc.gamesWon + gamesWon,
                gamesPlayed: acc.gamesPlayed + gamesPlayed,
                ratio: (acc.wins + (won ? 1 : 0)) / (acc.m + (played ? 1 : 0)),
                gamesRatio: (acc.gamesWon + gamesWon) / (acc.gamesPlayed + gamesPlayed)
            }
        }, { m: 0, wins: 0, gamesWon: 0, gamesPlayed: 0, ratio: 0, gamesRatio: 0, accWinRatio: 0, date: day })

        const accData = newData.reduce((acc: any, dayData: any) => ({ wins: acc.wins + dayData.wins, m: acc.m + dayData.m, gamesWon: acc.gamesWon + dayData.gamesWon, gamesPlayed: acc.gamesPlayed + dayData.gamesPlayed }),
            { wins: d.wins, m: d.m, gamesWon: d.gamesWon, gamesPlayed: d.gamesPlayed })

        newData.push({ ...d, accWinRatio: accData.wins / accData.m, accGamesRatio: accData.gamesWon / accData.gamesPlayed })
    })
    return { data: newData, player: leaderboard?.find((p: Stats) => p.id === playerId) }
};

export type { Stats, Group, Player, Teams }
export { fetchGroups, fetchLeaderboard, fetchMatches, fetchPlayers, fetchTeams, fetchPlayerInfo };