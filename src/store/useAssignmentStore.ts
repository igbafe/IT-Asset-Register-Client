import type { AssignmentState } from "@/types/types";
import { create } from "zustand";
import { useLaptopStore } from "./useLaptopStore";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";

export const useAssignmentStore = create<AssignmentState>((set) => ({
  laptop: null,
  loading: false,
  error: null,

  // Assign laptop
  assignLaptop: async (id, user) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post(`/laptops/${id}/assign`, user);
      set({ laptop: res.data.data, loading: false, error: null });

      // Refetch laptops to update the table
      await useLaptopStore.getState().fetchLaptops();

      return {
        success: true,
        message: res.data.message || "Registration successful",
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
            error: backendMessage || "Assignment failed",
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

  // Reassign laptop
  reassignLaptop: async (id, user) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put(`/laptops/${id}/reassign`, user);
      set({ laptop: res.data.data, loading: false, error: null });

      // Refetch laptops to update the table
      await useLaptopStore.getState().fetchLaptops();

      return {
        success: true,
        message: res.data.message || "Registration successful",
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
            error: backendMessage || "Reassignment failed",
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

  // Update current user
  updateCurrentUser: async (id, updates) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put(
        `/laptops/${id}/update-user`,
        updates
      );
      set({ laptop: res.data.data, loading: false, error: null });

      // Refetch laptops to update the table
      await useLaptopStore.getState().fetchLaptops();

      return {
        success: true,
        message: res.data.message || "Registration successful",
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
            error: backendMessage || "Update failed",
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

  // Return laptop
  returnCurrentUser: async (id) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put(`/laptops/${id}/return`);
      set({ laptop: res.data.data, loading: false, error: null });

      // Refetch laptops to update the table
      await useLaptopStore.getState().fetchLaptops();
      return {
        success: true,
        message: res.data.message || "Registration successful",
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
            error: backendMessage || "Return failed",
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

  // Get all users for a laptop
  getAllUsers: async (id) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/laptops/${id}/users`);
      set({ laptop: res.data.data, loading: false, error: null });
      return {
        success: true,
        message: res.data.message || "Registration successful",
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
            error: backendMessage || "Failed to fetch users",
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
}));
