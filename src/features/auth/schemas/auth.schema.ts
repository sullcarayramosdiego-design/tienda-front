import { z } from "zod";

/**
 * Login Schema - Validates email and password for user authentication
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo es requerido" })
    .email({ message: "Correo inválido" }),
  password: z
    .string()
    .min(1, { message: "La contraseña es requerida" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

/**
 * Register Schema - Validates user registration data
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "El nombre es requerido" })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z
      .string()
      .min(1, { message: "El correo es requerido" })
      .email({ message: "Correo inválido" }),
    password: z
      .string()
      .min(1, { message: "La contraseña es requerida" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una mayúscula",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirma tu contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// TypeScript types inferred from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
