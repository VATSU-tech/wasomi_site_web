import { z } from 'zod';
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8), device_name: z.string().default('web') });
export const registerSchema = loginSchema.extend({ name: z.string().min(2), password_confirmation: z.string().min(8) }).refine((v)=>v.password===v.password_confirmation,{ path:['password_confirmation'], message:'Passwords must match' });
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
