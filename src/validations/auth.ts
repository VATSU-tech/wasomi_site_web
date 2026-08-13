import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide.'),
  password: z.string().min(1, 'Mot de passe requis.'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères.'),
    email: z.string().email('Adresse e-mail invalide.'),
    password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères.'),
    password_confirmation: z.string().min(8),
  })
  .refine((v) => v.password === v.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Les mots de passe ne correspondent pas.',
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
