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
    // eslint-disable-next-line @typescript-eslint/no-empty-pattern
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
            signUserOut: () => { set((state) => ({ ...state, ...initialState })); }
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        },
    ),
)