import { API_PATHS } from "@/utils/apiPaths"
import axiosInstance from "@/utils/axiosInstance"
import { create } from "zustand"

// user, setUser -> null
// loading, setLoading -> true
// openAuthform, setOpenAuthForm ->false

// if user -> return --> user already logged in
// else check accessToken from localStorge

export interface User {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
    bio?: string;
    role: "member" | "admin";
    token?: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    openAuthForm: boolean;

    setOpenAuthForm: (isOpen: boolean) => void;
    clearUser: () => void;
    fetchUser: () => void;
    updateUser: (userData: any) => void;
}


export const useUserStore = create<AuthState>((set) => ({
    user: null, 
    loading: true,
    openAuthForm: false,


    // fetching the user details from user profile
    fetchUser: async () => {
        const token = localStorage.getItem("token");
        if (!token){
            set({user: null, loading: false});
            return;
        }

        try{
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            set({user: response.data})
        } catch(error){
            console.error("User not authenticated", error);
            set({user: null});

            localStorage.removeItem("token"); 
        } finally {
            set({ loading: false});
        }
    },

    // update user after login/signup
    updateUser: (userData) => {
        set({user: userData, loading: false});
        if (userData.token){
            localStorage.setItem("token", userData.token);
        }
    },

    // clear the token for logout
    clearUser: () => {
        set({user: null});
        localStorage.removeItem("token");
    },

    setOpenAuthForm: (isOpen) => set({openAuthForm: isOpen})
}));