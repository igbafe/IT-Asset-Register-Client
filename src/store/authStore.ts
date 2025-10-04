import { create } from "zustand";
import axios from "axios";
import Swal from "sweetalert2";

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
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
  login: (email: string, password: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
}

const url = "http://localhost:5000";

export const useAuthStore = create<AuthState>((set) => ({
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
      Swal.fire("Success", response.data.message, "success");
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
          Swal.fire("Validation Error", firstError, "error");
        } else {
          Swal.fire("Error", backendMessage || "Registration failed", "error");
        }
      } else if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      } else {
        Swal.fire("Error", "An unexpected error occurred", "error");
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
      set({ user: res.data.user, token: res.data.token });
      localStorage.setItem("token", res.data.token);
      Swal.fire("Success", res.data.message, "success");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (zodErrors && Array.isArray(zodErrors)) {
          // Display first field error (you could also join them)
          Swal.fire("Validation Error", zodErrors[0].message, "error");
        } else {
          Swal.fire("Error", backendMessage || "Login failed", "error");
        }
      } else if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      } else {
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
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
      set({ user: res.data.user, token: res.data.token });
      localStorage.setItem("token", res.data.token);
      Swal.fire("Success", res.data.message, "success");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (zodErrors && Array.isArray(zodErrors)) {
          // Display first field error (you could also join them)
          Swal.fire("Validation Error", zodErrors[0].message, "error");
        } else {
          Swal.fire(
            "Error",
            backendMessage || "OTP verification failed",
            "error"
          );
        }
      } else if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      } else {
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    } finally {
      set({ loading: false });
    }
  },

  resendOtp: async (email) => {
    set({ loading: true });
    try {
      await axios.post(`${url}/api/user/resend-otp`, { email });
      Swal.fire("Success", "OTP resent to your email", "success");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        Swal.fire("Error", backendMessage || "Failed to resend OTP", "error");
      } else if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      } else {
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
    Swal.fire("Success", "Logged out successfully", "success");
  },
}));
