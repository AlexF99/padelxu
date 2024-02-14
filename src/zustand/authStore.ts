import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
    loggedUser: {},
    isLoggedIn: boolean,
}

type AuthActions = {
    // eslint-disable-next-line
    setLoggedUser: ({ }) => void
    signUserOut: () => void
}

const initialState = {
    loggedUser: {} as any,
    isLoggedIn: false,
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            setLoggedUser: (loggedUser) => {
                set((state: any) => ({ ...state, loggedUser, isLoggedIn: true }));
            },
            signUserOut: () => { set(initialState); }
        }),
        {
            name: 'auth-storage', // must be unique among stores
        },
    ),
)