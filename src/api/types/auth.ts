export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';
export type NotificationChannel = 'SMS' | 'EMAIL';
export type RoleSlug =
  | 'prefet'
  | 'proviseur'
  | 'enseignant'
  | 'titulaire'
  | 'parent'
  | 'eleve'
  | 'admin';

export interface SchoolRole {
  id: number;
  name: string;
  slug: RoleSlug;
}

export interface SchoolProfile {
  id: number;
  prenom: string;
  nom: string;
  post_nom?: string;
  email?: string | null;
  telephone?: string | null;
  photo?: string | null;
  status: UserStatus;
  is_active: boolean;
  roles: SchoolRole[];
  fonction?: string;
  matricule?: string;
}

export interface SchoolInfo {
  id: number;
  nom_ecole: string;
  nom_officiel?: string;
  sigle: string;
  code?: string;
  ville: string;
  province?: string;
  logo?: string | null;
  adresse?: string;
  telephone?: string;
  email?: string;
  date_creation?: string;
  updated_at?: string;
}

export interface AnneeScolaire {
  id: number;
  libelle: string;
  date_debut: string;
  date_fin: string;
  est_active: boolean;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: SchoolProfile;
}

export interface RefreshResponse {
  access: string;
}

export interface PasswordVerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface PasswordVerifyOtpResponse {
  reset_token: string;
}

export interface PasswordConfirmRequest {
  reset_token: string;
  password: string;
  password_confirm: string;
}

export interface ActivateValidateRequest {
  token: string;
}

export interface ActivateRequest {
  token: string;
  password: string;
  password_confirm: string;
}

export interface ChannelPreferences {
  canal_notification: NotificationChannel;
}
