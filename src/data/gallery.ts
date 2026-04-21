export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  category: string;
  description?: string;
  featured?: boolean;
};

const u = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const galleryCategories = [
  "Campus",
  "Réalisations",
  "Équipement",
  "Vie étudiante",
  "Événements",
];

export const galleryItems: GalleryItem[] = [
  { id: "1", src: u("photo-1551434678-e076c223a692"), title: "Campus principal", category: "Campus", description: "Notre bâtiment historique au cœur de la ville.", featured: true },
  { id: "2", src: u("photo-1581091226825-a6a2a5aee158"), title: "Projet IA d'étudiants", category: "Réalisations", description: "Hackathon 2024 — équipe primée." },
  { id: "3", src: u("photo-1518770660439-4636190af475"), title: "Laboratoire électronique", category: "Équipement", description: "Stations de prototypage dernière génération." },
  { id: "4", src: u("photo-1522202176988-66273c2fd55f"), title: "Travaux de groupe", category: "Vie étudiante", description: "Espaces collaboratifs ouverts 24/7." },
  { id: "5", src: u("photo-1540575467063-178a50c2df87"), title: "Conférence annuelle", category: "Événements", description: "Plus de 500 participants." },
  { id: "6", src: u("photo-1497486751825-1233686d5d80"), title: "Bibliothèque moderne", category: "Campus", description: "Plus de 30 000 ouvrages." },
  { id: "7", src: u("photo-1551434678-e076c223a692"), title: "App mobile élève", category: "Réalisations", description: "Solution déployée en école primaire." },
  { id: "8", src: u("photo-1517077304055-6e89abbf09b0"), title: "Salle de design", category: "Équipement", description: "iMac Pro et tablettes graphiques.", featured: true },
  { id: "9", src: u("photo-1529390079861-591de354faf5"), title: "Remise des diplômes", category: "Événements", description: "Promotion 2024." },
  { id: "10", src: u("photo-1531545514256-b1400bc00f31"), title: "Cafétéria", category: "Vie étudiante" },
  { id: "11", src: u("photo-1606761568499-6d2451b23c66"), title: "Robotique", category: "Réalisations", description: "Compétition régionale 2e place." },
  { id: "12", src: u("photo-1588072432836-e10032774350"), title: "Amphithéâtre", category: "Campus" },
];
