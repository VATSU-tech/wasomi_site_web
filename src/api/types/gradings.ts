export interface NoteEleve {
  id: number;
  eleve: {
    id: number;
    matricule: string;
    nom_complet: string;
    photo?: string | null;
  };
  inscription: number;
  note: number | null;
  note_max: number;
  est_absent?: boolean;
  remarque?: string;
}

export interface NotePayload {
  evaluation: number;
  inscription: number;
  note: number | null;
  est_absent?: boolean;
  remarque?: string;
}

export interface ResultatCours {
  cours_id: number;
  cours_libelle: string;
  note_obtenue: number;
  note_max: number;
  pourcentage: number;
}

export interface ResultatEleve {
  inscription_id: number;
  eleve: {
    id: number;
    matricule: string;
    nom_complet: string;
    photo?: string | null;
  };
  cours: ResultatCours[];
  total_obtenu: number;
  total_max: number;
  pourcentage: number;
  rang: number;
  mention: string;
}

export interface ResultatsPeriode {
  classe: number;
  periode: number;
  resultats: ResultatEleve[];
  compile_le?: string;
}

export interface Bulletin {
  inscription_id: number;
  eleve: {
    id: number;
    matricule: string;
    nom_complet: string;
    photo?: string | null;
  };
  classe: string;
  annee_scolaire: string;
  periodes: Array<{
    periode: string;
    cours: ResultatCours[];
    moyenne: number;
    rang: number;
    mention: string;
  }>;
  moyenne_generale: number;
  decision?: string;
}
