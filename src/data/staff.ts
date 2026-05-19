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
    name: "Dr. Patrick Mwamba",
    role: "Directeur pédagogique",
    category: "Direction générale",
    qualification: "Doctorat en Sciences de l'éducation",
    bio: "20 ans d'expérience en sciences de l'éducation.",
    image: "/personnel/Dr. Patrick Mwamba.jpg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000001",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 2,
    name: "Sarah Tshibanda",
    role: "Responsable Design",
    category: "Administration",
    qualification: "Master en Design & Communication",
    bio: "Ex-Lead Designer chez Google.",
    image: "/personnel/Sarah Tshibanda.jpg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000002",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 3,
    name: "Jean-Luc Kabongo",
    role: "Lead Dev & Mentor",
    category: "Enseignants principaux",
    qualification: "Ingénieur logiciel senior",
    bio: "15 ans d'engineering, 3 startups.",
    image: "/personnel/Jean-Luc Kabongo.jpg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000003",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 4,
    name: "Aisha Mbumba",
    role: "Coach carrière",
    category: "Assistants",
    qualification: "Spécialiste en accompagnement professionnel",
    bio: "Accompagne 200+ étudiants/an vers l'emploi.",
    image: "/personnel/Aisha Mbumba.jpg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000004",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 5,
    name: "Eric Lumbala",
    role: "Data Lead",
    category: "Personnel technique",
    qualification: "PhD en Intelligence Artificielle",
    bio: "PhD en IA, ex-chercheur INRIA.",
    image: "/personnel/Eric Lumbala.jpg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000005",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
  {
    id: 6,
    name: "Marie Nzuzi",
    role: "Responsable Vie étudiante",
    category: "Autres membres",
    qualification: "Experte en vie étudiante & cohésion",
    bio: "Crée du lien et de la cohésion.",
    image: "/personnel/Marie Nzuzi.jpg",
    email: "mailto:contact@wasomi.cd",
    phone: "tel:+243000000006",
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
    order: 1,
  },
];
