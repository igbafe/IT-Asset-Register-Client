// store/laptopQRStore.ts
import { create } from "zustand";
import { backendUrl } from "./useAuthStore";
import axiosInstance from "@/lib/axiosInstance";
import type {  LaptopQRState, QRCodeResponse, SingleQRCodeResponse } from "@/types/types";



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

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch QR codes");
      }

      set({ qrCodes: data.data || [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
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

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch QR code");
      }

      if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch QR code");
    }

      set({ selectedQRCode: data.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
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
      if (!blob) throw new Error("Failed to download QR code");

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
