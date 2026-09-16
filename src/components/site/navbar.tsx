import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Moon, Sun, GraduationCap, Phone } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { authStore } from "@/store/auth-store";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/formations", label: "Formations" },
  { to: "/galerie", label: "Galerie" },
  { to: "/equipe", label: "Équipe" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Actualités" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-3 md:py-4",
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <nav
          className={cn(
            "flex items-center justify-between px-4 md:px-6 py-2.5 transition-all duration-300",
            scrolled
              ? "glass shadow-lg rounded-2xl"
              : isTransparent
                ? "bg-transparent rounded-2xl"
                : "glass rounded-2xl",
          )}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="./icon-cercle.png" 
                className="h-10"
                alt="icon de l'ecode" />
              {/* <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="relative bg-gradient-primary rounded-xl p-2">
                <GraduationCap
                  className={cn(
                    "size-5 text-white transition-transform group-hover:-rotate-6 duration-300",
                  )}
                />
              </div> */}
            </div>
            <span
              className={cn(
                "font-display font-bold text-lg tracking-tight",
                isTransparent && !scrolled
                  ? "text-white"
                  : "text-foreground",
              )}
            >
              CS Wasomi
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg",
                    isTransparent && !scrolled
                      ? "text-white/80 hover:text-white"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  activeProps={{
                    className: cn(
                      isTransparent && !scrolled
                        ? "text-white font-semibold"
                        : "text-primary font-semibold",
                    ),
                  }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-primary rounded-full" />
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
              className={cn(
                "size-11 rounded-xl transition-all duration-300 flex items-center justify-center",
                isTransparent && !scrolled
                  ? "text-white/90 hover:bg-white/10"
                  : "glass hover:shadow-md",
              )}
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
            <Link
              to={authStore.hasRole("super_admin") ? "/admin" : "/contact"}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              {authStore.hasRole("super_admin") ? "Administration" : "S'inscrire"}
            </Link>
            <button
              className={cn(
                "lg:hidden size-11 rounded-xl flex items-center justify-center transition-all duration-300",
                isTransparent && !scrolled
                  ? "text-white hover:bg-white/10"
                  : "glass",
              )}
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            open ? "max-h-[560px] mt-2 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <ul className="glass rounded-2xl p-3 space-y-1 shadow-xl">
            {links.map((l, i) => (
              <li
                key={l.to}
                style={{ transitionDelay: open ? `${i * 35}ms` : "0ms" }}
                className={cn(
                  "transition-all duration-300",
                  open
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0",
                )}
              >
                <Link
                  to={l.to}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
                  activeProps={{
                    className:
                      "!text-primary font-semibold bg-surface-elevated",
                  }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {authStore.hasRole("super_admin") && (
              <li className="pt-1">
                <Link
                  to="/admin"
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
                >
                  Administration
                </Link>
              </li>
            )}
            <li className="pt-2">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-lg active:scale-[0.98] transition-transform"
              >
                <Phone className="size-4" />
                Préinscription
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}