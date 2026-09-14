import { schoolApi } from '@/api/core/client';
import { endpoints } from '@/api/endpoints';
import type {
  AnneeScolaire,
  Classe,
  Cycle,
  Domaine,
  Niveau,
  Option,
  Periode,
  SchoolInfo,
  Semestre,
} from '@/api/types';

export const schoolService = {
  getSchool: () => schoolApi.get<SchoolInfo>(endpoints.schools.school),

  getAnnees: () => schoolApi.get<AnneeScolaire[]>(endpoints.schools.annees),

  getActiveAnnee: async (): Promise<AnneeScolaire | null> => {
    const annees = await schoolApi.get<AnneeScolaire[]>(endpoints.schools.annees);
    return annees.find((a) => a.est_active) ?? annees[0] ?? null;
  },

  getCycles: () => schoolApi.get<Cycle[]>(endpoints.schools.cycles),

  getDomaines: (cycleId: number) =>
    schoolApi.get<Domaine[]>(`${endpoints.schools.domaines}?cycle=${cycleId}`),

  getNiveaux: (params: { cycle: number; domaine?: number }) => {
    const qs = new URLSearchParams({ cycle: String(params.cycle) });
    if (params.domaine) qs.set('domaine', String(params.domaine));
    return schoolApi.get<Niveau[]>(`${endpoints.schools.niveaux}?${qs}`);
  },

  getOptions: (niveauId: number) =>
    schoolApi.get<Option[]>(`${endpoints.schools.options}?niveau=${niveauId}`),

  getClasses: (params: {
    cycle?: number;
    domaine?: number;
    niveau?: number;
    option?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params.cycle) qs.set('cycle', String(params.cycle));
    if (params.domaine) qs.set('domaine', String(params.domaine));
    if (params.niveau) qs.set('niveau', String(params.niveau));
    if (params.option) qs.set('option', String(params.option));
    const query = qs.toString();
    return schoolApi.get<Classe[]>(
      `${endpoints.schools.classes}${query ? `?${query}` : ''}`,
    );
  },

  getClasse: (id: number) => schoolApi.get<Classe>(endpoints.schools.classe(id)),

  getPeriodes: (anneeId?: number) => {
    const qs = anneeId ? `?annee=${anneeId}` : '';
    return schoolApi.get<Periode[]>(`${endpoints.schools.periodes}${qs}`);
  },

  getSemestres: (anneeId?: number) => {
    const qs = anneeId ? `?annee=${anneeId}` : '';
    return schoolApi.get<Semestre[]>(`${endpoints.schools.semestres}${qs}`);
  },
};
