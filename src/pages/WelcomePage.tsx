import { Link } from '@tanstack/react-router';
import {
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  UserPlus,
  FileText,
} from 'lucide-react';
import { useAuth, useRoleLabel } from '@/context/AuthContext';

interface QuickAction {
  label: string;
  description: string;
  to: string;
  icon: React.ReactNode;
  color: string;
}

export function WelcomePage() {
  const { user, school } = useAuth();
  const roleLabel = useRoleLabel();
  const {
    isPrefet,
    isProviseur,
    isEnseignant,
    isParent,
    isEleve,
    isTitulaire,
  } = useAuth();

  const quickActions: QuickAction[] = [];

  if (isPrefet || isProviseur) {
    quickActions.push(
      {
        label: 'Nouvelle inscription',
        description: 'Inscrire un élève nouveau ou existant',
        to: '/app/enrollments',
        icon: <UserPlus className="size-5" />,
        color: 'bg-primary/10 text-primary',
      },
      {
        label: 'Tableau de bord',
        description: 'Vue d\'ensemble de l\'établissement',
        to: '/app/dashboard',
        icon: <BarChart3 className="size-5" />,
        color: 'bg-accent/10 text-accent',
      },
    );
  }

  if (isPrefet) {
    quickActions.push({
      label: 'Gestion du personnel',
      description: 'Enseignants, fonctions et permissions',
      to: '/app/users',
      icon: <Users className="size-5" />,
      color: 'bg-secondary/10 text-secondary',
    });
  }

  if (isEnseignant) {
    quickActions.push(
      {
        label: 'Mes cours',
        description: 'Affectations et pondérations',
        to: '/app/teachings',
        icon: <BookOpen className="size-5" />,
        color: 'bg-primary/10 text-primary',
      },
      {
        label: 'Saisie des notes',
        description: 'Évaluations et grille de notes',
        to: '/app/evaluations',
        icon: <ClipboardList className="size-5" />,
        color: 'bg-accent/10 text-accent',
      },
    );
  }

  if (isTitulaire) {
    quickActions.push({
      label: 'Délibération',
      description: 'Compiler les résultats de période',
      to: '/app/deliberation',
      icon: <BarChart3 className="size-5" />,
      color: 'bg-warning/10 text-warning',
    });
  }

  if (isParent) {
    quickActions.push({
      label: 'Mes enfants',
      description: 'Notes, présences et bulletins',
      to: '/app/children',
      icon: <Users className="size-5" />,
      color: 'bg-primary/10 text-primary',
    });
  }

  if (isEleve) {
    quickActions.push({
      label: 'Mon bulletin',
      description: 'Consulter mes résultats',
      to: '/app/my-grades',
      icon: <FileText className="size-5" />,
      color: 'bg-primary/10 text-primary',
    });
  }

  if (quickActions.length === 0) {
    quickActions.push({
      label: 'Tableau de bord',
      description: 'Accéder à votre espace',
      to: '/app/dashboard',
      icon: <BarChart3 className="size-5" />,
      color: 'bg-primary/10 text-primary',
    });
  }

  const displayActions = quickActions.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-base-content">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Bienvenue sur votre portail de gestion scolaire.
        </p>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="avatar">
              <div className="w-16 rounded-xl bg-base-200">
                {school?.logo ? (
                  <img src={school.logo} alt={school.nom_officiel} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <GraduationCap className="size-8 text-primary" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold">
                {school?.nom_ecole ?? school?.nom_officiel}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {school?.sigle && (
                  <span className="badge badge-outline badge-sm">{school.sigle}</span>
                )}
                {school?.ville && (
                  <span className="text-sm text-base-content/60">{school.ville}</span>
                )}
              </div>
              <div className="mt-3">
                <span className="badge badge-primary">{roleLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-base-content/70 mb-3">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="card bg-base-100 border border-base-300 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-150"
            >
              <div className="card-body flex-row items-center gap-4 p-4">
                <div className={`p-3 rounded-xl shrink-0 ${action.color}`}>
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
