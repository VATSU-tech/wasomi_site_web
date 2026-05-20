import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-surface">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-primary rounded-lg p-2">
                <GraduationCap className="size-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">Wasomi</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Une école d'excellence qui forme les talents de demain à travers
              des programmes innovants et un accompagnement personnalisé.
            </p>
            <div className="flex gap-2">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="size-9 rounded-lg glass flex items-center justify-center hover:shadow-glow hover:-translate-y-0.5 transition-smooth"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/formations", label: "Formations" },
                { to: "/galerie", label: "Galerie" },
                { to: "/equipe", label: "Équipe" },
                { to: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 text-primary shrink-0" />
                <span>123 Rue Sivirwa, Q.redidenciel C.Bungulu V.beni</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary shrink-0" />
                <span>+243 000 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary shrink-0" />
                <span>contact@wasomi.school</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Recevez nos actualités et événements.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-3 py-2 rounded-lg bg-surface-elevated border border-border text-sm focus:border-primary focus:outline-none transition-smooth"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:shadow-glow transition-smooth"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Wasomi. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-smooth">
              Mentions légales
            </a>
            <a href="#" className="hover:text-foreground transition-smooth">
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
