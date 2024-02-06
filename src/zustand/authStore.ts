import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthState = {
    loggedUser: {},
    isLoggedIn: boolean,
    setLoggedUser: ({ }) => void
    signUserOut: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            loggedUser: {},
            isLoggedIn: false,
            setLoggedUser: (loggedUser: {}) => {
                set((state: any) => ({ ...state, loggedUser, isLoggedIn: true }));
            },
            signUserOut: () => { set((state: any) => ({ ...state, loggedUser: {}, isLoggedIn: false })) }
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        },
    ),
)