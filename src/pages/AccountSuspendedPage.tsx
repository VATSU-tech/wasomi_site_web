import { useAuth } from '@/context/AuthContext';
import { LoadingButton } from '@/components/ui/loading-button';
import { ShieldOff, Phone, Mail } from 'lucide-react';

export function AccountSuspendedPage() {
  const { school, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/app/login';
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 border border-base-300 shadow-lg max-w-md w-full">
        <div className="card-body items-center text-center py-10">
          <div className="p-4 rounded-full bg-warning/10 mb-2">
            <ShieldOff className="size-10 text-warning" />
          </div>

          <h1 className="text-xl font-bold">Compte suspendu</h1>

          <p className="text-sm text-base-content/70 mt-2 leading-relaxed">
            Votre accès au portail a été temporairement suspendu par
            l'administration de l'établissement. Si vous pensez qu'il s'agit
            d'une erreur, veuillez contacter le secrétariat.
          </p>

          {(school?.telephone || school?.email) && (
            <div className="mt-6 w-full space-y-2 text-left">
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                Coordonnées de l'école
              </p>
              {school.telephone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-base-content/40" />
                  <span>{school.telephone}</span>
                </div>
              )}
              {school.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-base-content/40" />
                  <span>{school.email}</span>
                </div>
              )}
            </div>
          )}

          <LoadingButton
            variant="outline"
            className="mt-8 w-full"
            onClick={handleLogout}
          >
            Se déconnecter
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
