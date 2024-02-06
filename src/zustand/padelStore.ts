import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from '../firebase';
import { combine } from 'zustand/middleware'

export enum Criteria {
    WINS = 'wins',
    SETS = 'sets',
    RATIO = 'ratio',
}

export const usePadelStore = create(
    combine({
        players: [],
        matches: [],
        leaderboard: {} as any,
        leaderboardKeys: [] as any,
        criteria: Criteria.WINS,
        isLoading: false,
    }, (set) => ({
        setIsLoading: (value: boolean) => {
            set((state) => ({ ...state, isLoading: value }));
        },
        fetchPlayers: async () => {
            const q = query(collection(db, "players"));
            const querySnapshot = await getDocs(q);
            const updatedplayers: any = []
            querySnapshot.forEach((doc) => {
                updatedplayers.push({ id: doc.id, name: doc.data().name })
            });
            set((state) => ({ ...state, players: updatedplayers }));
        },
        fetchMatches: async () => {
            const q = query(collection(db, "matches"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const updatedMatches: any = []
            querySnapshot.forEach((doc) => {
                updatedMatches.push({ id: doc.id, ...doc.data() })
            });
            set((state) => ({ ...state, matches: updatedMatches }));
        },
        fetchLeaderboard: async () => {
            const playerq = query(collection(db, "players"));
            const playerQuerySnapshot = await getDocs(playerq);
            const updatedplayers: any = {};
            playerQuerySnapshot.forEach((doc) => {
                updatedplayers[doc.id] = { name: doc.data().name, wins: 0, sets: 0, matches: 0 }
            });

            const matchq = query(collection(db, "matches"));
            const matchQuerySnapshot = await getDocs(matchq);
            matchQuerySnapshot.forEach((doc) => {
                const match = doc.data();
                match.teamOne.players.forEach((player: any) => {
                    if (updatedplayers[player.id]) {
                        updatedplayers[player.id] = {
                            ...updatedplayers[player.id],
                            sets: updatedplayers[player.id].sets + match.teamOne.points,
                            wins: updatedplayers[player.id].wins + (match.teamOne.points > match.teamTwo.points ? 1 : 0),
                            matches: updatedplayers[player.id].matches + 1
                        }
                    }
                });
                match.teamTwo.players.forEach((player: any) => {
                    if (updatedplayers[player.id]) {
                        updatedplayers[player.id] = {
                            ...updatedplayers[player.id],
                            sets: updatedplayers[player.id].sets + match.teamTwo.points,
                            wins: updatedplayers[player.id].wins + (match.teamTwo.points > match.teamOne.points ? 1 : 0),
                            matches: updatedplayers[player.id].matches + 1
                        }
                    }
                });
            });

            Object.keys(updatedplayers).forEach(key => updatedplayers[key] = {
                ...updatedplayers[key],
                ratio: updatedplayers[key].matches > 0 ? (updatedplayers[key].wins / updatedplayers[key].matches).toFixed(2) : 0
            })
            set((state) => ({
                ...state,
                leaderboard: updatedplayers,
                leaderboardKeys: Object.keys(updatedplayers).sort(function (a, b) { return updatedplayers[b][`${state.criteria}`] - updatedplayers[a][`${state.criteria}`] })
            }));
        },
        setCriteria: (criteria: any) => {
            set((state) => ({
                ...state,
                leaderboardKeys: Object.keys(state.leaderboard).sort(function (a, b) { return state.leaderboard[b][criteria] - state.leaderboard[a][criteria] }),
                criteria: criteria
            }));
        }
    })),
)