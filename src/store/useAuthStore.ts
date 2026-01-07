import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import type { AuthState } from "@/types/types";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Configure axios to include token in headers
axios.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      register: async (name, email, password) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${backendUrl}/user/register`, {
            name,
            email,
            password,
          });
          set({ user: { _id: "", name, email } });
          return {
            success: true,
            message: response.data.message || "Registration successful",
          };
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            const zodErrors = error.response?.data?.errors;

            if (zodErrors && Array.isArray(zodErrors)) {
              const firstError =
                typeof zodErrors[0] === "string"
                  ? zodErrors[0]
                  : zodErrors[0].message;
              return {
                success: false,
                error: firstError || "Validation error",
              };
            } else {
              return {
                success: false,
                error: backendMessage || "Registration failed",
              };
            }
          } else if (error instanceof Error) {
            return { success: false, error: error.message };
          } else {
            return { success: false, error: "An unexpected error occurred" };
          }
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await axios.post(`${backendUrl}/user/login`, {
            email,
            password,
          });
          const { user, token } = res.data;

          set({ user, token });

          return {
            success: true,
            message: res.data.message || "Login successful",
          };
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            const zodErrors = error.response?.data?.errors;

            if (zodErrors && Array.isArray(zodErrors)) {
              return {
                success: false,
                error: zodErrors[0].message || "Validation error",
              };
            } else {
              return {
                success: false,
                error: backendMessage || "Login failed",
              };
            }
          } else if (error instanceof Error) {
            return { success: false, error: error.message };
          } else {
            return { success: false, error: "An unexpected error occurred" };
          }
        } finally {
          set({ loading: false });
        }
      },

      loginWithGoogle: () => {
        window.location.href = `${backendUrl}/user/google`;
      },

      setTokenFromOAuth: async (token: string) => {
        set({ token, loading: true });

        try {
          // Fetch user data with the new token
          await get().getCurrentUser();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          set({ loading: false });
        }
      },

      // NEW: Get current user data
      getCurrentUser: async () => {
        const { token } = get();

        if (!token) {
          set({ user: null, loading: false });
          return;
        }

        set({ loading: true });

        try {
          const response = await axios.get(`${backendUrl}/user/me`);

          set({
            user: response.data.user,
            loading: false,
          });
        } catch (error: unknown) {
          // Token might be invalid, clear auth state
          console.error("Failed to get current user:", error);
          set({
            user: null,
            token: null,
            loading: false,
          });
        }
      },

      unlinkGoogle: async () => {
        const { token } = get();

        if (!token) {
          return {
            success: false,
            error: "Not authenticated",
          };
        }

        set({ loading: true });

        try {
          const response = await axios.post(
            `${backendUrl}/user/unlink-google`,
            {}
          );

          // Refresh user data
          await get().getCurrentUser();

          return {
            success: true,
            message:
              response.data.message || "Google account unlinked successfully",
          };
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            return {
              success: false,
              error:
                error.response?.data?.message ||
                "Failed to unlink Google account",
            };
          } else if (error instanceof Error) {
            return { success: false, error: error.message };
          } else {
            return { success: false, error: "An unexpected error occurred" };
          }
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
