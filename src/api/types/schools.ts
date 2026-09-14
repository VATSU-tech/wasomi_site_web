export interface Cycle {
  id: number;
  libelle: string;
}

export interface Domaine {
  id: number;
  libelle: string;
  cycle: number;
}

export interface Niveau {
  id: number;
  libelle: string;
  domaine?: number;
  cycle: number;
}

export interface Option {
  id: number;
  libelle: string;
  niveau: number;
}

export interface Classe {
  id: number;
  libelle: string;
  cycle: number;
  domaine?: number | null;
  niveau: number;
  option?: number | null;
  effectif?: number;
  titulaire?: {
    id: number;
    nom_complet: string;
  } | null;
}

export interface Periode {
  id: number;
  libelle: string;
  semestre: number;
  ordre: number;
  est_active: boolean;
}

export interface Semestre {
  id: number;
  libelle: string;
  ordre: number;
  annee_scolaire: number;
}
