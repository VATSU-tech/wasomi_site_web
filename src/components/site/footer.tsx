import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Clock,
  ArrowRight,
} from "lucide-react";
import { usePublicSettingsQuery } from "@/hooks/useWasomiApi";

export function Footer() {
  const { data: settings } = usePublicSettingsQuery();

  const phone = settings?.phone ?? "+243 997 742 651";
  const email = settings?.email ?? "cswasomi@gmail.com";
  const address =
    settings?.address ?? "5 Rue Sivirwa Q. Résidentiel, C. Bungulu, Beni";
  const hours = "Lun. – Jeu. : 07h00 – 15h00 · Ven. : 07h00 – 13h00";

  const navigation = [
    { to: "/formations" as const, label: "Nos cycles" },
    { to: "/galerie" as const, label: "Galerie" },
    { to: "/equipe" as const, label: "Équipe" },
    { to: "/blog" as const, label: "Actualités" },
    { to: "/about" as const, label: "À propos" },
  ];

  const quickAccess = [
    {
      to: "/contact" as const,
      search: { tab: "contact" as const },
      label: "Contact",
    },
    {
      to: "/contact" as const,
      search: { tab: "admission" as const },
      label: "Préinscription",
    },
    { to: "/formations" as const, label: "Frais scolaires" },
    { to: "/app/login" as const, label: "Espace famille" },
  ];

  return (
    <footer className="relative mt-24 border-t border-border bg-surface">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="./icon-cercle.png"
                  className="h-10"
                  alt="icon de l'ecode"
                />
              </div>
              <span className="font-display font-bold text-lg">
                {settings?.app_name ?? "CS Wasomi"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complexe scolaire à Beni, de la crèche à la 8ème année. Une
              école de proximité qui accompagne chaque enfant avec exigence et
              bienveillance.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: settings?.social_links?.facebook ?? "#", label: "Facebook" },
                { icon: Instagram, href: settings?.social_links?.instagram ?? "#", label: "Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold mb-5">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              {navigation.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
                  >
                    <ArrowRight className="size-3 text-primary/60" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accès rapides */}
          <div>
            <h3 className="font-display font-semibold mb-5">Accès rapides</h3>
            <ul className="space-y-2.5 text-sm">
              {quickAccess.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    search={l.search}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
                  >
                    <ArrowRight className="size-3 text-primary/60" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-5">Contact</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 mt-0.5 text-primary shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="size-4 mt-0.5 text-primary shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="size-4 mt-0.5 text-primary shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-foreground transition-colors break-all"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="size-4 mt-0.5 text-primary shrink-0" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings?.app_name ?? "CS Wasomi"}. Tous droits réservés.
          </p>
          <p className="flex items-center gap-1.5">
            VATSU-tech
          </p>
        </div>
      </div>
    </footer>
  );
}