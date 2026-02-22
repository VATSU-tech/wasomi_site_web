import {  type_projects, type_element, type_partner } from "../Typescript/types";

export const navbar_element:type_element[] = [
    {   title : "Acceuil",
        content : "#hero",
        delay: 100,
    },
    {   title : "À propos",
        delay: 300,
        content : "#about"
    },
    {   title : "Projets",
        delay: 500,
        content : "#projects"
    },
    {   title : "Partenaires",
        delay: 700,
        content : "#partners"
    },
    {   title : "Pourquoi nous",
        delay: 900,
        content : "#motivation"
    },
    {   title : "Galerie",
        delay: 1100,
        content : "#galerie"
    },
    {
        title: "Contact",
        delay: 1300,
        content:"#contact"
    }
]

export const about_element:type_element[] = [
    {
        title: "Situation Actuelle",
        content: `Nous accueillons aujourd'hui plus de 100 élèves dans des classes modernes et équipées. Notre équipe pédagogique est composée de professionnels passionnés et dévoués.`,
        delay: 100
    },
    {
        title: "Notre Vision",
        content: `Devenir la référence en matière d'éducation innovante, en intégrant les nouvelles technologies et des méthodes d'apprentissage actives.`,
        delay: 300
    },
    {
        title: "Philosophie",
        content: `Chaque eleve est unique et nous devons a tout prix trouver la methode d'apprentissage qui lui convient le mieux.`,
        delay: 500
    },
    {
        title: "Notre Vision",
        content: `Devenir la référence en matière d'éducation innovante, en intégrant les nouvelles technologies et des méthodes d'apprentissage actives.`,
        delay: 700
    },
    {
        title: "Valeurs",
        content: `Devenir la référence en matière d'éducation innovante, en intégrant les nouvelles technologies et des méthodes d'apprentissage actives.`,
        delay: 900
    },
    {
        title: "Notre Vision",
        content: `Devenir la référence en matière d'éducation innovante, en intégrant les nouvelles technologies et des méthodes d'apprentissage actives.`,
        delay: 1100
    }
]

export const projects_element:type_projects[] = [
  {
    title: "Classe Numérique",
    desc: "Équipement de toutes les classes avec des tableaux interactifs et des tablettes pour les élèves.",
    status: "En cours",
    delay: 100
  },
  {
    title: "Jardin Pédagogique",
    desc: "Création d'un potager pour sensibiliser les enfants à la nature et à l'alimentation saine.",
    status: "Terminé",
    delay: 300
  },
  {
    title: "Bibliothèque Moderne",
    desc: "Rénovation de la bibliothèque avec un espace lecture confortable et plus de 1000 nouveaux ouvrages.",
    status: "À venir",
    delay: 500
  },
  {
    title: "Bâtiment",
    desc: "Construction d'un nouveau bâtiment pour accueillir plus d'élèves pour les classes secondaires.",
    status: "À venir",
    delay: 700
  },
  {
    title: "Labo Informatique",
    status: "Terminé",
    desc: "Construction d'un d'un labo informatique pour les élèves.",
    delay: 900
  },
  {
    title: "Labo scientifique",
    status: "En cours",
    desc: "Construction d'un d'un labo scientifique pour les élèves.",
    delay: 1100
  },
];

