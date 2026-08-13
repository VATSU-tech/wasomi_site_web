import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useLoginMutation } from '@/features/auth/hooks';
import { toast } from 'sonner';
import { Lock, Mail, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';
import { loginSchema } from '@/validations/auth';

export const Route = createFileRoute('/login')({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrorMessage(result.error.errors[0]?.message ?? 'Données de connexion invalides.');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success('Connexion réussie');
      navigate({ to: '/admin' });
    } catch {
      // Generic error message anti-enumeration as required by spec
      setErrorMessage('Adresse e-mail ou mot de passe invalide.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-mesh">
      <div className="w-full max-w-md" data-aos="zoom-in">
        <div className="p-8 rounded-2xl glass shadow-elegant border border-border/50">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="bg-gradient-primary rounded-xl p-2.5 shadow-glow">
                <GraduationCap className="size-6 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="font-display text-2xl font-bold">Connexion espace Wasomi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Accédez à votre espace d’administration ou de gestion.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle className="size-5 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" htmlFor="email">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@domaine.cd"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:shadow-glow focus:outline-none transition-smooth text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:shadow-glow focus:outline-none transition-smooth text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-spring disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Connexion en cours...' : 'Se connecter'}
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border/50 pt-4">
            <p>Seules les personnes autorisées ont accès à la console d’administration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
