import { z } from "zod";

const fullNameSchema = z
  .string()
  .min(1, "Name is required")
  .max(60, "Name is too long");

const emailSchema = z
  .email()
  .min(3, "Invalid email address")
  .max(255, "Email is too long");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password is too long");

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const codeSchema = z.object({
  email: emailSchema,
  code: z
    .number({
      message: "Invalid verification code",
    })
    .min(100000, {
      message: "Invalid verification code",
    })
    .max(999999, {
      message: "Invalid verification code",
    }),
});
