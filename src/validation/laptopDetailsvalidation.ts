import { z } from "zod";

export const addLaptopSchema = z.object({
  systemName: z.string().min(1, { message: "System name is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  ram: z.string().min(1, { message: "RAM is required" }),
  rom: z.string().min(1, { message: "ROM is required" }),
  os: z.string().min(1, { message: "Operating system is required" }),
  purchaseDate: z.date({ message: "Purchase date is required" }),
});

export type addLaptopFormData = z.infer<typeof addLaptopSchema>;

// ...existing code...
export const UpdateDetailsSchema = z.object({
  systemName: z
    .string()
    .min(2, "System name must be at least 2 characters long")
    .or(z.literal(""))
    .optional(),
  brand: z.string().min(1, "Brand is required").or(z.literal("")).optional(),
  model: z.string().min(1, "Model is required").or(z.literal("")).optional(),
  ram: z.string().min(1, "RAM field is required").or(z.literal("")).optional(),
  rom: z.string().min(1, "ROM field is required").or(z.literal("")).optional(),
  os: z
    .string()
    .min(1, "Operating system is required")
    .or(z.literal(""))
    .optional(),
  purchaseDate: z
    .date()
    .min(1, "Purchase date is required")
    .or(z.literal(""))
    .optional(),
});

export type UpdateDetailsFormData = z.infer<typeof UpdateDetailsSchema>;



