import { z } from "zod";

export const SignUpFormValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 characters" })
    .max(30, { message: "Name must not exceed 30 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters " })
    .max(30, { message: "password must not exceed 30 characters " }),
});

export const SignInFormValidation = z.object({
  email: z.string().email(),

  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters " })
    .max(30, { message: "password must not exceed 30 characters " }),
});
