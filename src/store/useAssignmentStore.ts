import type { AssignmentState } from "@/types/types";
import { create } from "zustand";
import { backendUrl } from "./useAuthStore";
import axios from "axios";
import { toast } from "react-toastify";

export const useAssignmentStore = create<AssignmentState>((set) => ({
  laptop: null,
  loading: false,
  error: null,

  // Assign laptop
  assignLaptop: async (id, user) => {
    try {
      set({ loading: true });
      const res = await axios.post(`${backendUrl}/laptops/${id}/assign`, user);
      set({ laptop: res.data.data, loading: false, error: null });
      return { success: true };
    } catch (error: unknown) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          toast.error(`Validation Error: ${firstError}`);
        } else {
          toast.error(backendMessage || "Failed to assign laptop");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      return { success: false };
    }
  },

  // Reassign laptop
  reassignLaptop: async (id, user) => {
    try {
      set({ loading: true });
      const res = await axios.put(`${backendUrl}/laptops/${id}/reassign`, user);
      set({ laptop: res.data.data, loading: false, error: null });
      return { success: true };
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          toast.error(`Validation Error: ${firstError}`);
        } else {
          toast.error(backendMessage || "Failed to reassign laptop");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      return { success: false };
    }
  },

  // Update current user
  updateCurrentUser: async (id, updates) => {
    try {
      set({ loading: true });
      const res = await axios.put(
        `${backendUrl}/laptops/${id}/update-user`,
        updates
      );
      set({ laptop: res.data.data, loading: false, error: null });
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          toast.error(`Validation Error: ${firstError}`);
        } else {
          toast.error(backendMessage || "Failed to update user");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  // Return laptop
  returnCurrentUser: async (id) => {
    try {
      set({ loading: true });
      const res = await axios.put(`${backendUrl}/laptops/${id}/return`);
      set({ laptop: res.data.data, loading: false, error: null });
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          toast.error(`Validation Error: ${firstError}`);
        } else {
          toast.error(backendMessage || "Failed to return laptop");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  // Get all users for a laptop
  getAllUsers: async (id) => {
    try {
      set({ loading: true });
      const res = await axios.get(`${backendUrl}/laptops/${id}/users`);
      set({ laptop: res.data.data, loading: false, error: null });
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          toast.error(`Validation Error: ${firstError}`);
        } else {
          toast.error(backendMessage || "Failed to fetch users");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },
}));
