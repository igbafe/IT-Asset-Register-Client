import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";
import type { LaptopStore } from "@/types/types";
import { backendUrl } from "./useAuthStore";


// const backendUrl = "https://it-asset-register-server.onrender.com";

export const useLaptopStore = create<LaptopStore>((set) => ({
  laptops: [],
  selectedLaptop: null,
  loading: false,
  error: null,

  fetchLaptops: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${backendUrl}/laptops`);
      set({ laptops: res.data.data, loading: false });
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
          toast.error(backendMessage || "Failed to fetch laptops");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  getLaptopBySerial: async (serialNumber) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${backendUrl}/laptops/${serialNumber}`);
      set({ selectedLaptop: res.data.laptop, loading: false });
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
          toast.error(
            backendMessage || "Failed to fetch laptop using serial number"
          );
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  addLaptop: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${backendUrl}/laptops`, data);
      set((state) => ({
        laptops: [...state.laptops, res.data.laptop],
        loading: false,
      }));
      toast.success("Laptop added successfully!");
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
          toast.error(backendMessage || "Failed to add laptop");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      return { success: false };
    }
  },

  updateLaptop: async (serialNumber, updates) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `${backendUrl}/laptops/${serialNumber}`,
        updates
      );
      set((state) => ({
        laptops: state.laptops.map((l) =>
          l.serialNumber === serialNumber ? res.data.laptop : l
        ),
        loading: false,
      }));
      toast.success("Laptop updated successfully!");
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
          toast.error(backendMessage || "Failed to update laptop");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  retireLaptop: async (serialNumber, retirementNote) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `${backendUrl}/laptops/retire/${serialNumber}`, { retirementNote }
      );
      set((state) => ({
        laptops: state.laptops.map((l) =>
          l.serialNumber === serialNumber ? res.data.laptop : l
        ),
        loading: false,
      }));
      toast.success("Laptop retired successfully!");
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
          toast.error(backendMessage || "Failed to retire laptop");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  setSelectedLaptop: (laptop) => set({ selectedLaptop: laptop }),
}));
