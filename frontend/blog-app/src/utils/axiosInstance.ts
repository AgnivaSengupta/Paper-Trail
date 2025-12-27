import axios from "axios";
import { BASE_URL } from "./apiPaths";
import { useUserStore } from "@/store/userStore";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // CRITICAL: This sends cookies automatically
});

// req interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // No need to manually add token - cookies are sent automatically with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// res interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response.status === 401) {
      // token not found
      // Redirect to login Page
      // window.location.href= "/";

      const { clearUser, setOpenAuthForm } = useUserStore.getState();

      clearUser();
      setOpenAuthForm(true);
    } else if (error.response.status === 500) {
      console.error("Server error. Please try again later");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
