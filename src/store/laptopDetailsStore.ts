import axios from "axios";
import Swal from "sweetalert2";
import { create } from "zustand";

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

interface LaptopStore {
  laptops: LaptopDetails[];
  selectedLaptop: LaptopDetails | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLaptops: () => Promise<void>;
  getLaptopBySerial: (serialNumber: string) => Promise<void>;
  addLaptop: (data: Omit<LaptopDetails, "_id">) => Promise<void>;
  updateLaptop: (
    serialNumber: string,
    updates: Partial<LaptopDetails>
  ) => Promise<void>;
  retireLaptop: (serialNumber: string) => Promise<void>;
  setSelectedLaptop: (laptop: LaptopDetails | null) => void;
}

const url = "http://localhost:5000";

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
      set({ loading: false }); // stop loading early in catch

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          Swal.fire("Validation Error", firstError, "error");
        } else {
          Swal.fire(
            "Error",
            backendMessage || "Failed to fetch laptops",
            "error"
          );
        }
      }
      if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      }

      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  },

  getLaptopBySerial: async (serialNumber) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/api/laptopDetails/${serialNumber}`);
      set({ selectedLaptop: res.data.laptop, loading: false });
    } catch (error: unknown) {
      set({ loading: false }); // stop loading early in catch

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          Swal.fire("Validation Error", firstError, "error");
        } else {
          Swal.fire(
            "Error",
            backendMessage || "Failed to fetch laptop using serial number ",
            "error"
          );
        }
      }
      if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      }

      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  },

  addLaptop: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post("/api/laptopDetails", data);
      set((state) => ({
        laptops: [...state.laptops, res.data.laptop],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ loading: false }); // stop loading early in catch

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          Swal.fire("Validation Error", firstError, "error");
        } else {
          Swal.fire(
            "Error",
            backendMessage || "Failed to add laptops",
            "error"
          );
        }
      }
      if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      }

      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  },

  updateLaptop: async (serialNumber, updates) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`/api/laptopDetails/${serialNumber}`, updates);
      set((state) => ({
        laptops: state.laptops.map((l) =>
          l.serialNumber === serialNumber ? res.data.laptop : l
        ),
        loading: false,
      }));
    }catch (error: unknown) {
      set({ loading: false }); // stop loading early in catch

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          Swal.fire("Validation Error", firstError, "error");
        } else {
          Swal.fire(
            "Error",
            backendMessage || "Failed to update laptops",
            "error"
          );
        }
      }
      if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      }

      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  },

  retireLaptop: async (serialNumber) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`/api/laptopDetails/retire/${serialNumber}`);
      set((state) => ({
        laptops: state.laptops.map((l) =>
          l.serialNumber === serialNumber ? res.data.laptop : l
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ loading: false }); // stop loading early in catch

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const zodErrors = error.response?.data?.errors;

        if (Array.isArray(zodErrors) && zodErrors.length > 0) {
          const firstError =
            typeof zodErrors[0] === "string"
              ? zodErrors[0]
              : zodErrors[0].message || "Validation failed";
          Swal.fire("Validation Error", firstError, "error");
        } else {
          Swal.fire(
            "Error",
            backendMessage || "Failed to retire laptops",
            "error"
          );
        }
      }
      if (error instanceof Error) {
        Swal.fire("Error", error.message, "error");
      }

      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  },

  setSelectedLaptop: (laptop) => set({ selectedLaptop: laptop }),
}));
