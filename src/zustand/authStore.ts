import { User } from 'firebase/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
    loggedUser: User,
    isLoggedIn: boolean,
}

type AuthActions = {
    // eslint-disable-next-line
    setLoggedUser: ({ }: User) => void
    signUserOut: () => void
}

const initialState = {
    loggedUser: {} as User,
    isLoggedIn: false,
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            setLoggedUser: (loggedUser: User) => {
                set((state: any) => ({ ...state, loggedUser, isLoggedIn: true }));
            },
            signUserOut: () => { set(initialState); }
        }),
        {
            name: 'auth-storage', // must be unique among stores
        },
    ),
)