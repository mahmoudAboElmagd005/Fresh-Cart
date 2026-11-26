import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name must be at most 30 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a symbol"),
    rePassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
