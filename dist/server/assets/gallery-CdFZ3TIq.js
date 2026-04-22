import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-DNQl5kYH.js";
import { c as createLucideIcon, d as cn, X } from "./router-GPoNx6IW.js";
import { H as Heart } from "./heart-CwnydupT.js";
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                },
                "aria-label": "Aimer",
                className: "size-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4" })
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
const u = (id, w = 1200, h = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
const galleryCategories = [
  "Campus",
  "Réalisations",
  "Équipement",
  "Vie étudiante",
  "Événements"
];
const galleryItems = [
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
  { id: "12", src: u("photo-1588072432836-e10032774350"), title: "Amphithéâtre", category: "Campus" }
];
export {
  Gallery as G,
  galleryItems as a,
  galleryCategories as g
};
