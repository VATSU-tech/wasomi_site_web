import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-BCQ116S2.js";
import { c as createLucideIcon, d as cn, X } from "./router-HTJ5dKkJ.js";
import { H as Heart } from "./heart-C0Cexc-E.js";
const __iconNode$3 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$3);
const __iconNode$2 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function Gallery({ items, categories }) {
  const [filter, setFilter] = reactExports.useState("Tous");
  const [lightbox, setLightbox] = reactExports.useState(null);
  const filtered = filter === "Tous" ? items : items.filter((i) => i.category === filter);
  const close = reactExports.useCallback(() => setLightbox(null), []);
  const next = reactExports.useCallback(
    () => setLightbox((i) => i === null ? null : (i + 1) % filtered.length),
    [filtered.length]
  );
  const prev = reactExports.useCallback(
    () => setLightbox(
      (i) => i === null ? null : (i - 1 + filtered.length) % filtered.length
    ),
    [filtered.length]
  );
  reactExports.useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, next, prev]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-wrap items-center justify-center gap-2 mb-10",
        "data-aos": "fade-up",
        children: ["Tous", ...categories].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFilter(cat),
            className: cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-spring",
              filter === cat ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105" : "glass text-muted-foreground hover:text-foreground hover:scale-105"
            ),
            children: cat
          },
          cat
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filtered.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "article",
      {
        "data-aos": "fade-up",
        "data-aos-delay": idx % 6 * 60,
        className: cn(
          "group relative overflow-hidden rounded-2xl bg-card cursor-pointer shadow-elegant",
          "transition-spring hover:-translate-y-2",
          item.featured && "sm:col-span-2 lg:col-span-2 lg:row-span-2"
        ),
        onClick: () => setLightbox(idx),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative overflow-hidden", item.featured ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-[4/3]"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.src,
              alt: item.title,
              loading: "lazy",
              className: "size-full object-cover transition-spring group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-70 group-hover:opacity-100 transition-smooth" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 ring-2 ring-inset ring-primary/0 group-hover:ring-primary/60 transition-smooth rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 right-4 flex gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-spring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                },
                "aria-label": "Aimer",
                className: "gap-1 px-1 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.likes !== void 0 ? item.likes : 0 })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                },
                "aria-label": "Partager",
                className: "size-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-semibold text-foreground", children: item.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-spring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg md:text-xl font-bold text-foreground", children: item.title }),
            item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-smooth delay-75", children: item.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-spring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "size-3.5" }),
              "Voir en grand"
            ] })
          ] })
        ] })
      },
      item.id
    )) }),
    lightbox !== null && filtered[lightbox] && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": filtered[lightbox].title,
        className: "fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300",
        onClick: close,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "aria-label": "Fermer",
              onClick: close,
              className: "absolute top-4 right-4 size-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth z-10",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "aria-label": "Précédent",
              onClick: (e) => {
                e.stopPropagation();
                prev();
              },
              className: "absolute left-4 md:left-8 size-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth z-10",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "aria-label": "Suivant",
              onClick: (e) => {
                e.stopPropagation();
                next();
              },
              className: "absolute right-4 md:right-8 size-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth z-10",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "max-w-6xl w-full max-h-[85vh] flex flex-col gap-4 animate-in zoom-in-95 duration-300",
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-2xl overflow-hidden shadow-glow flex-1 min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: filtered[lightbox].src,
                    alt: filtered[lightbox].title,
                    className: "size-full object-contain bg-surface"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary uppercase tracking-widest", children: filtered[lightbox].category }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl md:text-2xl font-bold mt-1", children: filtered[lightbox].title }),
                    filtered[lightbox].description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: filtered[lightbox].description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground shrink-0", children: [
                    lightbox + 1,
                    " / ",
                    filtered.length
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
const galleryCategories = [
  "Campus",
  "Réalisations",
  "Équipement",
  "Vie étudiante",
  "Événements"
];
const s = (l) => `/gallerie/${l}`;
const galleryItems = [
  {
    id: "1",
    src: s("campus_1.jpg"),
    title: "Vue du campus",
    category: "Campus",
    description: "Pelouse centrale et bâtiments pédagogiques.",
    featured: true,
    likes: 18
  },
  {
    id: "2",
    src: s("pelouse.jpg"),
    title: "Espace extérieur",
    category: "Campus",
    description: "Cour verte utilisée pour les rassemblements scolaires.",
    likes: 5
  },
  {
    id: "3",
    src: s("equipement_1.jpg"),
    title: "Salle numérique",
    category: "Équipement",
    description: "Postes informatiques et connexion pour les travaux pratiques.",
    likes: 28
    // featured: true,
  },
  {
    id: "4",
    src: s("labo_info.jpg"),
    title: "Laboratoire informatique",
    category: "Équipement",
    description: "Salle équipée pour les cours de codage et de robotique.",
    likes: 23
  },
  {
    id: "5",
    src: s("labo_1.jpg"),
    title: "Séance de programmation",
    category: "Vie étudiante",
    description: "Atelier en groupe avec accompagnement du formateur.",
    likes: 65
  },
  {
    id: "6",
    src: s("labo_2.jpg"),
    title: "Cours interactif en labo",
    category: "Vie étudiante",
    description: "Apprentissage visuel projeté pendant les exercices.",
    likes: 21
  },
  {
    id: "7",
    src: s("labo_eleve_1.jpg"),
    title: "Étudiante en exercice",
    category: "Vie étudiante",
    description: "Pratique individuelle sur ordinateur portable.",
    likes: 15
  },
  {
    id: "8",
    src: s("labo_3.jpg"),
    title: "Travaux pratiques",
    category: "Vie étudiante",
    description: "Les élèves appliquent directement les notions apprises.",
    likes: 78,
    featured: true
  },
  {
    id: "9",
    src: s("vie_etudiant_1.jpg"),
    title: "Découverte du code",
    category: "Vie étudiante",
    description: "Initiation à la programmation pour les plus jeunes.",
    likes: 23
  },
  {
    id: "10",
    src: s("realisation.jpg"),
    title: "Présentation des projets",
    category: "Réalisations",
    description: "Élèves récompensés pour leurs réalisations techniques.",
    likes: 54
  },
  {
    id: "11",
    src: s("realisation_2.jpg"),
    title: "Entretien avec le jury",
    category: "Réalisations",
    description: "Échange autour des projets développés en formation.",
    likes: 21
  },
  {
    id: "13",
    src: s("evenement_1.jpg"),
    title: "Cérémonie sur le campus",
    category: "Événements",
    description: "Activité scolaire organisée en plein air.",
    likes: 23
  },
  {
    id: "12",
    src: s("IMG-20260419-WA0016.jpg"),
    title: "Remise des distinctions",
    category: "Réalisations",
    description: "Photo de groupe après la valorisation des meilleurs travaux.",
    featured: true,
    likes: 29
  },
  {
    id: "14",
    src: s("evenement_2.jpg"),
    title: "Initiation radio",
    category: "Événements",
    description: "Atelier média avec microphones et enregistrement.",
    likes: 25
  },
  {
    id: "15",
    src: s("evenement_3.jpg"),
    title: "Atelier podcast",
    category: "Événements",
    description: "Production de contenu audio en équipe.",
    likes: 20
  },
  {
    id: "16",
    src: s("radio_1.jpg"),
    title: "Studio pédagogique",
    category: "Événements",
    description: "Encadrement pratique dans un mini-studio radio.",
    likes: 26
  }
];
export {
  Gallery as G,
  galleryItems as a,
  galleryCategories as g
};
