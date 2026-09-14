export type RoleParental = 'Père' | 'Mère' | 'Tuteur légal' | 'Autre';
export type Sexe = 'M' | 'F';

export interface Eleve {
  id: number;
  matricule: string;
  nom: string;
  post_nom?: string;
  prenom: string;
  sexe: Sexe;
  date_naissance: string;
  telephone?: string | null;
  email?: string | null;
  photo?: string | null;
  age?: number;
}

export interface Parent {
  id: number;
  nom: string;
  post_nom?: string;
  prenom: string;
  telephone: string;
  email?: string | null;
  display_name?: string;
}

export interface ParentAssociation {
  id: number;
  role_parental: RoleParental;
  est_tuteur_legal: boolean;
  est_responsable_financier: boolean;
}

export interface NouvelElevePayload {
  nom: string;
  post_nom?: string;
  prenom: string;
  sexe: Sexe;
  date_naissance: string;
  telephone?: string;
  email?: string;
}

export interface InscriptionRequest {
  eleve?: number;
  nouvel_eleve?: NouvelElevePayload;
  classe: number;
  annee_scolaire: number;
  parents: Array<{
    id?: number;
    nouveau_parent?: {
      nom: string;
      post_nom?: string;
      prenom: string;
      telephone: string;
      email?: string;
    };
    role_parental: RoleParental;
    est_tuteur_legal: boolean;
    est_responsable_financier: boolean;
  }>;
}

export interface Inscription {
  id: number;
  eleve: Eleve;
  classe: number;
  annee_scolaire: number;
  date_inscription: string;
  statut: string;
}
