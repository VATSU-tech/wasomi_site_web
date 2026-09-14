import { schoolApi } from '@/api/core/client';
import { endpoints } from '@/api/endpoints';
import type {
  Affectation,
  CategorieEvaluation,
  CategoriePayload,
  Cours,
  Evaluation,
  EvaluationPayload,
} from '@/api/types';

export const teachingService = {
  getMyAffectations: () =>
    schoolApi.get<Affectation[]>(endpoints.teachings.affectationsMe),

  listCours: () => schoolApi.get<Cours[]>(endpoints.teachings.cours),

  createCours: (dto: Partial<Cours>) =>
    schoolApi.post<Cours>(endpoints.teachings.cours, dto),

  listCategories: (affectation: number, periode: number) =>
    schoolApi.get<CategorieEvaluation[]>(
      `${endpoints.teachings.categories}?affectation=${affectation}&periode=${periode}`,
    ),

  createCategory: (dto: CategoriePayload) =>
    schoolApi.post<CategorieEvaluation>(endpoints.teachings.categories, dto),

  updateCategory: (id: number, dto: Partial<CategoriePayload>) =>
    schoolApi.put<CategorieEvaluation>(endpoints.teachings.category(id), dto),

  deleteCategory: (id: number) =>
    schoolApi.delete(endpoints.teachings.category(id)),

  listEvaluations: (affectation: number, periode?: number) => {
    const qs = new URLSearchParams({ affectation: String(affectation) });
    if (periode) qs.set('periode', String(periode));
    return schoolApi.get<Evaluation[]>(`${endpoints.teachings.evaluations}?${qs}`);
  },

  createEvaluation: (dto: EvaluationPayload) =>
    schoolApi.post<Evaluation>(endpoints.teachings.evaluations, dto),

  deleteEvaluation: (id: number) =>
    schoolApi.delete(endpoints.teachings.evaluation(id)),
};
