import {create} from 'zustand'
import type {User} from './userStore'
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';

type UserType = {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  // role: "member" | "admin";
  location: string;
  title: string;
  socials: string;
  skills: string[];
  lastLogin: string;
  isVerified: boolean;
}


interface AuthUser {
    user: UserType | null;
    isCheckingAuth: boolean;
    authFormOpen: boolean;
    setAuthFormOpen: (val: boolean) => void;
    setUser: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthUser>((set) => ({
    user: null,
    isCheckingAuth: true,
    authFormOpen: false,
    setAuthFormOpen: (val) => set({authFormOpen: val}),
    setUser: async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
          withCredentials: true,
        })
        
        if (response.data){
          set({ user: response.data, isCheckingAuth: false });
        }
      } catch (error) {
        set({ user: null, isCheckingAuth: false });
        console.log("Error fetching user datails.", error);
      }
    },
    logout: () => set({user: null})
}))