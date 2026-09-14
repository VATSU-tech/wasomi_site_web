export type TypeCategorie = 'DC' | 'EX';

export interface Affectation {
  id: number;
  cours: {
    id: number;
    libelle: string;
    code?: string;
  };
  classe: {
    id: number;
    libelle: string;
  };
  enseignant: {
    id: number;
    nom_complet: string;
  };
  annee_scolaire: number;
  est_titulaire?: boolean;
}

export interface CategorieEvaluation {
  id: number;
  affectation: number;
  periode: number;
  nom: string;
  poids: number;
  type_categorie: TypeCategorie;
}

export interface CategoriePayload {
  affectation: number;
  periode: number;
  nom: string;
  poids: number;
  type_categorie: TypeCategorie;
}

export interface Evaluation {
  id: number;
  affectation: number;
  periode: number;
  categorie?: number | null;
  libelle_evaluation: string;
  note_max: number;
  date_evaluation: string;
}

export interface EvaluationPayload {
  affectation: number;
  periode: number;
  categorie?: number;
  libelle_evaluation: string;
  note_max: number;
  date_evaluation: string;
}

export interface Cours {
  id: number;
  libelle: string;
  code?: string;
  description?: string;
}