export const partners_element: type_partner[] = [
  {
    name: "Code Club",
    description: "Réseau mondial de clubs de code gratuits pour les enfants.",
    website: "https://codeclub.org",
    color: "var(--primary-color)", // Emerald
    delay:100,
    image: "https://imgs.search.brave.com/zyJUA0y577312Fu8sjKmey1VDU-t_pt4Px2MwNm7ggs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29kaW5na2lkcy1h/ZnJpY2EuY29tL2Fm/cmljYW4tY2hpbGRy/ZW4tbGVhcm5pbmct/Y29kaW5nLXdpdGgt/Y29tcHV0ZXJzLWlu/LmpwZw", // Emerald
  },
  {
    name: "Raspberry Pi",
    description:
      "Ordinateurs abordables et logiciels pour l'apprentissage de la programmation.",
    website: "https://www.raspberrypi.org",
    delay:300,
    color: "#F52202", // Amber
    image: "https://imgs.search.brave.com/KQB5cqeaW6IP9XKF4wrIIBctOkaMx3ZbxUXMUytgGGk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bG9nby53aW5lL2Ev/bG9nby9SYXNwYmVy/cnlfUGkvUmFzcGJl/cnJ5X1BpLUxvZ28u/d2luZS5zdmc", // Raspberry pink
  },
  {
    name: "Beni Futur",
    description: "Promouvoir l'innovation et la technologie à Beni.",
    website: "https://benifutur.com",
    delay:500,
    color: "#3B82F6", // Blue
    image: "https://imgs.search.brave.com/BwQDpfKWmZeEn40wGNjYEXrEM6BhYvrexsmbIHHilc8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dGhlb3JnLmNvbS8x/MDRlNTgwZS0zZTQx/LTRiNWYtOTM4My02/NmVhZDU4NjVkZjRf/dGh1bWIuanBn", // Blue
  },
  {
    name: "Tech Education",
    description: "Partenaire pour l'excellence éducative technologique.",
    delay:700,
    website: "https://techeducation.com",
    color: "#F59E0B", // Amber
    image: "https://imgs.search.brave.com/zB0Uc_45ELhN_kTOtwjZRZziyw7qFDbeBW0RfeFGaGY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTIv/Mzg0LzMwMy9zbWFs/bC90ZWNoLWJvb2st/ZWR1Y2F0aW9uLWxv/Z28tdmVjdG9yLmpw/Zw", // Amber
  },
  {
    name: "Science Pour Tous",
    description: "Vulgarisation scientifique et accès aux ressources.",
    delay:900,
    website: "https://sciencepourtous.fr",
    color: "#8B5CF6", // Violet
    image: "https://imgs.search.brave.com/qWWNiYJhRZCxPUL0fNywaqL88P67pGh_YiM4Rgo2sGE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdGV1cnMtcHJl/bWl1bS9jZXJjbGUt/YmxldS1tb3Qtc2Np/ZW5jZS1kZXNzdXNf/NTU0NjgyLTExNjYw/LmpwZz9zZW10PWFp/c19zZV9lbnJpY2hl/ZCZ3PTc0MCZxPTgw", // Violet
  },
  {
    name: "Innov Lab",
    description: "Laboratoire d'innovation pour les jeunes créateurs.",
    delay:1100,
    website: "https://innovlab.fr",
    color: "#252E0B", // Amber
    image: "https://search.brave.com/images?q=innov+lab+logo&context=W3sic3JjIjoiaHR0cHM6Ly9pbWcuZnJlZXBpay5jb20vcHJlbWl1bS12ZWN0b3IvaW5ub3ZhdGlvbi1sb2dvLWxhYi1jcmVhdGl2ZS1kZXNpZ24tcm9ja2V0LXNjaWVuY2UtZGVzaWduLXRlbXBsYXRlXzY2OTc5NC0zNTYuanBnP3NlbXQ9YWlzX2h5YnJpZCZ3PTc0MCZxPTgwIiwidGV4dCI6IlZlY3RvciBpbm5vdmF0aW9uIGxvZ28gbGFiIGNyZWF0aXZlIGRlc2lnbiByb2NrZXQgc2NpZW5jZSBkZXNpZ24gdGVtcGxhdGUiLCJwYWdlX3VybCI6Imh0dHBzOi8vd3d3LmZyZWVwaWsuY29tL3ZlY3RvcnMvaW5ub3ZhdGlvbi1sYWItbG9nbyJ9XQ%3D%3D&sig=caade06a2d094a9dc42fa0a6719da33f3fd1f61bce285321cb7450b8b77dbfe7&nonce=11e04c7629273e7464c8d89f31f0bfd4",
  },
];
