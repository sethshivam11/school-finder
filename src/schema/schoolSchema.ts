import { z } from "zod";

export const schoolSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z
    .email()
    .min(3, "Invalid email address")
    .max(255, "Email is too long"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address is too long"),
  city: z.string().min(1, "City is required").max(100, "City is too long"),
  state: z.string().min(1, "State is required").max(100, "State is too long"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country is too long"),
  contact: z
    .string()
    .min(10, "Contact must be at least 10 digits")
    .max(15, "Contact is too long"),
  image: z.string().url("Invalid image URL").optional(),
});
