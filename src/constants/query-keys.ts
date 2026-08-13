export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  health: {
    check: ['health'] as const,
  },
  settings: {
    public: ['settings', 'public'] as const,
  },
  posts: {
    all: ['posts'] as const,
    list: (params?: unknown) => ['posts', 'list', params] as const,
    detail: (slug: string) => ['posts', 'detail', slug] as const,
  },
  programs: {
    all: ['programs'] as const,
    detail: (slug: string) => ['programs', 'detail', slug] as const,
  },
  staff: {
    all: ['staff'] as const,
  },
  gallery: {
    categories: ['gallery', 'categories'] as const,
    items: (params?: unknown) => ['gallery', 'items', params] as const,
  },
  pages: {
    detail: (key: string) => ['pages', key] as const,
  },
  admin: {
    posts: ['admin', 'posts'] as const,
    programs: ['admin', 'programs'] as const,
    staff: ['admin', 'staff'] as const,
    galleryCategories: ['admin', 'gallery', 'categories'] as const,
    galleryItems: ['admin', 'gallery', 'items'] as const,
    media: ['admin', 'media'] as const,
    pages: (key?: string) => ['admin', 'pages', key] as const,
    settings: ['admin', 'settings'] as const,
    contactMessages: ['admin', 'contact-messages'] as const,
    admissionRequests: ['admin', 'admission-requests'] as const,
    users: ['admin', 'users'] as const,
    auditLogs: ['admin', 'audit-logs'] as const,
  },
} as const;
