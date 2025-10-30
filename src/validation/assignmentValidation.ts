import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const assignLaptopSchema = z.object({
  systemName: z
    .string()
    .min(2, "System name must be at least 2 characters long"),
  serialNumber: z.string().min(1, "Serial number is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  assignedDate: z.coerce.date().refine((d) => d.getTime() <= Date.now(), {
    message: "Assigned date cannot be in the future",
  }),
});

export type AssignLaptopFormData = z.infer<typeof assignLaptopSchema>;

export const reassignLaptopSchema = assignLaptopSchema
  .extend({
    returnedDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.returnedDate) return true;
      return data.returnedDate.getTime() >= data.assignedDate.getTime();
    },
    {
      message: "Returned date cannot be before assigned date",
      path: ["returnedDate"],
    }
  );

export type ReassignLaptopFormData = z.infer<typeof reassignLaptopSchema>;

export const updateAssignmentSchema = z
  .object({
    systemName: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .min(2, "System name must be at least 2 characters long")
        .optional()
    ),
    serialNumber: z.preprocess(
      emptyToUndefined,
      z.string().min(1, "Serial number is required").optional()
    ),
    fullName: z.preprocess(
      emptyToUndefined,
      z.string().min(1, "Full name is required").optional()
    ),
    email: z.preprocess(
      emptyToUndefined,
      z.string().email("Please enter a valid email address").optional()
    ),
    department: z.preprocess(
      emptyToUndefined,
      z.string().min(1, "Department is required").optional()
    ),
    assignedDate: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.coerce
        .date()
        .refine((d) => d.getTime() <= Date.now(), {
          message: "Assigned date cannot be in the future",
        })
        .optional()
    ),
    returnedDate: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.coerce.date().optional()
    ),
    status: z.enum(["Active", "Returned", "Retired"]).optional(),
  })
  .refine(
    (data) => {
      if (!data.returnedDate || !data.assignedDate) return true;
      return data.returnedDate.getTime() >= data.assignedDate.getTime();
    },
    {
      message: "Returned date cannot be before assigned date",
      path: ["returnedDate"],
    }
  );

export type UpdateAssignmentFormData = z.infer<typeof updateAssignmentSchema>;
