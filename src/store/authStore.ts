import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  avatar?: string;
}

interface AuthResult {
  success: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResult>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
}

const url = "http://localhost:5000";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      register: async (name, email, password) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${url}/api/user/register`, {
            name,
            email,
            password,
          });
          set({ user: { _id: "", name, email, isVerified: false } });
          toast.success(response.data.message || "Registration successful");
          return { success: true };
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            const zodErrors = error.response?.data?.errors;

            if (zodErrors && Array.isArray(zodErrors)) {
              const firstError =
                typeof zodErrors[0] === "string"
                  ? zodErrors[0]
                  : zodErrors[0].message;
              toast.error(firstError || "Validation error");
            } else {
              toast.error(backendMessage || "Registration failed");
            }
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await axios.post(`${url}/api/user/login`, {
            email,
            password,
          });
          const { user, token } = res.data;

          // Store in state (persist middleware will handle localStorage)
          set({ user, token });

          toast.success(res.data.message || "Login successful");
          return { success: true };
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            const zodErrors = error.response?.data?.errors;

            if (zodErrors && Array.isArray(zodErrors)) {
              toast.error(zodErrors[0].message || "Validation error");
            } else {
              toast.error(backendMessage || "Login failed");
            }
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      verifyOtp: async (email, otp) => {
        set({ loading: true });
        try {
          const res = await axios.post(`${url}/api/user/verify-otp`, {
            email,
            otp,
          });
          const { user, token } = res.data;

          // Store in state (persist middleware will handle localStorage)
          set({ user, token });

          toast.success(res.data.message || "OTP verified successfully");
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            const zodErrors = error.response?.data?.errors;

            if (zodErrors && Array.isArray(zodErrors)) {
              toast.error(zodErrors[0].message || "Validation error");
            } else {
              toast.error(backendMessage || "OTP verification failed");
            }
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        } finally {
          set({ loading: false });
        }
      },

      resendOtp: async (email) => {
        set({ loading: true });
        try {
          await axios.post(`${url}/api/user/resend-otp`, { email });
          toast.success("OTP resent to your email");
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            toast.error(backendMessage || "Failed to resend OTP");
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null });
        toast.success("Logged out successfully");
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
