import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/app/profile')({
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-bold">Mon profil</h1>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-16">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={`Photo de ${user.prenom} ${user.nom}`}
                  />
                ) : (
                  <span className="text-xl">
                    {user?.prenom?.[0]}
                    {user?.nom?.[0]}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold text-lg">
                {user?.prenom} {user?.nom} {user?.post_nom}
              </p>
              {user?.email && (
                <p className="text-sm text-base-content/60">{user.email}</p>
              )}
              {user?.telephone && (
                <p className="text-sm text-base-content/60">{user.telephone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
