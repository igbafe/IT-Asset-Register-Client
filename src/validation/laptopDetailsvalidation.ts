import { z } from "zod";

export const addLaptopSchema = z.object({
  systemName: z.string().min(1, { message: "System name is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  ram: z.string().min(1, { message: "RAM is required" }),
  rom: z.string().min(1, { message: "ROM is required" }),
  os: z.string().min(1, { message: "Operating system is required" }),
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
});
// ...existing code...

export type UpdateDetailsFormData = z.infer<typeof UpdateDetailsSchema>;

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export const brandModelSchema = z.object({
  brandName: z.string().min(1, { message: "Brand is required" }),
  models: z
    .array(z.string().min(1, { message: "Model cannot be empty" }))
    .min(1, { message: "At least one model is required" }),
});

export type BrandModelFormData = z.infer<typeof brandModelSchema>;

export const addModelSchema = z.object({
  models: z.array(z.string()).min(1, "At least one model is required"),
});

export type AddModelFormData = z.infer<typeof addModelSchema>;
