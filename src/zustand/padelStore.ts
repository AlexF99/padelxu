import { User } from 'firebase/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Group = {
    id: string,
    name: string,
    createdBy: string,
    visibility: string,
    members: string[],
    managers: string[],
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

type PadelState = {
    groups: Group[],
    group: Group,
    loggedUser: User,
    isLoggedIn: boolean,
    isManager: boolean,
    isMember: boolean,
    isCreator: boolean,
}

type PadelActions = {
    setGroup: (group: Group) => void
    reviewPermissions: () => void
    /* eslint-disable-next-line no-empty-pattern */
    setLoggedUser: ({ }: User) => void
    resetStore: () => void
}

const initialState = {
    groups: [] as Group[],
    group: { id: "", name: "Selecione grupo" } as Group,
    loggedUser: {} as User,
    isLoggedIn: false,
    isManager: false,
    isMember: false,
    isCreator: false,
}


export const usePadelStore = create<PadelState & PadelActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            setLoggedUser: (loggedUser: User) => {
                set((state: PadelState) => ({ ...state, loggedUser, isLoggedIn: true }));
            },
            resetStore: () => { set(initialState); },
            reviewPermissions: () => {
                const userEmail = get().loggedUser.email;
                const group = get().group;
                const isCreator: boolean = get().isLoggedIn && (group.createdBy === userEmail);
                const isManager: boolean = get().isLoggedIn && (isCreator || (!!userEmail && group.managers.includes(userEmail)));
                const isMember: boolean = get().isLoggedIn && (isCreator || isManager || (!!userEmail && group.members.includes(userEmail)));
                set((state: PadelState) => ({
                    ...state,
                    isCreator,
                    isManager,
                    isMember,
                }))
            },
            setGroup: (group: Group) => {
                const userEmail = get().loggedUser.email;
                const isCreator: boolean = get().isLoggedIn && (group.createdBy === userEmail);
                const isManager: boolean = get().isLoggedIn && (isCreator || (!!userEmail && group.managers.includes(userEmail)));
                const isMember: boolean = get().isLoggedIn && (isCreator || isManager || (!!userEmail && group.members.includes(userEmail)));
                set((state: PadelState) => ({
                    ...initialState,
                    isLoggedIn: state.isLoggedIn,
                    loggedUser: state.loggedUser,
                    groups: state.groups,
                    group,
                    isCreator,
                    isManager,
                    isMember,
                }))
            },
        }),
        {
            name: 'padel-storage', // must be unique among stores
            partialize: (state) => ({
                group: state.group,
                loggedUser: state.loggedUser,
                isLoggedIn: state.isLoggedIn,
                isCreator: state.isCreator,
                isManager: state.isManager,
                isMember: state.isMember,
            }),
        },
    ),
)