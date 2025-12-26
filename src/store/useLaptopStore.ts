import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";
import {
  LaptopStatus,
  type LaptopStore,
  type RecentActivity,
} from "@/types/types";
import axiosInstance from "@/lib/axiosInstance";

// const backendUrl = "https://it-asset-register-server.onrender.com"


export const useLaptopStore = create<LaptopStore>((set, get) => ({
  laptops: [],
  selectedLaptop: null,
  loading: false,
  error: null,

  fetchLaptops: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`/laptops`);
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
      const res = await axiosInstance.get(`/laptops/${serialNumber}`);
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
      const res = await axiosInstance.post(`/laptops`, data);
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
      const res = await axiosInstance.put(`/laptops/${serialNumber}`, updates);
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
      const res = await axiosInstance.put(`/laptops/retire/${serialNumber}`, {
        retirementNote,
      });
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

  // Get all recent activities from all laptops
  getRecentActivities: () => {
    const { laptops } = get();
    const activities: RecentActivity[] = [];

    laptops.forEach((laptop) => {
      // Add current user activity
      if (laptop.currentUser) {
        activities.push({
          _id: `${laptop._id}-current`,
          serialNumber: laptop.serialNumber,
          fullName: laptop.currentUser.fullName,
          department: laptop.currentUser.department,
          status: "current",
          assignedDate: laptop.currentUser.assignedDate,
          returnedDate: laptop.currentUser.returnedDate,
          laptopStatus: LaptopStatus.ASSIGNED,
        });
      }

      // Add previous users activities
      if (laptop.previousUser && laptop.previousUser.length > 0) {
        laptop.previousUser.forEach((prevUser, index) => {
          activities.push({
            _id: `${laptop._id}-prev-${index}`,
            serialNumber: laptop.serialNumber,
            fullName: prevUser.fullName,
            department: prevUser.department,
            status: "previous",
            assignedDate: prevUser.assignedDate,
            returnedDate: prevUser.returnedDate,
            laptopStatus: LaptopStatus.RETURNED,
          });
        });
      }
    });

    // Sort by assignedDate (newest first)
    return activities.sort(
      (a, b) =>
        new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
    );
  },

  setSelectedLaptop: (laptop) => set({ selectedLaptop: laptop }),
}));
