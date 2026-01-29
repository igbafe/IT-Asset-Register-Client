import z from "zod";

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

export const updateBrandSchema = z.object({
  newBrandName: z.string().min(1, { message: "Brand is required" }),
});

export type UpdateBrandFormData = z.infer<typeof updateBrandSchema>;

export const updateModelSchema = z.object({
  models: z.array(z.string()).min(1, "At least one model is required"),
});

export type UpdateModelFormData = z.infer<typeof updateModelSchema>;
