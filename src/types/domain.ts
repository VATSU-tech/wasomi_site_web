export interface Role {
  id: string | number;
  name: string;
  slug: string;
}

export interface Permission {
  id: string | number;
  name: string;
  slug: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string | null;
  roles?: Role[];
  permissions?: Permission[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface HeroSlide {
  id: string | number;
  title?: string | null;
  subtitle?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  sort_order?: number;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string | number;
  author_name: string;
  author_role?: string | null;
  content: string;
  rating: number;
  status?: 'pending' | 'approved' | 'rejected' | string;
  is_featured?: boolean;
  sort_order?: number;
  admin_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolClass {
  id: string | number;
  section: string;
  option_name?: string | null;
  class_name: string;
  label?: string | null;
  is_open?: boolean;
  sort_order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassTreeOption {
  name: string | null;
  classes: SchoolClass[];
}

export interface ClassTreeSection {
  name: string;
  options: ClassTreeOption[];
}

export interface ClassTree {
  sections: ClassTreeSection[];
}

export interface SiteKpiItem {
  key: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface SiteKpis {
  items: SiteKpiItem[];
}

export interface PublicSettings {
  app_name?: string;
  title?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  logo_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  social_links?: SocialLinks;
  /** Compteurs publics affichés sur l'accueil */
  site_kpis?: SiteKpis;
  [key: string]: unknown;
}

export const DEFAULT_SITE_KPIS: SiteKpis = {
  items: [
    { key: 'students', label: 'Élèves accompagnés', value: 150, suffix: '+' },
    { key: 'options', label: 'Options / cycles', value: 4, suffix: '' },
    { key: 'teachers', label: 'Enseignants & agents', value: 10, suffix: '+' },
    { key: 'success_rate', label: 'Taux de réussite', value: 98, suffix: '%' },
  ],
};

export interface ProgramModule {
  id?: string | number;
  title: string;
  description?: string;
  duration?: string;
}

export interface Program {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  duration: string;
  level: string;
  category?: string;
  price?: string | number;
  image?: string;
  icon?: string;
  features?: string[];
  modules?: ProgramModule[];
  fees?: {
    currency?: string;
    total?: string | null;
    cycle?: string;
    components?: Array<{
      id?: string;
      label: string;
      amount: number;
      description?: string;
      sort_order?: number;
    }>;
    installments?: Array<{ id?: string; label: string; amount: string }>;
    connectedFees?: string;
    labotech?: string;
    infirmary?: string;
    firstInstallment?: string;
    secondInstallment?: string;
    thirdInstallment?: string;
  } | null;
  schedule?: Record<string, string> | null;
  students?: string;
  color?: string;
  sort_order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffMember {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  bio_short?: string;
  avatar: string;
  department?: string;
  social_links?: SocialLinks;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryCategory {
  id: string | number;
  name: string;
  slug: string;
}

export interface GalleryItem {
  id: string | number;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  is_featured?: boolean;
  date?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category?: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  cover_image?: string;
  published_at?: string;
  created_at?: string;
  reading_time?: string;
  tags?: string[];
  is_published?: boolean;
}

export interface PageContent {
  key: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  status: 'new' | 'in_progress' | 'handled' | 'archived';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdmissionRequestPayload {
  name?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  age?: number;
  gender?: 'M' | 'F' | string;
  class_level?: string;
  program_id?: string | number;
  email: string;
  phone: string;
  guardian_name?: string;
  guardian_relation?: string;
  guardian_phone?: string;
  guardian_email?: string;
  emergency_phone?: string;
  address?: string;
  previous_school?: string;
  last_grade_result?: string;
  start_term?: string;
  special_needs?: string;
  message?: string;
}

export interface AdmissionRequest extends AdmissionRequestPayload {
  id: string;
  name: string;
  status: 'new' | 'read' | 'in_progress' | 'handled' | 'accepted' | 'rejected' | 'archived';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  public_url: string;
  url?: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  kind: string;
  title?: string;
  alt_text?: string;
  caption?: string;
  category?: string;
  folder?: string;
  width?: number | null;
  height?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
