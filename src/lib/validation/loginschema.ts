import { z } from "zod";

// Schema de cadastro
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "O nome deve ter pelo menos 2 caracteres.")
      .max(100, "O nome deve ter no máximo 100 caracteres.")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras."),
    cpf: z.string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "O CPF deve conter exatamente 11 números."),
    email: z
      .email("Por favor, insira um e-mail válido.")
      .max(255, "O e-mail deve ter no máximo 255 caracteres."),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres.")
      .max(100, "A senha deve ter no máximo 100 caracteres.")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial."
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password.trim() === data.password, {
    message: "A senha não pode começar ou terminar com espaços.",
    path: ["password"],
  });

// Schema de login
export const loginSchema = z.object({
  email: z
    .string()
    .email("Por favor, insira um e-mail válido.")
    .max(255, "O e-mail deve ter no máximo 255 caracteres."),
  password: z
    .string()
    .min(1, "A senha é obrigatória.")
    .max(100, "A senha deve ter no máximo 100 caracteres."),
});

// Schema de recuperação de senha
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Por favor, insira um e-mail válido para recuperar sua senha.")
    .max(255, "O e-mail deve ter no máximo 255 caracteres."),
});

// Schema para redefinição de senha
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter no mínimo 8 caracteres.")
      .max(100, "A nova senha deve ter no máximo 100 caracteres.")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial."
      ),
    confirmNewPassword: z
      .string()
      .min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmNewPassword"],
  });

// Schema para atualização de perfil
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres.")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras.")
    .optional(),
  email: z
    .string()
    .email("Por favor, insira um e-mail válido.")
    .max(255, "O e-mail deve ter no máximo 255 caracteres.")
    .optional(),
});

// Validação personalizada para senha forte
export const passwordStrengthSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres.")
  .max(100, "A senha deve ter no máximo 100 caracteres.")
  .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula.")
  .regex(/[0-9]/, "Deve conter pelo menos um número.")
  .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial.");

// Função auxiliar para validar senha
export const validatePassword = (password: string) => {
  return passwordStrengthSchema.safeParse(password);
};

// Tipagens inferidas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
