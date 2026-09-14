import { schoolApi } from '@/api/core/client';
import { endpoints } from '@/api/endpoints';
import type {
  Bulletin,
  NoteEleve,
  NotePayload,
  ResultatsPeriode,
} from '@/api/types';

export const gradingService = {
  getElevesForEvaluation: (evaluationId: number) =>
    schoolApi.get<NoteEleve[]>(
      `${endpoints.gradings.notesEleves}?evaluation=${evaluationId}`,
    ),

  saveNotes: (notes: NotePayload[]) =>
    schoolApi.post<NoteEleve[]>(endpoints.gradings.notes, { notes }),

  compilePeriode: (classe: number, periode: number, cours?: number) => {
    const qs = new URLSearchParams({
      classe: String(classe),
      periode: String(periode),
    });
    if (cours) qs.set('cours', String(cours));
    return schoolApi.post<ResultatsPeriode>(
      `${endpoints.gradings.compiler}?${qs}`,
    );
  },

  getResultatsPeriode: (classe: number, periode: number, cours?: number) => {
    const qs = new URLSearchParams({
      classe: String(classe),
      periode: String(periode),
    });
    if (cours) qs.set('cours', String(cours));
    return schoolApi.get<ResultatsPeriode>(
      `${endpoints.gradings.resultatsPeriode}?${qs}`,
    );
  },

  getResultatsSemestre: (classe: number, semestre: number) =>
    schoolApi.get<ResultatsPeriode>(
      `${endpoints.gradings.resultatsSemestre}?classe=${classe}&semestre=${semestre}`,
    ),

  getBulletin: (inscriptionId: number) =>
    schoolApi.get<Bulletin>(
      `${endpoints.gradings.resultatsBulletin}?inscription=${inscriptionId}`,
    ),
};
