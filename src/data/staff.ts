export type StaffCategory =
  | "Direction générale"
  | "Administration"
  | "Enseignants principaux"
  | "Assistants"
  | "Personnel technique"
  | "Autres membres";

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  category: StaffCategory;
  qualification: string;
  bio: string;
  email: string;
  phone: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  order: number;
  image: string;
}

export const staffCategoryOrder: StaffCategory[] = [
  "Direction générale",
  "Administration",
  "Enseignants principaux",
  "Assistants",
  "Personnel technique",
  "Autres membres",
];

export const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Gaby Sivirwa",
    role: "Gestionnaire",
    category: "Administration",
    qualification: "Gestion administrative",
    bio: "Supervise la gestion administrative et le suivi des opérations quotidiennes.",
    image: "/personnel/Gaby Sivirwa gestionnaire.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000002",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 2,
    name: "Fazila Muhima",
    role: "Directrice maternelle",
    category: "Direction générale",
    qualification: "Direction pédagogique - Maternelle",
    bio: "Encadre l'organisation et la qualité pédagogique de la section maternelle.",
    image: "/personnel/Fazila muhima direct_maternel.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000001",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 3,
    name: "Christine Vayunda",
    role: "Enseignante 1ère maternelle",
    category: "Enseignants principaux",
    qualification: "Pédagogie maternelle",
    bio: "Accompagne les enfants dans leurs premiers apprentissages en maternelle.",
    image: "/personnel/Christine vayunda 1_maternel.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000003",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 4,
    name: "Divine",
    role: "Encadreuse crèche",
    category: "Assistants",
    qualification: "Petite enfance",
    bio: "Assure l'encadrement et le bien-être des enfants de la crèche.",
    image: "/personnel/divine creche.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000004",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 5,
    name: "Roger",
    role: "Enseignant 4ème primaire",
    category: "Enseignants principaux",
    qualification: "Enseignement primaire",
    bio: "Responsable de la classe de 4ème primaire.",
    image: "/personnel/Roger 4_primaire.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000005",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 2,
  },
  {
    id: 6,
    name: "Lydie Carol",
    role: "Enseignante 1ère primaire",
    category: "Enseignants principaux",
    qualification: "Enseignement primaire",
    bio: "Prend en charge les fondamentaux de la 1ère primaire.",
    image: "/personnel/Lydie carol 1_primaire.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000006",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 3,
  },
  {
    id: 7,
    name: "Fidele Mahitiko",
    role: "Enseignant 3ème primaire",
    category: "Enseignants principaux",
    qualification: "Enseignement primaire",
    bio: "Accompagne les élèves de 3ème primaire dans leur progression scolaire.",
    image: "/personnel/Fidele mahitiko 3_primaire.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000007",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 4,
  },
  {
    id: 8,
    name: "Jean Baptiste Kapikani",
    role: "Enseignant 5ème primaire",
    category: "Enseignants principaux",
    qualification: "Enseignement primaire",
    bio: "Responsable pédagogique de la 5ème primaire.",
    image: "/personnel/Jean Baptiste kapikani 5_primaire.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000008",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 5,
  },
  {
    id: 9,
    name: "Moise Kiberiti",
    role: "Enseignant 6ème primaire",
    category: "Enseignants principaux",
    qualification: "Enseignement primaire",
    bio: "Prépare les élèves de 6ème primaire aux évaluations finales.",
    image: "/personnel/Moise Kiberiti 6_primaire.jpeg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000009",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 6,
  },
];
