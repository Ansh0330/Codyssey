import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid Email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
