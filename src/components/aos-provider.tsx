import { useEffect } from "react";
import AOS from "aos";
import { useRouterState } from "@tanstack/react-router";

export function AosProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 70,
      delay: 0,
      disable: prefersReduced,
      startEvent: "DOMContentLoaded",
    });

    // Safety net: never leave content invisible. If AOS hasn't revealed
    // above-the-fold elements shortly after load, force them visible.
    const t = window.setTimeout(() => {
      const hidden = document.querySelectorAll(
        '[data-aos]:not(.aos-animate):not(.aos-init)',
      );
      hidden.forEach((el) => {
        el.classList.add("aos-init", "aos-animate");
      });
    }, 1000);

    return () => window.clearTimeout(t);
  }, []);

  // Refresh AOS after route changes so newly mounted elements animate
  useEffect(() => {
    const t = setTimeout(() => AOS.refresh(), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return <>{children}</>;
}