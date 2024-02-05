import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from '../firebase';
import { combine } from 'zustand/middleware'

export const useStore = create(
    combine({
        players: [],
        matches: [],
        leaderboard: {},
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
    })),
)