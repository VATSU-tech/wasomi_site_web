import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-DA7_1Qcz.js";
import { c as createLucideIcon, b as MapPin, P as Phone, M as Mail } from "./router-DuuWK76I.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
function ContactPage() {
  const [sent, setSent] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative bg-hero py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-mesh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl relative text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl md:text-6xl font-bold tracking-tight", "data-aos": "fade-up", children: [
          "Parlons ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "ensemble" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-2xl mx-auto", "data-aos": "fade-up", "data-aos-delay": "100", children: "Une question, un projet, une candidature ? On vous répond sous 24h." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-4", "data-aos": "fade-right", children: [{
        icon: MapPin,
        title: "Adresse",
        value: "123 Avenue de l'Éducation, Kinshasa"
      }, {
        icon: Phone,
        title: "Téléphone",
        value: "+243 000 000 000"
      }, {
        icon: Mail,
        title: "Email",
        value: "contact@wasomi.school"
      }].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl glass hover:shadow-glow transition-spring flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: c.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-1", children: c.value })
        ] })
      ] }, c.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("form", { className: "lg:col-span-3 p-8 rounded-2xl glass shadow-elegant", "data-aos": "fade-left", onSubmit: (e) => {
        e.preventDefault();
        setSent(true);
      }, children: sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 animate-in zoom-in-95 duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4 animate-glow-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-8 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold", children: "Message envoyé !" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Nous revenons vers vous très vite." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSent(false), className: "mt-6 text-sm font-semibold text-primary hover:underline", children: "Envoyer un autre message" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nom", name: "name", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", name: "email", type: "email", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sujet", name: "subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, rows: 6, className: "w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:shadow-glow focus:outline-none transition-smooth resize-none", placeholder: "Votre message..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-spring", children: [
          "Envoyer le message",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
        ] })
      ] }) })
    ] }) })
  ] });
}
function Field({
  label,
  name,
  type = "text",
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: name, className: "block text-sm font-semibold mb-2", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: " *" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: name, name, type, required, className: "w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:shadow-glow focus:outline-none transition-smooth" })
  ] });
}
export {
  ContactPage as component
};
