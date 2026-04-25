import {create} from 'zustand'
// import axiosInstance from '@/utils/axiosInstance';
// import { API_PATHS } from '@/utils/apiPaths';
import type { AuthStoreState } from '@/types/auth';
import type { User } from '@/types/domain';
import { authClient, signOut, useSession } from '@/lib/auth-client';

const normalizeUser = (user: any): User => ({
  _id: user.id ?? user._id ?? "",
  name: user.name ?? "",
  email: user.email ?? "",
  profilePic: user.image ?? user.profilePic ?? null,
  bio: user.bio ?? "",
  location: user.location ?? "",
  title: user.title ?? "",
  socials: user.socials ?? user.website ?? "",
  website: user.website ?? user.socials ?? "",
  skills: user.skills ?? [],
  lastLogin: user.lastLogin,
  isVerified: user.emailVerified ?? user.isVerified ?? false,
});

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isCheckingAuth: true,
  authFormOpen: false,
  authType: "signup",
  setAuthType: (val) => set({authType: val}),
  setAuthFormOpen: (val) => set({ authFormOpen: val}),
  setUser: (user) => {
    set({
      user: user ? normalizeUser(user) : null,
      isCheckingAuth: false,
    });
  },
  refreshUser: async () => {
    try {
      const { data, error } = await authClient.getSession();
        
      if (data?.user && !error) {
        set({ user: normalizeUser(data.user), isCheckingAuth: false });
      } else {
        set({ user: null, isCheckingAuth: false });
      }
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      console.log("Error fetching user datails.", error);
    }
  },
  logout: async () => {
    await signOut();
    set({ user: null });
  }
}));
