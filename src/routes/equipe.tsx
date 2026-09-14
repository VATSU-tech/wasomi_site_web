import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Twitter, Mail, MessageCircleCheck, AlertCircle } from "lucide-react";
import { useStaffQuery } from "@/hooks/useWasomiApi";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Équipe — Wasomi" },
      {
        name: "description",
        content:
          "Rencontrez les enseignants, mentors et experts qui font la richesse de Wasomi.",
      },
      { property: "og:title", content: "Équipe — Wasomi" },
      { property: "og:description", content: "L'équipe Wasomi." },
    ],
  }),
  component: EquipePage,
});

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e2e8f0' stroke='%2394a3b8' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%23f1f5f9'/%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

function EquipePage() {
  const { data: staff, isLoading, isError, error } = useStaffQuery();

  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Notre <span className="text-gradient">équipe</span>
          </h1>
          <p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Des enseignants passionnés, des mentors expérimentés, une communauté
            engagée.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-surface-elevated animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center gap-3 mb-6">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              Impossible de charger l’équipe depuis le serveur : {error?.message}
            </p>
          </div>
        )}

        {!isLoading && (!staff || staff.length === 0) && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun membre d’équipe trouvé pour le moment.</p>
          </div>
        )}

        {!isLoading && staff && staff.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member, i) => (
              <article
                key={member.id}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 80}
                className="group relative rounded-2xl overflow-hidden bg-card shadow-elegant hover:shadow-glow transition-spring hover:-translate-y-2"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={member.avatar || DEFAULT_AVATAR}
                    alt={member.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    className="size-full object-cover transition-spring group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-xl font-bold">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold mt-1">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all duration-500 line-clamp-3">
                      {member.bio}
                    </p>
                    <div className="flex gap-2 mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-spring">
                      {[
                        {
                          icon: MessageCircleCheck,
                          href: member.social_links?.linkedin || "#",
                          label: `LinkedIn de ${member.name}`,
                        },
                        {
                          icon: Twitter,
                          href: member.social_links?.twitter || member.social_links?.facebook || "#",
                          label: `Réseau de ${member.name}`,
                        },
                        {
                          icon: Mail,
                          href: "#",
                          label: `Email de ${member.name}`,
                        },
                      ].map(({ icon: Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          className="size-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                        >
                          <Icon className="size-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
