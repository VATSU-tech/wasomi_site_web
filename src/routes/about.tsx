import { createFileRoute } from "@tanstack/react-router";
import { Target, Heart, Lightbulb, Award } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Wasomi" },
      { name: "description", content: "Notre histoire, notre mission, nos valeurs : découvrez ce qui fait Wasomi." },
      { property: "og:title", content: "À propos — Wasomi" },
      { property: "og:description", content: "Notre histoire et notre mission." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-4xl relative text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight" data-aos="fade-up">
            À propos de <span className="text-gradient">Wasomi</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            Fondée en 2021, Wasomi est née d'une conviction simple : chaque étudiant
            mérite une éducation qui révèle son potentiel unique. Aujourd'hui, c'est
            plusieurs étudiants formés chez nous.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div data-aos="fade-right">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-glow">
              <img src="/gallerie/realisation.jpg" alt="" className="size-full object-cover" />
            </div>
          </div>
          <div data-aos="fade-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Notre mission</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
              Former les talents qui changeront le monde
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nous croyons en une pédagogie où l'humain est au centre. Chaque étudiant
              est accompagné individuellement par un mentor, et nos programmes sont
              conçus avec les entreprises pour garantir une employabilité maximale.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Notre objectif : faire éclore des leaders éthiques, créatifs et
              compétents, capables d'apporter des solutions aux défis de demain.
            </p>
          </div>
        </div>

        <SectionHeading eyebrow="Nos valeurs" title="Ce qui nous anime" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Target, title: "Excellence", desc: "Viser le meilleur dans chaque détail." },
            { icon: Heart, title: "Bienveillance", desc: "Un environnement sûr et inclusif." },
            { icon: Lightbulb, title: "Innovation", desc: "Toujours apprendre, toujours évoluer." },
            { icon: Award, title: "Engagement", desc: "Tenir nos promesses, jusqu'au bout." },
          ].map((v, i) => (
            <div
              key={v.title}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="p-6 rounded-2xl glass text-center hover:shadow-glow transition-spring hover:-translate-y-1"
            >
              <div className="size-14 mx-auto rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                <v.icon className="size-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
