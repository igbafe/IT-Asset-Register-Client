import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import type { AuthState } from "@/types/types";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      register: async (firstName, lastName, email, password) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${backendUrl}/user/register`, {
            firstName,
            lastName,
            email,
            password,
          });
          set({ user: { _id: "", firstName, lastName, email } });
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
