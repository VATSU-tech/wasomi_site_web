/**
 * School history configuration
 * Centralized metadata for the history section
 */

export interface SchoolHistoryConfig {
  title: string;
  subtitle: string;
  textFile: string;
  audioFile: string;
  subtitlesFile: string;
  backgroundImage: string;
  overlayOpacity: number;
  keyDates: {
    year: number;
    event: string;
    details?: string;
  }[];
  keyAchievements: {
    icon: string;
    title: string;
    description: string;
    stats?: string;
  }[];
  coreValues: {
    label: string;
    description: string;
  }[];
}

export const schoolHistoryConfig: SchoolHistoryConfig = {
  title: "L'histoire de Wasomi",
  subtitle: "Une aventure éducative fondée sur l'excellence et la passion",
  textFile: "/docs/historique_100120_082724.txt",
  audioFile: "/docs/historique_audio.mp3",
  subtitlesFile: "/docs/historique_timeline.vtt",
  backgroundImage: "/gallerie/realisation.jpg",
  overlayOpacity: 0.5,
  keyDates: [
    {
      year: 2021,
      event: "Initiative familiale",
      details:
        "La famille PALUKU SIVIRWA Gabriel décide de créer une école de qualité",
    },
    {
      year: 2022,
      event: "Fondation officielle",
      details: "Complexe Scolaire WASOMI créé et agréé comme école privée",
    },
    {
      year: 2022,
      event: "Ouverture",
      details: "6 classes de maternelle à 3ème primaire + crèche",
    },
    {
      year: 2023,
      event: "Expansion",
      details: "Ajout de 4ème et 5ème primaire",
    },
    {
      year: 2024,
      event: "Réussite",
      details: "6ème primaire créée - 100% de réussite à l'examen national",
    },
    {
      year: 2025,
      event: "Section secondaire",
      details: "Lancement de la classe de 7ème éducation de base",
    },
  ],
  keyAchievements: [
    {
      icon: "🎓",
      title: "Excellence académique",
      description:
        "Tous nos finalistes ont réussi à l'examen nationale de fin d'étude primaire",
      stats: "100%",
    },
    {
      icon: "📚",
      title: "Approche bilingue",
      description: "Enseignement en français et anglais dès la maternelle",
      stats: "2 langues",
    },
    {
      icon: "🌱",
      title: "Environnement naturel",
      description:
        "Bâtiment dans un milieu naturel favorisant l'épanouissement",
      stats: "Premium",
    },
    {
      icon: "🔬",
      title: "Infrastructure complète",
      description: "Bibliothèque, laboratoire, salle informatique",
      stats: "3 espaces",
    },
  ],
  coreValues: [
    {
      label: "Savoir",
      description:
        "Une éducation de qualité basée sur le programme national avec adaptations compétitives",
    },
    {
      label: "Respect",
      description:
        "Environnement sûr et inclusif où chaque enfant est valorisé",
    },
    {
      label: "Excellence",
      description: "Viser le meilleur dans chaque détail et chaque action",
    },
  ],
};
