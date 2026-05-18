import { T as jsxRuntimeExports } from "./worker-entry-BCQ116S2.js";
import { d as cn } from "./router-HTJ5dKkJ.js";
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "max-w-3xl mb-12",
        align === "center" ? "mx-auto text-center" : "",
        className
      ),
      "data-aos": "fade-up",
      children: [
        eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold tracking-widest uppercase text-primary mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-primary animate-glow-pulse" }),
          eyebrow
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-5xl font-bold tracking-tight", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base md:text-lg text-muted-foreground leading-relaxed", children: description })
      ]
    }
  );
}
export {
  SectionHeading as S
};
