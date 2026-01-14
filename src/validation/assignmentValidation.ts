import { z } from "zod";

export const LaptopUserSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.email({ message: "Invalid email address" }),
  department: z.string().min(1, { message: "Department is required" }),
});

export type LaptopUserFormData = z.infer<typeof LaptopUserSchema>;

export const reassignLaptopSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.email({ message: "Invalid email address" }),
  department: z.string().min(1, { message: "Department is required" }),
});

export type ReassignLaptopFormData = z.infer<typeof reassignLaptopSchema>;

export const updateCurrentUserSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .or(z.literal("")),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .or(z.literal("")),
    email: z.email({ message: "Invalid email address" }).or(z.literal("")),
    department: z
      .string()
      .min(1, { message: "Department is required" })
      .or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type UpdateCurrentUserFormData = z.infer<typeof updateCurrentUserSchema>;
