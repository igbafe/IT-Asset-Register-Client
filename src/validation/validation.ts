import { z } from "zod";

export const laptopDetailsSchema = z.object({
  systemName: z
    .string()
    .min(2, "System name must be at least 2 characters long"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z
    .string()
    .min(3, "Serial number must be at least 3 characters long"),
  ram: z.string().min(1, "RAM field is required"),
  rom: z.string().min(1, "ROM field is required"),
  os: z.string().min(1, "Operating system is required"),
  status: z.enum([
    "Available",
    "In Use",
    "Retired",
    "In Repair",
    "Fully Depreciated",
  ]),
});

export type LaptopDetailsFormData = z.infer<typeof laptopDetailsSchema>;

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .trim(),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const UpdateDetailsSchema = z.object({
  systemName: z
    .string()
    .min(2, "System name must be at least 2 characters long")
    .optional(),
  brand: z.string().min(1, "Brand is required").optional(),
  model: z.string().min(1, "Model is required").optional(),
  serialNumber: z
    .string()
    .min(3, "Serial number must be at least 3 characters long")
    .optional(),
  ram: z.string().min(1, "RAM field is required").optional(),
  rom: z.string().min(1, "ROM field is required").optional(),
  os: z.string().min(1, "Operating system is required").optional(),
  status: z
    .enum([
      "Available",
      "In Use",
      "Retired",
      "In Repair",
      "Fully Depreciated",
    ])
    .optional(),
});

export type UpdateDetailsFormData = z.infer<typeof UpdateDetailsSchema>;

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}