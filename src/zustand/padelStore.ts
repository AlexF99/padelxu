import { User } from 'firebase/auth'
import { collection, getDocs, or, orderBy, query, where } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from '../firebase';
import { persist } from 'zustand/middleware'
import _ from 'lodash';

export type Group = {
    id: string,
    name: string
}

type Player = {
    id: string,
    name: string
}

export type Stats = {
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

type PadelState = {
    groups: Group[],
    group: Group,
    players: Player[],
    matches: any,
    leaderboard: Stats[],
    teams: Stats[],
    isLoading: boolean,
    loggedUser: User,
    isLoggedIn: boolean,
}

type PadelActions = {
    setIsLoading: (loadingState: boolean) => void
    fetchPlayers: () => Promise<void>
    fetchGroups: (userEmail: string | null) => Promise<void>
    setGroup: (group: Group) => void
    fetchMatches: () => Promise<void>
    fetchLeaderboard: () => Promise<void>
    fetchTeams: () => Promise<void>
    /* eslint-disable-next-line no-empty-pattern */
    setLoggedUser: ({ }: User) => void
    signUserOut: () => void
}

const initialStats = { id: "", name: "", wins: 0, gamesWon: 0, gamesPlayed: 0, matches: 0, ratio: '0', gamesRatio: '0' };

const incrementStats = (object: any, index: string, mypoints: number, theirpoints: number) => {
    object[index] = {
        ...object[index],
        gamesWon: object[index].gamesWon + mypoints,
        gamesPlayed: object[index].gamesPlayed + mypoints + theirpoints,
        wins: object[index].wins + (mypoints > theirpoints ? 1 : 0),
        matches: object[index].matches + 1
    };
}

const initialState = {
    groups: [] as Group[],
    group: { id: "", name: "Selecione grupo" } as Group,
    players: [] as Player[],
    matches: {} as any,
    leaderboard: [] as Stats[],
    teams: [] as Stats[],
    isLoading: false,
    loggedUser: {} as User,
    isLoggedIn: false,
}


export const usePadelStore = create<PadelState & PadelActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            setIsLoading: (value: boolean) => {
                set((state: PadelState) => ({ ...state, isLoading: value }));
            },
            setLoggedUser: (loggedUser: User) => {
                set((state: PadelState) => ({ ...state, loggedUser, isLoggedIn: true }));
            },
            signUserOut: () => { set(initialState); },
            fetchPlayers: async () => {
                if (!get().group.id) return;
                const q = query(collection(db, "players"), where("group", "==", get().group.id));
                const querySnapshot = await getDocs(q);
                const updatedplayers: any = []
                querySnapshot.forEach((doc) => {
                    updatedplayers.push({ id: doc.id, name: doc.data().name })
                });
                set((state: PadelState) => ({ ...state, players: updatedplayers }));
            },
            fetchGroups: async (userEmail: string | null) => {
                const updatedGroups: Group[] = []
                const q = !!userEmail ? query(collection(db, "groups"), or(
                    where("visibility", "==", "public"),
                    where("members", "array-contains", userEmail),
                    where("managers", "array-contains", userEmail),
                )) : query(collection(db, "groups"), where("visibility", "==", "public"))

                const querySnapshot = await getDocs(q);
                querySnapshot?.forEach((doc) => {
                    updatedGroups.push({ id: doc.id, name: doc.data().name })
                });
                set((state: PadelState) => ({ ...state, groups: updatedGroups }));
            },
            setGroup: (group: Group) => { set((state: PadelState) => ({ ...initialState, isLoggedIn: state.isLoggedIn, loggedUser: state.loggedUser, groups: state.groups, group })) },
            fetchMatches: async () => {
                if (!get().group.id) return;
                const q = query(collection(db, "groups", get().group.id, "matches"), orderBy("date", "desc"));
                const querySnapshot = await getDocs(q);
                const updatedMatches: any = []
                querySnapshot.forEach((doc) => {
                    const date = doc.data().date;
                    updatedMatches.push({ ...doc.data(), id: doc.id, date: date.toDate().toDateString() })
                });
                const grouped = _.groupBy(updatedMatches, 'date')
                set((state: PadelState) => ({ ...state, matches: grouped }));
            },
            fetchLeaderboard: async () => {
                if (!get().group.id) return;
                const playerq = query(collection(db, "players"), where("group", "==", get().group.id));
                const playerQuerySnapshot = await getDocs(playerq);
                const playersMap: any = {};
                playerQuerySnapshot.forEach((doc) => {
                    playersMap[doc.id] = { ...initialStats, id: doc.id, name: doc.data().name }
                });

                const matchq = query(collection(db, "groups", get().group.id, "matches"));
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
                })

                set((state: PadelState) => ({
                    ...state,
                    leaderboard: updatedPlayers,
                }));
            },
            fetchTeams: async () => {
                if (!get().group.id) return;
                const q = query(collection(db, "groups", get().group.id, "matches"));
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
                set((state: PadelState) => ({
                    ...state,
                    teams: Object.keys(tsMap).map(k => tsMap[k]),
                }));
            },
        }),
        {
            name: 'padel-storage', // must be unique among stores
            partialize: (state) => ({
                group: state.group,
                loggedUser: state.loggedUser,
                isLoggedIn: state.isLoggedIn,
            }),
        },
    ),
)