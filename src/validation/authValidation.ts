import z from "zod";

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