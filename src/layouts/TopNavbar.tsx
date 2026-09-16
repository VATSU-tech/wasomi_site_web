import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Menu,
  Bell,
  LogOut,
  User,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRoleLabel } from '@/context/AuthContext';
import { schoolAuthService } from '@/features/auth/school-auth.service';
import { showToast } from '@/components/ui/app-toast';
import type { NotificationChannel } from '@/api/types';

interface TopNavbarProps {
  onMenuToggle: () => void;
  anneeLabel?: string;
}

export function TopNavbar({ onMenuToggle, anneeLabel }: TopNavbarProps) {
  const { user, school, logout } = useAuth();
  const roleLabel = useRoleLabel();
  const [channel, setChannel] = useState<NotificationChannel>('SMS');
  const [updatingChannel, setUpdatingChannel] = useState(false);

  const handleChannelChange = async (newChannel: NotificationChannel) => {
    setUpdatingChannel(true);
    try {
      await schoolAuthService.updateChannelPreferences({
        canal_notification: newChannel,
      });
      setChannel(newChannel);
      showToast(`Canal de notification : ${newChannel}`, 'success');
    } catch {
      showToast('Impossible de mettre à jour les préférences.', 'error');
    } finally {
      setUpdatingChannel(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/app/login';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-base-100 border-b border-base-300">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square lg:hidden"
          onClick={onMenuToggle}
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">
            {school?.nom_ecole ?? school?.nom_officiel ?? 'Établissement scolaire'}
          </p>
          <div className="flex items-center gap-2">
            {school?.sigle && (
              <span className="text-xs text-base-content/50">{school.sigle}</span>
            )}
            {anneeLabel && (
              <span className="badge badge-primary badge-xs">{anneeLabel}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="dropdown dropdown-end hidden sm:block">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-ghost btn-sm gap-1"
            disabled={updatingChannel}
          >
            <Bell className="size-4" />
            <span className="text-xs">{channel}</span>
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300"
          >
            <li className="menu-title text-xs">Canal de notification</li>
            <li>
              <button
                type="button"
                className={channel === 'SMS' ? 'active' : ''}
                onClick={() => handleChannelChange('SMS')}
              >
                <MessageSquare className="size-4" />
                SMS
              </button>
            </li>
            <li>
              <button
                type="button"
                className={channel === 'EMAIL' ? 'active' : ''}
                onClick={() => handleChannelChange('EMAIL')}
              >
                <Mail className="size-4" />
                Email
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown dropdown-end">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-ghost btn-sm gap-2 max-w-[200px]"
            aria-label={`Profil de ${user?.prenom ?? ''} ${user?.nom ?? ''}`}
          >
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8">
                {user?.photo ? (
                  <img src={user.photo} alt={`Photo de ${user?.prenom ?? ''} ${user?.nom ?? ''}`} />
                ) : (
                  <span className="text-xs">
                    {user?.prenom?.[0]}
                    {user?.nom?.[0]}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-[10px] text-base-content/50 truncate">{roleLabel}</p>
            </div>
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300"
          >
            <li>
              <Link to="/app/profile">
                <User className="size-4" />
                Mon profil
              </Link>
            </li>
            <li>
              <button type="button" onClick={handleLogout} className="text-error">
                <LogOut className="size-4" />
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
