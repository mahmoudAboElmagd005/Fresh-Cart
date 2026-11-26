import { z } from "zod";

const egyptianPhone = /^01[0125][0-9]{8}$/;

export const profileSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(30),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(egyptianPhone, "Enter a valid Egyptian phone number"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export const addressSchema = z.object({
  name: z.string().trim().min(1, "Enter an address name"),
  details: z.string().trim().min(1, "Enter the address details"),
  phone: z.string().trim().regex(egyptianPhone, "Enter a valid Egyptian phone number"),
  city: z.string().trim().min(1, "Enter a city"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
