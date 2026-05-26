import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '@/validations/auth';
import { useLoginMutation } from '@/features/auth/hooks';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({ component: LoginPage });
function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email:'', password:'', device_name:'web' } });
  const login = useLoginMutation();
  const onSubmit = form.handleSubmit(async (values) => { try { await login.mutateAsync(values); toast.success('Connexion réussie'); navigate({to:'/products'}); } catch { toast.error('Échec de connexion'); } });
  return <form onSubmit={onSubmit} className='max-w-md mx-auto p-6 space-y-4'><h1 className='text-2xl font-bold'>Connexion</h1><input className='w-full border p-2 rounded' placeholder='Email' {...form.register('email')} /><input className='w-full border p-2 rounded' type='password' placeholder='Password' {...form.register('password')} /><button disabled={login.isPending} className='bg-primary text-primary-foreground px-4 py-2 rounded'>{login.isPending?'...':'Se connecter'}</button></form>;
}
