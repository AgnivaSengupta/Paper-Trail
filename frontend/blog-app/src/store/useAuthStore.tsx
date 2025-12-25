import { create } from 'zustand'
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';

export interface User {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
    bio?: string;
    role?: "member" | "admin";
}

interface AuthUser {
    user: User | null;
    authFormOpen: boolean;
    loading: boolean;
    setAuthFormOpen: (val: boolean) => void;
    setUser: (user: User | null) => void;
    fetchProfile: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthUser>((set) => ({
    user: null,
    authFormOpen: false,
    loading: true,
    setAuthFormOpen: (val) => set({ authFormOpen: val }),
    setUser: (user) => set({ user: user, loading: false }),
    fetchProfile: async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            set({ user: response.data, loading: false });
        } catch (error) {
            set({ user: null, loading: false });
            console.error("Error fetching profile:", error);
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
            set({ user: null });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
}))
