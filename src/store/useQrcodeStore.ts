// store/laptopQRStore.ts
import { create } from "zustand";
import { backendUrl } from "./useAuthStore";
import axiosInstance from "@/lib/axiosInstance";
import type {
  LaptopQRState,
  QRCodeResponse,
  SingleQRCodeResponse,
} from "@/types/types";
import axios from "axios";

export const useLaptopQRStore = create<LaptopQRState>((set) => ({
  // Initial State
  qrCodes: [],
  selectedQRCode: null,
  loading: false,
  error: null,

  // Fetch all QR codes
  fetchAllQRCodes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get<QRCodeResponse>(
        `${backendUrl}/laptops/qr/all`
      );
      const data = response.data;

      set({ qrCodes: data.data || [], loading: false });
      return {
        success: true,
        message: response.data.message || "Registration successful",
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
            error: backendMessage || "Failed to fetch QR codes",
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

  // Fetch single QR code by serial number
  fetchQRCodeBySerial: async (serialNumber: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get<SingleQRCodeResponse>(
        `${backendUrl}/laptops/${serialNumber}/qr`
      );
      const data = response.data;

      set({ selectedQRCode: data.data, loading: false });
      return {
        success: true,
        message: response.data.message || "Registration successful",
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

  // Download QR code
  downloadQRCode: async (serialNumber: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get<Blob>(
        `${backendUrl}/laptops/${serialNumber}/qr/download`,
        { responseType: "blob" }
      );

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR-${serialNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);



      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set selected QR code
  setSelectedQRCode: (qrCode) => set({ selectedQRCode: qrCode }),
}));
