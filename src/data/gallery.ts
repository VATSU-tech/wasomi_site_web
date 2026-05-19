export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  likes?: number;
  comment?: number;
  category: string;
  description?: string;
  shortDescription?: string;
  featured?: boolean;
  priority: number;
  tags: string[];
  subject: string;
  context: string;
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
  { id: "8", src: s("labo_3.jpg"), title: "Travaux pratiques", category: "Vie étudiante", shortDescription: "Atelier collaboratif en laboratoire.", description: "Les élèves appliquent directement les notions apprises dans un atelier guidé.", subject: "Élèves en activité pratique", context: "Session d'apprentissage active en laboratoire", featured: true, priority: 1, likes: 78, tags: ["atelier", "apprentissage", "laboratoire", "collaboration"] },
  { id: "12", src: s("IMG-20260419-WA0016.jpg"), title: "Remise des distinctions", category: "Réalisations", shortDescription: "Photo officielle de valorisation.", description: "Photo de groupe après la valorisation des meilleurs travaux et l'encadrement pédagogique.", subject: "Lauréats et encadreurs", context: "Cérémonie de clôture et reconnaissance", featured: true, priority: 2, likes: 29, tags: ["récompense", "cérémonie", "groupe", "réussite"] },
  { id: "1", src: s("campus_1.jpg"), title: "Vue du campus", category: "Campus", shortDescription: "Panorama structuré du site scolaire.", description: "Pelouse centrale et bâtiments pédagogiques dans une composition claire et professionnelle.", subject: "Architecture et espaces extérieurs", context: "Vue d'ensemble institutionnelle", featured: true, priority: 3, likes: 18, tags: ["campus", "infrastructure", "extérieur", "identité"] },
  { id: "10", src: s("realisation.jpg"), title: "Présentation des projets", category: "Réalisations", shortDescription: "Valorisation des productions d'élèves.", description: "Élèves récompensés pour leurs réalisations techniques dans un cadre officiel.", subject: "Travaux d'élèves", context: "Présentation publique de projets", priority: 4, likes: 54, tags: ["projets", "innovation", "élèves", "présentation"] },
  { id: "5", src: s("labo_1.jpg"), title: "Séance de programmation", category: "Vie étudiante", shortDescription: "Apprentissage encadré du code.", description: "Atelier en groupe avec accompagnement du formateur et entraide entre élèves.", subject: "Programmation en groupe", context: "Cours technique en laboratoire", priority: 5, likes: 65, tags: ["programmation", "encadrement", "groupe", "numérique"] },
  { id: "4", src: s("labo_info.jpg"), title: "Laboratoire informatique", category: "Équipement", shortDescription: "Salle dédiée aux cours technologiques.", description: "Salle équipée pour les cours de codage et les pratiques numériques régulières.", subject: "Postes et mobilier informatique", context: "Infrastructure pédagogique", priority: 6, likes: 23, tags: ["informatique", "équipement", "salle", "numérique"] },
  { id: "3", src: s("equipement_1.jpg"), title: "Salle numérique", category: "Équipement", shortDescription: "Espace technique fonctionnel.", description: "Postes informatiques et connexion pour les travaux pratiques et l'apprentissage digital.", subject: "Équipement numérique", context: "Cours pratiques assistés par ordinateur", priority: 7, likes: 28, tags: ["matériel", "ordinateurs", "école", "technique"] },
  { id: "16", src: s("radio_1.jpg"), title: "Studio pédagogique", category: "Événements", shortDescription: "Production audio encadrée.", description: "Encadrement pratique dans un mini-studio radio pour développer l'expression orale.", subject: "Atelier média", context: "Activité événementielle spécialisée", priority: 8, likes: 26, tags: ["radio", "média", "expression", "atelier"] },
  { id: "14", src: s("evenement_2.jpg"), title: "Initiation radio", category: "Événements", shortDescription: "Découverte des métiers de la voix.", description: "Atelier média avec microphones et enregistrement orienté vers la prise de parole.", subject: "Initiation technique", context: "Événement pédagogique thématique", priority: 9, likes: 25, tags: ["microphone", "initiation", "communication", "événement"] },
  { id: "15", src: s("evenement_3.jpg"), title: "Atelier podcast", category: "Événements", shortDescription: "Création audio collaborative.", description: "Production de contenu audio en équipe avec répartition des rôles.", subject: "Podcast scolaire", context: "Projet événementiel en groupe", priority: 10, likes: 20, tags: ["podcast", "audio", "projet", "équipe"] },
  { id: "13", src: s("evenement_1.jpg"), title: "Cérémonie sur le campus", category: "Événements", shortDescription: "Animation collective en extérieur.", description: "Activité scolaire organisée en plein air réunissant élèves et encadreurs.", subject: "Communauté scolaire", context: "Événement de campus", priority: 11, likes: 23, tags: ["cérémonie", "campus", "communauté", "extérieur"] },
  { id: "11", src: s("realisation_2.jpg"), title: "Entretien avec le jury", category: "Réalisations", shortDescription: "Échange autour des projets réalisés.", description: "Discussion pédagogique autour des projets développés et de leurs impacts.", subject: "Évaluation de projets", context: "Session d'échange académique", priority: 12, likes: 21, tags: ["jury", "entretien", "évaluation", "projet"] },
  { id: "6", src: s("labo_2.jpg"), title: "Cours interactif en labo", category: "Vie étudiante", shortDescription: "Séance assistée par projection.", description: "Apprentissage visuel projeté pendant les exercices de pratique.", subject: "Cours interactif", context: "Formation numérique en classe", priority: 13, likes: 21, tags: ["projection", "cours", "interaction", "labo"] },
  { id: "9", src: s("vie_etudiant_1.jpg"), title: "Découverte du code", category: "Vie étudiante", shortDescription: "Premiers pas en programmation.", description: "Initiation à la programmation pour les plus jeunes dans un cadre encadré.", subject: "Initiation des élèves", context: "Introduction au numérique", priority: 14, likes: 23, tags: ["initiation", "jeunesse", "code", "pédagogie"] },
  { id: "7", src: s("labo_eleve_1.jpg"), title: "Étudiante en exercice", category: "Vie étudiante", shortDescription: "Pratique individuelle concentrée.", description: "Travail individuel sur ordinateur portable pendant une session de consolidation.", subject: "Travail individuel", context: "Exercice autonome en laboratoire", priority: 15, likes: 15, tags: ["autonomie", "élève", "portable", "concentration"] },
  { id: "2", src: s("pelouse.jpg"), title: "Espace extérieur", category: "Campus", shortDescription: "Zone de rassemblement scolaire.", description: "Cour verte utilisée pour les rassemblements et les temps communautaires.", subject: "Pelouse et cour", context: "Cadre de vie scolaire", priority: 16, likes: 5, tags: ["extérieur", "pelouse", "vie scolaire", "cadre"] },
];
