import axios from "axios"
import { BASE_URL } from "./apiPaths"
import { useUserStore } from "@/store/userStore";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
    headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

// req interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

// res interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        if (error.response.status === 401){
            // token not found
            // Redirect to login Page
            // window.location.href= "/";

            const { clearUser, setAuthOpenForm } = useUserStore.getState();

            clearUser();
            setAuthOpenForm(true);
        }
        else if (error.response.status === 500){
            console.error("Server error. Please try again later");
        }
        else if (error.code === "ECONNABORTED"){
            console.error("Request timeout. Please try again.")
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;