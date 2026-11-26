import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyCodeSchema = z.object({
  resetCode: z
    .string()
    .min(1, "Verification code is required")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;