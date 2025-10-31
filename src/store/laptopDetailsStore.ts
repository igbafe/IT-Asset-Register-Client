import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";

export interface LaptopDetails {
  _id?: string;
  systemName: string;
  brand: string;
  model: string;
  serialNumber: string;
  ram: string;
  rom: string;
  os: string;
  status:
    | "Available"
    | "In Use"
    | "Retired"
    | "In Repair"
    | "Fully Depreciated";
  createdAt?: string;
  updatedAt?: string;
}

interface Result {
  success: boolean;
}

interface LaptopStore {
  laptops: LaptopDetails[];
  selectedLaptop: LaptopDetails | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLaptops: () => Promise<void>;
  getLaptopBySerial: (serialNumber: string) => Promise<void>;
  addLaptop: (data: Omit<LaptopDetails, "_id">) => Promise<Result>;
  updateLaptop: (
    serialNumber: string,
    updates: Partial<LaptopDetails>
  ) => Promise<void>;
  retireLaptop: (serialNumber: string) => Promise<void>;
  setSelectedLaptop: (laptop: LaptopDetails | null) => void;
}

const url = "https://it-asset-register-server.onrender.com";

export const useLaptopDetailsStore = create<LaptopStore>((set) => ({
  laptops: [],
  selectedLaptop: null,
  loading: false,
  error: null,

  fetchLaptops: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${url}/api/laptopDetails`);
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
      const res = await axios.get(`${url}/api/laptopDetails/${serialNumber}`);
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
      const res = await axios.post(`${url}/api/laptopDetails`, data);
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
        `${url}/api/laptopDetails/${serialNumber}`,
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

  retireLaptop: async (serialNumber) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `${url}/api/laptopDetails/retire/${serialNumber}`
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
