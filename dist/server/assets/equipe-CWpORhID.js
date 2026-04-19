import { T as jsxRuntimeExports } from "./worker-entry-DA7_1Qcz.js";
import { a as Linkedin, T as Twitter, M as Mail } from "./router-DuuWK76I.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const team = [{
  name: "Dr. Patrick Mwamba",
  role: "Directeur pédagogique",
  img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  bio: "20 ans d'expérience en sciences de l'éducation."
}, {
  name: "Sarah Tshibanda",
  role: "Responsable Design",
  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  bio: "Ex-Lead Designer chez Google."
}, {
  name: "Jean-Luc Kabongo",
  role: "Lead Dev & Mentor",
  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  bio: "15 ans d'engineering, 3 startups."
}, {
  name: "Aisha Mbumba",
  role: "Coach carrière",
  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  bio: "Accompagne 200+ étudiants/an vers l'emploi."
}, {
  name: "Eric Lumbala",
  role: "Data Lead",
  img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
  bio: "PhD en IA, ex-chercheur INRIA."
}, {
  name: "Marie Nzuzi",
  role: "Responsable Vie étudiante",
  img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  bio: "Crée du lien et de la cohésion."
}];
function EquipePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative bg-hero py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-mesh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-7xl relative text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl md:text-6xl font-bold tracking-tight", "data-aos": "fade-up", children: [
          "Notre ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "équipe" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-2xl mx-auto", "data-aos": "fade-up", "data-aos-delay": "100", children: "Des enseignants passionnés, des mentors expérimentés, une communauté engagée." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: team.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("article", { "data-aos": "fade-up", "data-aos-delay": i % 3 * 80, className: "group relative rounded-2xl overflow-hidden bg-card shadow-elegant hover:shadow-glow transition-spring hover:-translate-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/5] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.img, alt: m.name, loading: "lazy", className: "size-full object-cover transition-spring group-hover:scale-110" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold", children: m.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary font-semibold mt-1", children: m.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all duration-500", children: m.bio }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-spring", children: [Linkedin, Twitter, Mail].map((Icon, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", "aria-label": "Social", className: "size-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }, j)) })
      ] })
    ] }) }, m.name)) }) })
  ] });
}
export {
  EquipePage as component
};
