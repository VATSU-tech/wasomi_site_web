import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { healthService } from '@/services/health.service';
import { settingsService } from '@/services/settings.service';
import { programService } from '@/services/program.service';
import { staffService } from '@/services/staff.service';
import { galleryService, GalleryQueryParams } from '@/services/gallery.service';
import { postService, PostQueryParams } from '@/services/post.service';
import { pageService } from '@/services/page.service';
import { contactService } from '@/services/contact.service';
import { admissionService } from '@/services/admission.service';
import { ContactMessagePayload, AdmissionRequestPayload, StaffMember, GalleryCategory, GalleryItem, Post } from '@/types/domain';

// Fallback static data imports
import { staffMembers as fallbackStaff } from '@/data/staff';
import { galleryCategories as fallbackGalleryCategories, galleryItems as fallbackGalleryItems } from '@/data/gallery';

// 1. Health
export function useHealthQuery() {
  return useQuery({
    queryKey: queryKeys.health.check,
    queryFn: () => healthService.check(),
    retry: 1,
  });
}

// 2. Settings
export function usePublicSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.settings.public,
    queryFn: async () => {
      try {
        const res = await settingsService.getPublic();
        return res.data;
      } catch {
        // TODO remove fallback when backend API is live
        return {
          app_name: 'Wasomi',
          title: 'Wasomi — École d’excellence',
          email: 'contact@wasomi.cd',
          phone: '+243 81 000 0000',
          address: 'Kinshasa, République Démocratique du Congo',
          social_links: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            linkedin: '#',
          },
        };
      }
    },
  });
}

// 3. Programs / Formations
export function useProgramsQuery() {
  return useQuery({
    queryKey: queryKeys.programs.all,
    queryFn: async () => {
      try {
        const res = await programService.list();
        return res.data ?? [];
      } catch {
        // TODO remove fallback when backend API is live
        return null; // Return null so page can fall back to local formations data if API unavailable
      }
    },
  });
}

export function useProgramDetailQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.programs.detail(slug),
    queryFn: async () => {
      const res = await programService.getBySlug(slug);
      return res.data;
    },
    enabled: !!slug,
  });
}

// 4. Staff / Équipe
export function useStaffQuery() {
  return useQuery({
    queryKey: queryKeys.staff.all,
    queryFn: async (): Promise<StaffMember[]> => {
      try {
        const res = await staffService.list();
        if (res.data && res.data.length > 0) return res.data;
        throw new Error('Empty');
      } catch {
        // TODO remove fallback when backend API is live
        return fallbackStaff.map((s) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          bio: s.bio,
          avatar: s.image,
          social_links: {
            linkedin: s.linkedin,
            facebook: s.facebook,
          },
        }));
      }
    },
  });
}

// 5. Gallery
export function useGalleryCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.gallery.categories,
    queryFn: async (): Promise<GalleryCategory[]> => {
      try {
        const res = await galleryService.getCategories();
        if (res.data && res.data.length > 0) return res.data;
        throw new Error('Empty');
      } catch {
        // TODO remove fallback when backend API is live
        return fallbackGalleryCategories
          .filter((c) => c !== 'Tous')
          .map((c, idx) => ({
            id: idx + 1,
            name: c,
            slug: c.toLowerCase().replace(/\s+/g, '-'),
          }));
      }
    },
  });
}

export function useGalleryQuery(params?: GalleryQueryParams) {
  return useQuery({
    queryKey: queryKeys.gallery.items(params),
    queryFn: async (): Promise<GalleryItem[]> => {
      try {
        const res = await galleryService.getItems(params);
        if (res.data && res.data.length > 0) return res.data;
        throw new Error('Empty');
      } catch {
        // TODO remove fallback when backend API is live
        let items = fallbackGalleryItems;
        if (params?.category && params.category !== 'all' && params.category !== 'Tous') {
          items = items.filter((item) => item.category === params.category);
        }
        return items.map((i) => ({
          id: i.id,
          title: i.title,
          image_url: i.src,
          category: i.category,
          description: i.description,
          tags: i.tags,
        }));
      }
    },
  });
}

// 6. Blog / Posts
export function usePostsQuery(params?: PostQueryParams) {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: async (): Promise<{ items: Post[]; total?: number }> => {
      try {
        const res = await postService.list(params);
        return {
          items: res.data ?? [],
          total: res.meta?.total ?? res.data?.length ?? 0,
        };
      } catch {
        // TODO remove fallback when backend API is live
        return { items: [], total: 0 };
      }
    },
  });
}

export function usePostDetailQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(slug),
    queryFn: async () => {
      const res = await postService.getBySlug(slug);
      return res.data;
    },
    enabled: !!slug,
  });
}

// 7. Pages (about, history, etc.)
export function usePageQuery(key: string) {
  return useQuery({
    queryKey: queryKeys.pages.detail(key),
    queryFn: async () => {
      const res = await pageService.getByKey(key);
      return res.data;
    },
    enabled: !!key,
  });
}

// 8. Contact Mutation
export function useContactMutation() {
  return useMutation({
    mutationFn: (payload: ContactMessagePayload) => contactService.send(payload),
  });
}

// 9. Admission Request Mutation
export function useAdmissionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdmissionRequestPayload) => admissionService.submit(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.admissionRequests });
    },
  });
}
