import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { SkeletonKpiGrid, SkeletonTable } from '@/components/ui/app-skeleton';
import { enrollmentService } from '@/features/enrollments/enrollment.service';
import { teachingService } from '@/features/teachings/teaching.service';
import { schoolService } from '@/features/school/school.service';
import type { Inscription, Affectation } from '@/api/types';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export function DashboardPage() {
  const { isPrefet, isProviseur, isEnseignant, isParent, isEleve } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  const [classDistribution, setClassDistribution] = useState<
    Array<{ name: string; value: number }>
  >([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (isPrefet || isProviseur) {
          const [insc, classes] = await Promise.all([
            enrollmentService.listInscriptions(),
            schoolService.getClasses({}),
          ]);
          setInscriptions(insc);
          const dist = classes.map((c) => ({
            name: c.libelle,
            value: c.effectif ?? 0,
          }));
          setClassDistribution(dist.filter((d) => d.value > 0));
        }
        if (isEnseignant) {
          const aff = await teachingService.getMyAffectations();
          setAffectations(aff);
        }
      } catch {
        // Dashboard shows empty states on error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isPrefet, isProviseur, isEnseignant]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonKpiGrid />
        <SkeletonTable rows={5} cols={4} />
      </div>
    );
  }

  if (isPrefet || isProviseur) {
    return <AdminDashboard inscriptions={inscriptions} classDistribution={classDistribution} />;
  }

  if (isEnseignant) {
    return <TeacherDashboard affectations={affectations} />;
  }

  if (isParent) {
    return <ParentDashboard />;
  }

  if (isEleve) {
    return <StudentDashboard />;
  }

  return (
    <div className="text-center py-16 text-base-content/60">
      <p>Aucune donnée disponible pour votre profil.</p>
    </div>
  );
}

function AdminDashboard({
  inscriptions,
  classDistribution,
}: {
  inscriptions: Inscription[];
  classDistribution: Array<{ name: string; value: number }>;
}) {
  const totalEleves = inscriptions.length;
  const recentInscriptions = inscriptions.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Tableau de bord — Administration</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 border border-base-300 rounded-box">
          <div className="stat-title text-xs">Total élèves</div>
          <div className="stat-value text-2xl text-primary">{totalEleves}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box">
          <div className="stat-title text-xs">Inscriptions récentes</div>
          <div className="stat-value text-2xl">{recentInscriptions.length}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box">
          <div className="stat-title text-xs">Classes actives</div>
          <div className="stat-value text-2xl">{classDistribution.length}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box">
          <div className="stat-title text-xs">Taux de réussite</div>
          <div className="stat-value text-2xl">—</div>
          <div className="stat-desc text-xs">Données en attente</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {classDistribution.length > 0 && (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base">Distribution par classe</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={classDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {classDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-base">Dernières inscriptions</h2>
            {recentInscriptions.length === 0 ? (
              <p className="text-sm text-base-content/50 py-8 text-center">
                Aucune inscription récente.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Matricule</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInscriptions.map((insc) => (
                      <tr key={insc.id}>
                        <td>
                          {insc.eleve.prenom} {insc.eleve.nom}
                        </td>
                        <td className="font-mono text-xs">{insc.eleve.matricule}</td>
                        <td className="text-xs text-base-content/60">
                          {new Date(insc.date_inscription).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ affectations }: { affectations: Affectation[] }) {
  const classCount = new Set(affectations.map((a) => a.classe.id)).size;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Tableau de bord — Enseignant</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="stat bg-base-100 border border-base-300 rounded-box">
          <div className="stat-title text-xs">Cours affectés</div>
          <div className="stat-value text-2xl text-primary">{affectations.length}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box">
          <div className="stat-title text-xs">Classes</div>
          <div className="stat-value text-2xl">{classCount}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box col-span-2 lg:col-span-1">
          <div className="stat-title text-xs">Prochaines évaluations</div>
          <div className="stat-value text-2xl">—</div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-base">Mes affectations</h2>
          {affectations.length === 0 ? (
            <p className="text-sm text-base-content/50 py-4">
              Aucune affectation pour le moment.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {affectations.map((aff) => (
                <div
                  key={aff.id}
                  className="p-4 rounded-lg border border-base-300 bg-base-200/50"
                >
                  <p className="font-medium text-sm">{aff.cours.libelle}</p>
                  <p className="text-xs text-base-content/60 mt-1">
                    {aff.classe.libelle}
                  </p>
                  {aff.est_titulaire && (
                    <span className="badge badge-accent badge-xs mt-2">
                      Titulaire de classe
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ParentDashboard() {
  const [enfants, setEnfants] = useState<
    Array<{ id: number; nom: string; classe: string; moyenne?: number }>
  >([]);

  useEffect(() => {
    import('@/api/core/client').then(({ schoolApi }) =>
      import('@/api/endpoints').then(({ endpoints }) =>
        schoolApi
          .get<Array<{ id: number; nom_complet: string; classe: string; derniere_moyenne?: number }>>(
            endpoints.parent.enfants,
          )
          .then((data) =>
            setEnfants(
              data.map((e) => ({
                id: e.id,
                nom: e.nom_complet,
                classe: e.classe,
                moyenne: e.derniere_moyenne,
              })),
            ),
          )
          .catch(() => setEnfants([])),
      ),
    );
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Tableau de bord — Parent</h1>
      <div className="grid gap-4">
        {enfants.length === 0 ? (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body text-center py-12">
              <p className="text-base-content/60">Aucun enfant associé à votre compte.</p>
            </div>
          </div>
        ) : (
          enfants.map((enfant) => (
            <div key={enfant.id} className="card bg-base-100 border border-base-300">
              <div className="card-body flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-12">
                      <span>{enfant.nom[0]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{enfant.nom}</p>
                    <p className="text-sm text-base-content/60">{enfant.classe}</p>
                  </div>
                </div>
                <div className="text-right">
                  {enfant.moyenne !== undefined ? (
                    <>
                      <p className="text-2xl font-bold text-primary">
                        {enfant.moyenne.toFixed(1)}%
                      </p>
                      <p className="text-xs text-base-content/50">Dernière moyenne</p>
                    </>
                  ) : (
                    <span className="badge badge-ghost">Pas de notes</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StudentDashboard() {
  const mockGrades = [
    { matiere: 'Mathématiques', note: 75 },
    { matiere: 'Français', note: 82 },
    { matiere: 'Sciences', note: 68 },
    { matiere: 'Histoire', note: 90 },
  ];

  const moyenne =
    mockGrades.reduce((s, g) => s + g.note, 0) / mockGrades.length;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Tableau de bord — Élève</h1>

      <div className="stat bg-base-100 border border-base-300 rounded-box w-full max-w-xs">
        <div className="stat-title text-xs">Moyenne générale</div>
        <div className="stat-value text-primary">{moyenne.toFixed(1)}%</div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-base">Notes par matière</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockGrades}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
              <XAxis dataKey="matiere" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="note" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
