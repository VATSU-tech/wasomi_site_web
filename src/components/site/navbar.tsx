import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Moon, Sun, GraduationCap } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/formations", label: "Formations" },
  { to: "/galerie", label: "Galerie" },
  { to: "/equipe", label: "Équipe" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-smooth",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 transition-smooth",
          scrolled ? "max-w-6xl" : "max-w-7xl",
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-smooth",
            scrolled ? "glass shadow-elegant" : "bg-transparent",
          )}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-md opacity-60 group-hover:opacity-100 transition-smooth" />
              <div className="relative bg-gradient-primary rounded-lg p-2">
                <GraduationCap className="size-5 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Wasomi
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth rounded-lg"
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-primary rounded-full" />
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
              className="size-10 rounded-lg glass hover:shadow-glow transition-smooth flex items-center justify-center"
            >
              {theme === "dark" ? (
                <Sun className="size-4 text-foreground" />
              ) : (
                <Moon className="size-4 text-foreground" />
              )}
            </button>
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-smooth"
            >
              S'inscrire
            </Link>
            <button
              className="lg:hidden size-10 rounded-lg glass flex items-center justify-center"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-smooth",
            open ? "max-h-[600px] mt-2 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <ul className="glass rounded-2xl p-3 space-y-1 shadow-elegant">
            {links.map((l, i) => (
              <li
                key={l.to}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                className={cn(
                  "transition-smooth",
                  open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                )}
              >
                <Link
                  to={l.to}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-smooth"
                  activeProps={{ className: "!text-foreground bg-surface-elevated" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/contact"
                className="block w-full text-center px-4 py-3 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold"
              >
                S'inscrire
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
