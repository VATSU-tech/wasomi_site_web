import { T as jsxRuntimeExports } from "./worker-entry-DA7_1Qcz.js";
import { G as Gallery, g as galleryCategories, a as galleryItems } from "./gallery-CtKmpf1R.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-DuuWK76I.js";
import "./heart-unko6K67.js";
function GaleriePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-mesh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-7xl relative py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold tracking-widest uppercase text-primary mb-4", "data-aos": "fade-down", children: "Notre univers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl md:text-6xl font-bold tracking-tight", "data-aos": "fade-up", children: [
          "Galerie ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Wasomi" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-2xl mx-auto", "data-aos": "fade-up", "data-aos-delay": "100", children: "Plongez dans l'univers de notre école : campus, équipements, événements et réalisations." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gallery, { items: galleryItems, categories: galleryCategories }) })
  ] });
}
export {
  GaleriePage as component
};
