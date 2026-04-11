// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/types/types";
import axiosInstance from "@/lib/axiosInstance";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      checkAuth: async () => {
        try {
          const { data } = await axiosInstance.get("/user/profile");
          set({ user: data.user, loading: false });
          return true;
        } catch (error) {
          set({ user: null, loading: false });
          return false;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axiosInstance.post("/user/login", {
            email,
            password,
          });

          set({ user: data.user, loading: false });

          return { success: true };
        } catch (error: any) {
          const msg = error.response?.data?.message || "Login failed";
          set({ error: msg, loading: false });
          return { success: false, error: msg };
        }
      },

      register: async (firstName, lastName, email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axiosInstance.post("/user/register", {
            firstName,
            lastName,
            email,
            password,
          });

          set({ user: data.user, loading: false });
          return { success: true };
        } catch (error: any) {
          const msg = error.response?.data?.message || "Registration failed";
          set({ error: msg, loading: false });
          return { success: false, error: msg };
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/user/logout");
        } catch (error) {
        } finally {
          set({ user: null, error: null });
        }
      },

      clearError: () => set({ error: null }),

      isAuthenticated: () => !!get().user,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
