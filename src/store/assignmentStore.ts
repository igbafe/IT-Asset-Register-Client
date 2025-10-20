import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

export interface Assignment {
  _id?: string;
  systemName: string;
  serialNumber: string;
  fullName: string;
  email: string;
  department: string;
  assignedDate: Date;
  returnedDate?: Date;
  status: "Active" | "Returned" | "Retired";
}

interface Result {
  success: boolean;
}

interface AssignmentStore {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchAssignments: () => Promise<void>;
  getAssignmentBySerialNumber: (
    serialNumber: string
  ) => Promise<Assignment[] | null>;
  assignLaptop: (data: Omit<Assignment, "_id" | "status">) => Promise<Result>;
  reassignLaptop: (
    systemName: string,
    data: Omit<Assignment, "_id" | "status">
  ) => Promise<Result>;
  updateLaptop: (_id: string, updates: Partial<Assignment>) => Promise<void>;
  retireAssignment: (systemName: string) => Promise<void>;
}

const url = "http://localhost:5000/api/laptopAssignment";

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  loading: false,
  error: null,

  fetchAssignments: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${url}`);
      set({ assignments: res.data.laptops, loading: false });
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
          toast.error(backendMessage || "Failed to fetch Assignments");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  getAssignmentBySerialNumber: async (serialNumber) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${url}/${serialNumber}`);
      set({ loading: false });
      return res.data.laptop;
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
            backendMessage || "Failed to fetch Assignment using serial number"
          );
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  assignLaptop: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${url}`, data);
      set((state) => ({
        assignments: [...state.assignments, res.data.assignment],
        loading: false,
      }));
      toast.success("Laptop assigned successfully");
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
  
  reassignLaptop: async (systemName, data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${url}/reassign/${systemName}`, data);
      set((state) => ({
        assignments: [...state.assignments, res.data.newAssignment],
        loading: false,
      }));
      toast.success("Laptop reassigned successfully");
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

  updateLaptop: async (_id, updates) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${url}/${_id}`, updates);
      set((state) => ({
        assignments: state.assignments.map((a) =>
          a._id === _id ? res.data.laptop : a
        ),
        loading: false,
      }));
      toast.success("Assignment updated successfully!");
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
          toast.error(backendMessage || "Failed to update assignment");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  retireAssignment: async (systemName) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${url}/retire/${systemName}`);
      set((state) => ({
        assignments: state.assignments.map((a) =>
          a.systemName === systemName ? res.data.laptop : a
        ),
        loading: false,
      }));
      toast.success("Assignment retired successfully!");
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
          toast.error(backendMessage || "Failed to retire laptop assignment");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },
}));
