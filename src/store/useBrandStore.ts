import { create } from "zustand";
import { backendUrl } from "./useAuthStore";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import type { BrandState } from "@/types/types";

const useBrandStore = create<BrandState>((set) => ({
  brand: [],
  loading: false,
  error: null,

  createBrand: async (brandName, models) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `${backendUrl}/laptops/brands`,
        { brandName, models },
      );
      set({ loading: false });
      return {
        success: true,
        message: response.data.message || "Brand created successfully",
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
            error: backendMessage || "Failed to create brand",
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

  fetchBrands: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `${backendUrl}/laptops/all/brands`,
      );
      set({ brand: response.data.data, loading: false });
      return {
        success: true,
        message: response.data.message || "Brands fetched successfully",
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
            error: backendMessage || "Failed to fetch QR code",
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

  fetchModelsByBrand: async (brandName) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `${backendUrl}/laptops/brands/${brandName}/models`,
      );
      set({ brand: response.data.data, loading: false });
      return {
        success: true,
        message: response.data.message || "Models fetched successfully",
      };
    } catch (error) {
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
            error: backendMessage || "Failed to fetch models",
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

  addModelToBrand: async (brandName, model) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `${backendUrl}/laptops/brands/${brandName}/models`,
        { model },
      );
      set({ loading: false });
      return {
        success: true,
        message: response.data.message || "Model added successfully",
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
            error: backendMessage || "Failed to add model",
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

  removeModelFromBrand: async (brandName, model) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `${backendUrl}/laptops/brands/${brandName}/models/${model}`,
      );
      set({ loading: false });
      return {
        success: true,
        message: response.data.message || "Model removed successfully",
      };
    } catch (error) {
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
            error: backendMessage || "Failed to remove model",
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

  deleteBrand: async (brandName) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `${backendUrl}/laptops/brands/${brandName}`,
      );
      set({ loading: false });

      return {
        success: true,
        message: response.data.message || "Brand deleted successfully",
      };
    } catch (error) {
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
            error: backendMessage || "Failed to delete brand",
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
  setBrand: (brands) => set({ brand: brands }),
}));

export default useBrandStore;
