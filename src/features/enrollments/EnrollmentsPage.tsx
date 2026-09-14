import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { PermissionGate } from '@/components/PermissionGate';
import { StudentEnrollmentModal } from '@/features/enrollments/components/StudentEnrollmentModal';
import { enrollmentService } from '@/features/enrollments/enrollment.service';
import { SkeletonTable } from '@/components/ui/app-skeleton';
import { EmptyState } from '@/components/ui/app-toast';
import type { Inscription } from '@/api/types';

export function EnrollmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    enrollmentService
      .listInscriptions()
      .then(setInscriptions)
      .catch(() => setInscriptions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PermissionGate
      roles={['proviseur', 'prefet']}
      fallback={
        <div className="alert alert-warning">
          Accès réservé au Proviseur ou au Préfet des études.
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Inscriptions</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Gérer les inscriptions des élèves
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="size-4" />
            Nouvelle inscription
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={6} cols={4} />
        ) : inscriptions.length === 0 ? (
          <EmptyState
            title="Aucune inscription"
            description="Commencez par inscrire un élève nouveau ou existant."
            action={
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setModalOpen(true)}
              >
                Inscrire un élève
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto card bg-base-100 border border-base-300">
            <table className="table">
              <thead>
                <tr>
                  <th>Élève</th>
                  <th>Matricule</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((insc) => (
                  <tr key={insc.id}>
                    <td>
                      {insc.eleve.prenom} {insc.eleve.nom}
                    </td>
                    <td className="font-mono text-xs">{insc.eleve.matricule}</td>
                    <td className="text-sm text-base-content/60">
                      {new Date(insc.date_inscription).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <span className="badge badge-sm badge-outline">{insc.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StudentEnrollmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
      />
    </PermissionGate>
  );
}
