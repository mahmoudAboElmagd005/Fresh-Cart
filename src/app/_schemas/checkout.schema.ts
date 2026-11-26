import { z } from "zod";

export const shippingAddressSchema = z.object({
  details: z.string().trim().min(5, "Enter at least 5 characters for the street address"),
  phone: z.string().trim().regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian mobile number"),
  city: z.string().trim().min(2, "Enter a city with at least 2 characters"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
