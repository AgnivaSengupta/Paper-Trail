import {create} from 'zustand'
import type {User} from './userStore'

interface AuthUser {
    user: User | null;
    authFormOpen: boolean;
    setAuthFormOpen: (val: boolean) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthUser>((set) => ({
    user: null,
    authFormOpen: false,
    setAuthFormOpen: (val) => set({authFormOpen: val}),
    setUser: (user) => set({user: user}),
    logout: () => set({user: null})
}))