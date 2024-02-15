import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from '../firebase';
import { persist } from 'zustand/middleware'
import _ from 'lodash';

export enum Criteria {
    WINS = 'wins',
    SETS = 'sets',
    RATIO = 'ratio',
    MATCHES = 'matches',
}

export type Group = {
    id: string,
    name: string
}

type Player = {
    id: string,
    name: string
}

type Stats = {
    name: string,
    wins: number,
    sets: number,
    setsPlayed: number
    matches: number,
    ratio: number,
}

type Teams = {
    [ids: string]: Stats
}

const initialStats = { name: "", wins: 0, sets: 0, setsPlayed: 0, matches: 0, ratio: 0 };

const incrementStats = (object: any, index: string, mypoints: number, theirpoints: number) => {
    object[index] = {
        ...object[index],
        sets: object[index].sets + mypoints,
        setsPlayed: object[index].setsPlayed + mypoints + theirpoints,
        wins: object[index].wins + (mypoints > theirpoints ? 1 : 0),
        matches: object[index].matches + 1
    };
}

const initialState = {
    groups: [] as Group[],
    group: { id: "", name: "" } as Group,
    players: [],
    matches: {} as any,
    leaderboard: {} as any,
    leaderboardKeys: [] as any,
    teams: {} as Teams,
    teamKeys: [] as string[],
    criteria: Criteria.WINS,
    teamsCriteria: Criteria.WINS,
    isLoading: false,
}

type PadelState = {
    groups: Group[],
    group: Group,
    players: [],
    matches: any,
    leaderboard: any,
    leaderboardKeys: any,
    teams: Teams,
    teamKeys: string[],
    criteria: Criteria,
    teamsCriteria: Criteria,
    isLoading: false,
}

export const usePadelStore = create<PadelState & any>()(
    persist(
        (set, get) => ({
            ...initialState,
            reset: () => { set(initialState) },
            setIsLoading: (value: boolean) => {
                set((state: PadelState) => ({ ...state, isLoading: value }));
            },
            fetchPlayers: async () => {
                const q = query(collection(db, "players"), where("group", "==", get().group.id));
                const querySnapshot = await getDocs(q);
                const updatedplayers: any = []
                querySnapshot.forEach((doc) => {
                    updatedplayers.push({ id: doc.id, name: doc.data().name })
                });
                set((state: PadelState) => ({ ...state, players: updatedplayers }));
            },
            fetchGroups: async () => {
                const q = query(collection(db, "groups"));
                const querySnapshot = await getDocs(q);
                const updatedGroups: Group[] = []
                querySnapshot.forEach((doc) => {
                    updatedGroups.push({ id: doc.id, name: doc.data().name })
                });
                set((state: PadelState) => ({ ...state, groups: updatedGroups }));
            },
            setGroup: (group: Group) => { set((state: PadelState) => ({ ...initialState, groups: state.groups, group })) },
            fetchMatches: async () => {
                const q = query(collection(db, "matches"), orderBy("date", "desc"), where("group", "==", get().group.id));
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
                const playerq = query(collection(db, "players"), where("group", "==", get().group.id));
                const playerQuerySnapshot = await getDocs(playerq);
                const updatedplayers: any = {};
                playerQuerySnapshot.forEach((doc) => {
                    updatedplayers[doc.id] = { ...initialStats, name: doc.data().name }
                });

                const matchq = query(collection(db, "matches"), where("group", "==", get().group.id));
                const matchQuerySnapshot = await getDocs(matchq);
                matchQuerySnapshot.forEach((doc) => {
                    const match = doc.data();
                    match.teamOne.players.forEach((player: any) => {
                        if (updatedplayers[player.id]) incrementStats(updatedplayers, player.id, match.teamOne.points, match.teamTwo.points);
                    });
                    match.teamTwo.players.forEach((player: any) => {
                        if (updatedplayers[player.id]) incrementStats(updatedplayers, player.id, match.teamTwo.points, match.teamOne.points);
                    });
                });

                Object.keys(updatedplayers).forEach(key => updatedplayers[key] = {
                    ...updatedplayers[key],
                    ratio: updatedplayers[key].matches > 0 ? (updatedplayers[key].wins / updatedplayers[key].matches).toFixed(2) : 0
                })
                set((state: PadelState) => ({
                    ...state,
                    leaderboard: updatedplayers,
                    leaderboardKeys: Object.keys(updatedplayers).sort(function (a, b) { return updatedplayers[b][`${state.criteria}`] - updatedplayers[a][`${state.criteria}`] })
                }));
            },
            setCriteria: (criteria: any) => {
                set((state: PadelState) => ({
                    ...state,
                    leaderboardKeys: Object.keys(state.leaderboard).sort(function (a, b) { return state.leaderboard[b][criteria] - state.leaderboard[a][criteria] }),
                    criteria: criteria
                }));
            },
            fetchTeams: async () => {
                const q = query(collection(db, "matches"), where("group", "==", get().group.id));
                const querySnapshot = await getDocs(q);
                const tsMap: Teams = {}
                querySnapshot.forEach(doc => {
                    const match = doc.data()
                    const players1 = _.sortBy(match.teamOne.players, 'id').map(p => p.id).join('_')
                    const players2 = _.sortBy(match.teamTwo.players, 'id').map(p => p.id).join('_')

                    if (!tsMap[players1])
                        tsMap[players1] = { ...initialStats, name: match.teamOne.players.map((p: Player) => p.name).join(" e ") };

                    if (!tsMap[players2])
                        tsMap[players2] = { ...initialStats, name: match.teamTwo.players.map((p: Player) => p.name).join(" e ") };

                    incrementStats(tsMap, players1, match.teamOne.points, match.teamTwo.points);
                    incrementStats(tsMap, players2, match.teamTwo.points, match.teamOne.points);
                });
                set((state: PadelState) => ({
                    ...state,
                    teams: tsMap,
                    teamKeys: Object.keys(tsMap).sort(function (a, b) { return tsMap[b][Criteria.WINS] - tsMap[a][Criteria.WINS] })
                }));
            },
            setTeamKeys: (criteria: Criteria) => {
                set((state: PadelState) => ({
                    ...state,
                    teamKeys: Object.keys(state.teams).sort(function (a, b) { return state.teams[b][criteria] - state.teams[a][criteria] }),
                    teamsCriteria: criteria
                }));
            },
        }),
        {
            name: 'padel-storage', // must be unique among stores
        },
    ),
)