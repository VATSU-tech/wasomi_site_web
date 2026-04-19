import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users, BookOpen, Trophy, Rocket, GraduationCap, Star } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Gallery } from "@/components/site/gallery";
import { galleryItems, galleryCategories } from "@/data/gallery";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wasomi — École d'excellence pour les talents de demain" },
      { name: "description", content: "Découvrez Wasomi : programmes innovants, équipe d'experts et accompagnement personnalisé pour révéler votre potentiel." },
      { property: "og:title", content: "Wasomi — École d'excellence" },
      { property: "og:description", content: "Forme les talents de demain." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute top-1/4 -left-32 size-96 rounded-full bg-primary/20 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 size-96 rounded-full bg-accent/20 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="container mx-auto px-4 max-w-7xl relative py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold tracking-widest uppercase text-primary mb-6"
                data-aos="fade-down"
              >
                <Sparkles className="size-3.5" />
                Rentrée 2025 — inscriptions ouvertes
              </span>
              <h1
                className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
                data-aos="fade-up"
              >
                L'école qui révèle{" "}
                <span className="text-gradient animate-gradient-shift">les talents</span>{" "}
                de demain.
              </h1>
              <p
                className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Wasomi propose des formations innovantes, un encadrement de pointe
                et un environnement immersif pour transformer la curiosité en expertise.
              </p>
              <div
                className="mt-8 flex flex-wrap gap-3"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <Link
                  to="/formations"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-spring"
                >
                  Découvrir nos formations
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-smooth" />
                </Link>
                <Link
                  to="/galerie"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass font-semibold hover:shadow-glow transition-spring"
                >
                  Visiter le campus
                </Link>
              </div>

              <div
                className="mt-12 grid grid-cols-3 gap-6 max-w-md"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                {[
                  { v: "1500+", l: "Étudiants" },
                  { v: "98%", l: "Insertion" },
                  { v: "25+", l: "Formations" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl font-bold text-gradient">{s.v}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative" data-aos="fade-left" data-aos-delay="200">
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-2xl opacity-30 animate-glow-pulse" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-elegant animate-float">
                    <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80" alt="" className="size-full object-cover" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant animate-float" style={{ animationDelay: "1.5s" }}>
                    <img src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80" alt="" className="size-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant animate-float" style={{ animationDelay: "0.7s" }}>
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" alt="" className="size-full object-cover" />
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-elegant animate-float" style={{ animationDelay: "2.2s" }}>
                    <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80" alt="" className="size-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 container mx-auto px-4 max-w-7xl">
        <SectionHeading
          eyebrow="Pourquoi Wasomi"
          title="Une expérience d'apprentissage repensée"
          description="Tout ce qu'il faut pour libérer le potentiel de chaque étudiant."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: "Programmes innovants", desc: "Cursus actualisés en continu avec les pros du secteur." },
            { icon: Users, title: "Encadrement humain", desc: "Un mentor dédié pour chaque parcours étudiant." },
            { icon: Rocket, title: "Projets concrets", desc: "Apprendre par la pratique sur des cas réels." },
            { icon: Trophy, title: "Excellence reconnue", desc: "Diplôme certifié et alumni partout dans le monde." },
          ].map((f, i) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="group relative p-6 rounded-2xl glass hover:shadow-glow transition-spring hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-smooth" />
              <div className="relative">
                <div className="size-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4 group-hover:scale-110 transition-spring">
                  <f.icon className="size-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 container mx-auto px-4 max-w-7xl">
        <SectionHeading
          eyebrow="En images"
          title="La vie au campus Wasomi"
          description="Découvrez nos espaces, nos événements et les réalisations de nos étudiants."
        />
        <Gallery items={galleryItems.slice(0, 6)} categories={galleryCategories} />
        <div className="mt-12 text-center" data-aos="fade-up">
          <Link
            to="/galerie"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass font-semibold hover:shadow-glow transition-spring"
          >
            Voir toute la galerie
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeading
            eyebrow="Témoignages"
            title="Ils ont fait Wasomi"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Aline K.", role: "Promo 2023 — Designer", text: "L'accompagnement est exceptionnel. J'ai trouvé un poste avant même la fin de mon cursus." },
              { name: "Joseph M.", role: "Promo 2022 — Dev Full-Stack", text: "Les projets concrets m'ont préparé au monde réel mieux que n'importe quel cours théorique." },
              { name: "Sarah L.", role: "Promo 2024 — Data Scientist", text: "Une communauté soudée, des profs passionnés. Une vraie famille." },
            ].map((t, i) => (
              <div
                key={t.name}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-6 rounded-2xl glass hover:shadow-elegant transition-spring"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 container mx-auto px-4 max-w-7xl">
        <div
          className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center bg-gradient-primary shadow-glow"
          data-aos="zoom-in"
        >
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative">
            <GraduationCap className="size-12 mx-auto text-primary-foreground mb-6" />
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
              Prêt à rejoindre l'aventure ?
            </h2>
            <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">
              Candidatez en quelques minutes et donnez un nouvel élan à votre avenir.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-background text-foreground font-semibold shadow-elegant hover:-translate-y-1 transition-spring"
            >
              Candidater maintenant
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
