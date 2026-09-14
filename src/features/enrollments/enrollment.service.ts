import { schoolApi } from '@/api/core/client';
import { endpoints } from '@/api/endpoints';
import type {
  Eleve,
  Inscription,
  InscriptionRequest,
  Parent,
} from '@/api/types';

export const enrollmentService = {
  searchParents: (search: string) =>
    schoolApi.get<Parent[]>(`${endpoints.enrollments.parents}?search=${encodeURIComponent(search)}`),

  searchEleves: (search: string) =>
    schoolApi.get<Eleve[]>(`${endpoints.enrollments.eleves}?search=${encodeURIComponent(search)}`),

  getEleve: (id: number) => schoolApi.get<Eleve>(endpoints.enrollments.eleve(id)),

  createInscription: (dto: InscriptionRequest) =>
    schoolApi.post<Inscription>(endpoints.enrollments.inscriptions, dto),

  listInscriptions: (params?: { classe?: number; annee?: number }) => {
    const qs = new URLSearchParams();
    if (params?.classe) qs.set('classe', String(params.classe));
    if (params?.annee) qs.set('annee', String(params.annee));
    const query = qs.toString();
    return schoolApi.get<Inscription[]>(
      `${endpoints.enrollments.inscriptions}${query ? `?${query}` : ''}`,
    );
  },
};
