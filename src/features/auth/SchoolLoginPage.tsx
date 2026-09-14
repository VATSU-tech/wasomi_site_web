import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { schoolAuthService } from '@/features/auth/school-auth.service';
import { useAuth } from '@/context/AuthContext';
import { LoadingButton } from '@/components/ui/loading-button';
import { showToast } from '@/components/ui/app-toast';

export function SchoolLoginPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await schoolAuthService.login({ identifier, password });
      await refreshProfile();
      showToast('Connexion réussie', 'success');
      navigate({ to: '/app' });
    } catch {
      setError('Identifiant ou mot de passe invalide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 border border-base-300 shadow-lg w-full max-w-md">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-xl bg-primary mb-3">
              <GraduationCap className="size-8 text-primary-content" />
            </div>
            <h1 className="text-xl font-bold">Portail scolaire</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Connectez-vous avec votre email ou numéro de téléphone
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-sm py-2 mb-4">
              <AlertCircle className="size-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1" htmlFor="identifier">
                <span className="label-text font-medium">Identifiant</span>
              </label>
              <input
                id="identifier"
                type="text"
                className="input input-bordered w-full"
                placeholder="email@exemple.cd ou +243812345678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-control">
              <label className="label py-1" htmlFor="password">
                <span className="label-text font-medium">Mot de passe</span>
              </label>
              <input
                id="password"
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Connexion..."
              className="w-full"
            >
              Se connecter
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
}
