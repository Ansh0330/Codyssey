import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email({ message: "Invalid Email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});
