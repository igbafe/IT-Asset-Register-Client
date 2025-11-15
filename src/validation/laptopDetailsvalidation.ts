import { LaptopStatus } from "@/types/types";
import { z } from "zod";

export const addLaptopSchema = z.object({
  systemName: z.string().min(1, { message: "System name is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  ram: z.string().min(1, { message: "RAM is required" }),
  rom: z.string().min(1, { message: "ROM is required" }),
  os: z.string().min(1, { message: "Operating system is required" }),
  status: z.enum(LaptopStatus),
});

export type addLaptopFormData = z.infer<typeof addLaptopSchema>;

export const UpdateDetailsSchema = z.object({
  systemName: z
    .string()
    .min(2, "System name must be at least 2 characters long")
    .or(z.literal("")),
  brand: z.string().min(1, "Brand is required").or(z.literal("")),
  model: z.string().min(1, "Model is required").or(z.literal("")),
  serialNumber: z
    .string()
    .min(3, "Serial number must be at least 3 characters long"),
  ram: z.string().min(1, "RAM field is required").or(z.literal("")),
  rom: z.string().min(1, "ROM field is required").or(z.literal("")),
  os: z.string().min(1, "Operating system is required").or(z.literal("")),
  status: z.enum(LaptopStatus),
});

export type UpdateDetailsFormData = z.infer<typeof UpdateDetailsSchema>;

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}
