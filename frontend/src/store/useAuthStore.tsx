import {create} from 'zustand'
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';
import type { AuthStoreState } from '@/types/auth';
import type { User } from '@/types/domain';

const normalizeUser = (user: Partial<User>): User => ({
  _id: user._id ?? "",
  name: user.name ?? "",
  email: user.email ?? "",
  profilePic: user.profilePic ?? null,
  bio: user.bio ?? "",
  location: user.location ?? "",
  title: user.title ?? "",
  socials: user.socials ?? user.website ?? "",
  website: user.website ?? user.socials ?? "",
  skills: user.skills ?? [],
  lastLogin: user.lastLogin,
  isVerified: user.isVerified,
});

export const useAuthStore = create<AuthStoreState>((set) => ({
    user: null,
    isCheckingAuth: true,
    authFormOpen: false,
    setAuthFormOpen: (val) => set({authFormOpen: val}),
    setUser: (user) => {
      set({
        user: user ? normalizeUser(user) : null,
        isCheckingAuth: false,
      });
    },
    refreshUser: async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
          withCredentials: true,
        })
        
        if (response.data){
          set({ user: normalizeUser(response.data), isCheckingAuth: false });
        } else {
          set({ user: null, isCheckingAuth: false });
        }
      } catch (error) {
        set({ user: null, isCheckingAuth: false });
        console.log("Error fetching user datails.", error);
      }
    },
    logout: () => set({user: null})
}))
