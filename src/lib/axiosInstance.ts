// lib/axiosInstance.ts
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(promise =>
    error ? promise.reject(error) : promise.resolve()
  );
  failedQueue = [];
};

// Reset refresh state on auth requests
axiosInstance.interceptors.request.use(
  config => {
    const isAuthRoute = ['/user/login', '/user/register'].some(
      route => config.url?.includes(route)
    );
    
    if (isAuthRoute) {
      isRefreshing = false;
      failedQueue = [];
    }
    
    return config;
  }
);

axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    if (!error.config) return Promise.reject(error);

    const originalRequest = error.config;

    const isAuthRoute = [
      "/user/login",
      "/user/register",
      "/user/refresh",
    ].some(route => originalRequest.url?.includes(route));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/user/refresh");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);
        // Only redirect if we're not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;