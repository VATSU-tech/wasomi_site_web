export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  liked: boolean;
  category: string;
  description?: string;
  featured?: boolean;
};

export const galleryCategories = [
  "Campus",
  "Réalisations",
  "Équipement",
  "Vie étudiante",
  "Événements",
];
const s = (l: string) => `/gallerie/${l}`;
export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    src: s("campus_1.jpg"),
    title: "Vue du campus",
    category: "Campus",
    description: "Pelouse centrale et bâtiments pédagogiques.",
    featured: true,
    liked: false,
  },
  {
    id: "2",
    src: s("pelouse.jpg"),
    title: "Espace extérieur",
    category: "Campus",
    description: "Cour verte utilisée pour les rassemblements scolaires.",
    liked: false,
  },
  {
    id: "3",
    src: s("equipement_1.jpg"),
    title: "Salle numérique",
    category: "Équipement",
    description: "Postes informatiques et connexion pour les travaux pratiques.",
    liked: false,
    // featured: true,
  },
  {
    id: "4",
    src: s("labo_info.jpg"),
    title: "Laboratoire informatique",
    category: "Équipement",
    description: "Salle équipée pour les cours de codage et de robotique.",
    liked: false,
  },
  {
    id: "5",
    src: s("labo_1.jpg"),
    title: "Séance de programmation",
    category: "Vie étudiante",
    description: "Atelier en groupe avec accompagnement du formateur.",
    liked: false,
  },
  {
    id: "6",
    src: s("labo_2.jpg"),
    title: "Cours interactif en labo",
    category: "Vie étudiante",
    description: "Apprentissage visuel projeté pendant les exercices.",
    liked: false,
  },
  {
    id: "7",
    src: s("labo_eleve_1.jpg"),
    title: "Étudiante en exercice",
    category: "Vie étudiante",
    description: "Pratique individuelle sur ordinateur portable.",
    liked: false,
  },
  {
    id: "8",
    src: s("labo_3.jpg"),
    title: "Travaux pratiques",
    category: "Vie étudiante",
    description: "Les élèves appliquent directement les notions apprises.",
    liked: false,
    featured: true,
  },
  {
    id: "9",
    src: s("vie_etudiant_1.jpg"),
    title: "Découverte du code",
    category: "Vie étudiante",
    description: "Initiation à la programmation pour les plus jeunes.",
    liked: false,
  },
  {
    id: "10",
    src: s("realisation.jpg"),
    title: "Présentation des projets",
    category: "Réalisations",
    description: "Élèves récompensés pour leurs réalisations techniques.",
    liked: false,
  },
  {
    id: "11",
    src: s("realisation_2.jpg"),
    title: "Entretien avec le jury",
    category: "Réalisations",
    description: "Échange autour des projets développés en formation.",
    liked: false,
  },
  {
    id: "13",
    src: s("evenement_1.jpg"),
    title: "Cérémonie sur le campus",
    category: "Événements",
    description: "Activité scolaire organisée en plein air.",
    liked: false,
  },
  {
    id: "12",
    src: s("IMG-20260419-WA0016.jpg"),
    title: "Remise des distinctions",
    category: "Réalisations",
    description: "Photo de groupe après la valorisation des meilleurs travaux.",
    featured: true,
    liked: false,
  },
  {
    id: "14",
    src: s("evenement_2.jpg"),
    title: "Initiation radio",
    category: "Événements",
    description: "Atelier média avec microphones et enregistrement.",
    liked: false,
  },
  {
    id: "15",
    src: s("evenement_3.jpg"),
    title: "Atelier podcast",
    category: "Événements",
    description: "Production de contenu audio en équipe.",
    liked: false,
  },
  {
    id: "16",
    src: s("radio_1.jpg"),
    title: "Studio pédagogique",
    category: "Événements",
    description: "Encadrement pratique dans un mini-studio radio.",
    liked: false,
  },
];
