import { create } from "zustand";
import axiosInstance, { backendUrl } from "@/lib/axiosInstance";
import axios from "axios";
import type { BrandState } from "@/types/types";

const useBrandStore = create<BrandState>((set) => ({
  brand: [],
  loading: false,
  error: null,
  selectedBrand: null,

  createBrand: async (brandName, models) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `${backendUrl}/laptops/brands`,
        { brandName, models },
      );

      // Add the new brand to the local state
      const newBrand = response.data.data || { brandName, models };
      set((state) => ({
        brand: [...state.brand, newBrand],
        loading: false,
      }));

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
            error: backendMessage || "Failed to fetch brands",
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

      // Update the specific brand's models in the state
      set((state) => ({
        brand: state.brand.map((b) =>
          b.brandName === brandName ? { ...b, models: response.data.data } : b,
        ),
        loading: false,
      }));

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

      // Update the brand's models in local state
      set((state) => ({
        brand: state.brand.map((b) =>
          b.brandName === brandName
            ? { ...b, models: [...(b.models || []), model] }
            : b,
        ),
        loading: false,
      }));

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

      // Remove the model from local state
      set((state) => ({
        brand: state.brand.map((b) =>
          b.brandName === brandName
            ? { ...b, models: (b.models || []).filter((m) => m !== model) }
            : b,
        ),
        loading: false,
      }));

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

  updateBrand: async (brandName, newBrandName) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `${backendUrl}/laptops/brands/${brandName}`,
        { newBrandName },
      );

      // Update the brand name in local state
      set((state) => ({
        brand: state.brand.map((b) =>
          b.brandName === brandName ? { ...b, brandName: newBrandName } : b,
        ),
        loading: false,
      }));

      return {
        success: true,
        message: response.data.message || "Brand updated successfully",
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
            error: backendMessage || "Failed to update brand",
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

  updateModelInBrand: async (brandName, model, newModel) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `${backendUrl}/laptops/brands/${brandName}/models/${model}`,
        { newModel },
      );

      // Update the model name in local state
      set((state) => ({
        brand: state.brand.map((b) =>
          b.brandName === brandName
            ? {
                ...b,
                models: (b.models || []).map((m) =>
                  m === model ? newModel : m,
                ),
              }
            : b,
        ),
        loading: false,
      }));

      return {
        success: true,
        message: response.data.message || "Model updated successfully",
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
            error: backendMessage || "Failed to update model",
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

      // Remove the brand from local state
      set((state) => ({
        brand: state.brand.filter((b) => b.brandName !== brandName),
        loading: false,
      }));

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
