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
}

export interface PublicSettings {
  app_name?: string;
  title?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  social_links?: SocialLinks;
  [key: string]: unknown;
}

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
  name: string;
  email: string;
  phone: string;
  program_id?: string | number;
  message?: string;
}

export interface AdmissionRequest extends AdmissionRequestPayload {
  id: string;
  status: 'new' | 'read' | 'in_progress' | 'handled' | 'accepted' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
