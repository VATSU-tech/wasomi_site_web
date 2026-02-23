import {
  type_projects,
  type_element,
  type_partner,
  motivation,
  type_gallery_image,
  type_hero_action,
  type_hero_content,
  type_contact_item,
  type_contact_form_field,
} from "../Typescript/types";

export const hero_content: type_hero_content = {
  eyebrow: "L'excellence dès le début",
  title: "Forger les esprits de demain",
  description: {
    before: "",
    highlight: "WASOMI",
    after:
      " une école moderne axée sur l'épanouissement, l'innovation et la réussite de chaque enfant.",
  },
  delays: {
    eyebrow: 100,
    title: 200,
    description: 320,
  },
};

export const hero_actions: type_hero_action[] = [
  {
    label: "Inscrivez votre enfant",
    href: "#contact",
    delay: 520,
    variant: "primary",
    icon: "arrow-right",
  },
  {
    label: "Découvrir l'école",
    href: "#about",
    delay: 620,
    variant: "secondary",
  },
];

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

export const motivation_element: motivation[] = [
  {
    icon: "Star",
    iconColor: "var(--accent-color)",
    title: "Excellence Pédagogique",
    delay: 100,
    text: "Un programme enrichi qui dépasse les standards, préparant les enfants aux défis futurs.",
  },
  {
    icon: "Heart",
    iconColor: "var(--primary-color)",
    delay: 300,
    title: "Suivi Personnalisé",
    text: "Chaque enfant est unique. Nous adaptons notre approche pour répondre aux besoins de chacun.",
  },
  {
    icon: "Shield",
    iconColor: "#10b981",
    delay: 500,
    title: "Cadre Sécurisé",
    text: "Un environnement bienveillant et sécurisé où votre enfant peut s'épanouir en toute confiance.",
  },
  {
    icon: "Cpu",
    iconColor: "#10b9f1",
    delay: 700,
    title: "Technologie de pointe",
    text: "Des outils modernes pour accompagner les enfants dans leur apprentissage.",
  },
  {
    icon: "Medal",
    iconColor: "#a9a911",
    title: "Vie sportive",
    delay: 900,
    text: "Des activités sportives pour développer le corps et l'esprit.",
  },
  {
    icon: "Bus",
    iconColor: "#6f6f6f",
    delay: 1100,
    title: "Transport securiser",
    text: "Des bus pour le transport securiser de vos enfant en toute cisronstance et en toute intemperie",
  },
];

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

export const gallery_images: type_gallery_image[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
    category: "Classe",
    delay: 100,
    title: "Apprentissage Interactif",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    category: "Environnement",
    delay: 300,
    title: "Notre Campus",
  },
  {
    id: 3,
    src: "https://imgs.search.brave.com/FETcMZeglQLQ5T5Ls-aPFKD4Ws7InL1cPxCQyCz-ak0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9vcmRp/bmF0ZXVyLWQtZW5z/ZWlnbmVtZW50LTQt/ODE5OTg0Ny5qcGc",
    category: "Technologie",
    delay: 500,
    title: "Salle Informatique",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    delay: 700,
    category: "Activités",
    title: "Sport & Loisirs",
  },
  {
    id: 5,
    delay: 900,
    src: "https://imgs.search.brave.com/kVP-w4Bd2_JgG5c_158btmiBS6RieuwuE6leX_v9QaQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vc3RvY2ticm9r/ZXIvc3RvY2ticm9r/ZXIxNzA5L3N0b2Nr/YnJva2VyMTcwOTAw/Mjk0Lzg1MjgwMzQx/LWVuZmFudHMtbGV2/YW50LWxlcy1tYWlu/cy1hdS1jb3Vycy1k/ZS1sYS1sZSVDMyVB/N29uLWRlLWwtJUMz/JUE5Y29sZS1wcmlt/YWlyZS1ncm9zLXBs/YW4uanBnP3Zlcj02",
    category: "Diplômes",
    title: "Réussite Scolaire",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1536337005238-94b997371b40?auto=format&fit=crop&q=80&w=800",
    delay: 1100,
    category: "Ateliers",
    title: "Créativité",
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

export const contact_items: type_contact_item[] = [
  {
    icon: "Mail",
    delay: 100,
    content: [
      {
        type: "link",
        label: "cswasomi@gmail.com",
        href: "mailto:cswasomi@gmail.com",
        hover: "Envoyer un email",
      },
    ],
  },
  {
    icon: "Phone",
    delay: 300,
    content: [
      {
        type: "link",
        label: "+243 812 227 787",
        href: "tel:+243812227787",
        hover: "Appeler",
      },
      {
        type: "link",
        label: "+243 998 862 270",
        href: "tel:+243998862270",
        hover: "Appeler",
      },
    ],
  },
  {
    icon: "MapPin",
    delay: 500,
    content: [
      {
        type: "link",
        label: "Complexe scolaire wasomi",
        href: "https://maps.app.goo.gl/xqfZnZgjdTyaFeoY6",
        hover: "Voir sur Maps",
        newTab: true,
      },
    ],
  },
  {
    icon: "Calendar",
    delay: 700,
    content: [
      {
        type: "text",
        label: "Lundi - Vendredi : 7h30 - 16h00",
      },
    ],
  },
  {
    icon: "Whatsapp",
    delay: 900,
    content: [
      {
        type: "link",
        label: "+243 814 694 982",
        href: "https://api.whatsapp.com/send?phone=+243814694982&text=Bonjour wasomi",
        hover: "Discuter sur WhatsApp",
      },
    ],
  },
  {
    icon: "Facebook",
    delay: 1100,
    content: [
      {
        type: "text",
        label: "complexe scolaire wasomi",
      },
    ],
  },
  {
    icon: "XTwitter",
    delay: 1300,
    content: [
      {
        type: "text",
        label: "@wasomi_edu",
      },
    ],
  },
  {
    icon: "Instagram",
    delay: 1500,
    content: [
      {
        type: "text",
        label: "@wasomi_edu",
      },
    ],
  },
  {
    icon: "Tiktok",
    delay: 1700,
    content: [
      {
        type: "text",
        label: "cs_wasomi",
      },
    ],
  },
];

export const contact_form_fields: type_contact_form_field[] = [
  {
    name: "fullName",
    label: "Nom Complet",
    placeholder: "Votre nom",
    type: "text",
    delay: 150,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "votre@email.com",
    type: "email",
    delay: 250,
  },
  {
    name: "phone",
    label: "Numero de telephone",
    placeholder: "+243 998 862 270",
    type: "number",
    delay: 250,
  },
  {
    name: "message",
    label: "Message",
    placeholder: "Comment pouvons-nous vous aider ?",
    type: "textarea",
    rows: 4,
    delay: 350,
  },
];
