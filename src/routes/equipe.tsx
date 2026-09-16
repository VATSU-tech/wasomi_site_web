import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Twitter, Mail, AlertCircle, Users } from "lucide-react";
import { useStaffQuery } from "@/hooks/useWasomiApi";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Équipe — CS Wasomi" },
      {
        name: "description",
        content:
          "Rencontrez les enseignants et éducateurs qui font la richesse du Complexe Scolaire Wasomi.",
      },
      { property: "og:title", content: "Équipe — CS Wasomi" },
      { property: "og:description", content: "L'équipe Wasomi." },
      { property: "og:image", content: "/gallerie/IMG-20260519-WA0021.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://wasomi.cd/equipe" },
    ],
  }),
  component: EquipePage,
});

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e2e8f0' stroke='%2394a3b8' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%23f1f5f9'/%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

function EquipePage() {
  const { data: staff, isLoading, isError, error } = useStaffQuery();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl py-14 text-center">
          <span className="badge-soft">Ceux qui font l'école</span>
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-5"
            data-aos="fade-up"
          >
            Notre <span className="text-primary">équipe pédagogique</span>
          </h1>
          <p
            className="mt-5 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Des enseignants passionnés, des éducateurs attentifs, une équipe
            engagée auprès de chaque enfant.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 max-w-7xl">
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-3xl bg-surface animate-pulse border border-border" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center gap-3 mb-6">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              Impossible de charger l'équipe depuis le serveur : {error?.message}
            </p>
          </div>
        )}

        {!isLoading && (!staff || staff.length === 0) && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun membre d'équipe trouvé pour le moment.</p>
          </div>
        )}

        {!isLoading && staff && staff.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member, i) => (
              <article
                key={member.id}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 80}
                className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={member.avatar || DEFAULT_AVATAR}
                    alt={`Photo de ${member.name}, ${member.role}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                  {member.department && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground shadow">
                      {member.department}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-semibold mt-1">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mt-2 max-h-none opacity-100 sm:max-h-0 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:max-h-24 transition-all duration-500 overflow-hidden line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4 opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
                      {member.social_links?.linkedin && (
                        <a
                          href={member.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn de ${member.name}`}
                          className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                        >
                          <Linkedin className="size-4" />
                        </a>
                      )}
                      {(member.social_links?.twitter || member.social_links?.facebook) && (
                        <a
                          href={member.social_links?.twitter || member.social_links?.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Réseau de ${member.name}`}
                          className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                        >
                          <Twitter className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <div className="rounded-[2rem] bg-surface border border-border p-8 md:p-12 text-center">
          <Users className="size-10 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Envie de rejoindre cette équipe ?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-7">
            Nous cherchons des passionnés pour accompagner nos élèves.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Mail className="size-4" />
            Nous écrire
          </Link>
        </div>
      </section>
    </>
  );
}