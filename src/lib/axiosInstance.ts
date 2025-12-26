import { backendUrl, useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Get token from Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Optional: Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      // Redirect to login or refresh token
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
