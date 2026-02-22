import {  type_projects, type_element } from "../Typescript/types";

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