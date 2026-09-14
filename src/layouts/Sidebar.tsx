import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Settings,
  UserCog,
  FileText,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PermissionGate } from '@/components/PermissionGate';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles?: Array<'prefet' | 'proviseur' | 'enseignant' | 'titulaire' | 'parent' | 'eleve'>;
}

const navItems: NavItem[] = [
  { label: 'Accueil', to: '/app', icon: <Home className="size-4" /> },
  { label: 'Tableau de bord', to: '/app/dashboard', icon: <LayoutDashboard className="size-4" /> },
  {
    label: 'Inscriptions',
    to: '/app/enrollments',
    icon: <GraduationCap className="size-4" />,
    roles: ['proviseur', 'prefet'],
  },
  {
    label: 'Personnel',
    to: '/app/users',
    icon: <UserCog className="size-4" />,
    roles: ['prefet'],
  },
  {
    label: 'Mes cours',
    to: '/app/teachings',
    icon: <BookOpen className="size-4" />,
    roles: ['enseignant', 'titulaire'],
  },
  {
    label: 'Évaluations',
    to: '/app/evaluations',
    icon: <ClipboardList className="size-4" />,
    roles: ['enseignant'],
  },
  {
    label: 'Délibération',
    to: '/app/deliberation',
    icon: <BarChart3 className="size-4" />,
    roles: ['titulaire', 'proviseur'],
  },
  {
    label: 'Mes enfants',
    to: '/app/children',
    icon: <Users className="size-4" />,
    roles: ['parent'],
  },
  {
    label: 'Mon bulletin',
    to: '/app/my-grades',
    icon: <FileText className="size-4" />,
    roles: ['eleve'],
  },
  {
    label: 'Paramètres',
    to: '/app/settings',
    icon: <Settings className="size-4" />,
    roles: ['prefet'],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed = false, onNavigate }: SidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPrefet, isProviseur, isEnseignant, isTitulaire, isParent, isEleve } = useAuth();

  const roleMap = {
    prefet: isPrefet,
    proviseur: isProviseur,
    enseignant: isEnseignant,
    titulaire: isTitulaire,
    parent: isParent,
    eleve: isEleve,
  };

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((r) => roleMap[r]);
  });

  return (
    <aside
      className={`
        flex flex-col h-full bg-base-200 border-r border-base-300
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        transition-all duration-200
      `}
    >
      <div className={`p-4 border-b border-base-300 ${collapsed ? 'px-2' : ''}`}>
        <Link
          to="/app"
          className="flex items-center gap-3"
          onClick={onNavigate}
          title="Portail scolaire"
        >
          <div className="size-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <GraduationCap className="size-5 text-primary-content" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">Gestion scolaire</p>
              <p className="text-xs text-base-content/50">Portail institutionnel</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {visibleItems.map((item) => {
          const isActive =
            item.to === '/app'
              ? pathname === '/app'
              : pathname.startsWith(item.to);

          const link = (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? 'bg-primary text-primary-content'
                  : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'}
                ${collapsed ? 'justify-center px-2' : ''}
              `}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (item.roles) {
            return (
              <PermissionGate key={item.to} roles={item.roles}>
                {link}
              </PermissionGate>
            );
          }
          return link;
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-base-300">
          <details className="group">
            <summary className="flex items-center justify-between text-xs text-base-content/50 cursor-pointer list-none">
              <span>Aide & support</span>
              <ChevronDown className="size-3 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-2 text-xs text-base-content/40 leading-relaxed">
              Contactez l'administration de l'établissement pour toute assistance technique.
            </p>
          </details>
        </div>
      )}
    </aside>
  );
}
