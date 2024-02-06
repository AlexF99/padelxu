import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
    loggedUser: {},
    isLoggedIn: boolean,
}

type AuthActions = {
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
            loggedUser: {} as any,
            isLoggedIn: false,
            setLoggedUser: (loggedUser) => {
                set((state: any) => ({ ...state, loggedUser, isLoggedIn: true }));
            },
            signUserOut: () => { set(initialState) }
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        },
    ),
)