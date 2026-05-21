import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code2,
  Palette,
  BarChart3,
  Cpu,
  Megaphone,
  Briefcase,
  ArrowRight,
  Clock,
  Users,
  Baby,
  Blocks,
  BookOpen,
  GraduationCap,
  Microscope,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/formations")({
  head: () => ({
    meta: [
      { title: "Formations — Wasomi" },
      {
        name: "description",
        content:
          "Découvrez les formations Wasomi : développement web, design, data, marketing et plus encore.",
      },
      { property: "og:title", content: "Formations — Wasomi" },
      {
        property: "og:description",
        content: "Programmes innovants pour révéler votre talent.",
      },
    ],
  }),
  component: FormationsPage,
});

const formations = [
  {
    icon: Baby,
    image: "/gallerie/IMG-20260519-WA0016.jpg",
    title: "Creche",
    duration: "4 ans",
    students: "10+",
    desc: "Des enseignants passionnés pour accompagner vos enfants dans leur développement global.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Blocks,
    image: "/gallerie/formation_maternelle.jpg",
    title: "Maternelle",
    duration: "3 ans",
    students: "20+",
    desc: "Un environnement stimulant pour favoriser l'éveil et la créativité de vos enfants.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: BookOpen,
    image: "/gallerie/IMG-20260519-WA0021.jpg",
    title: "Primaire",
    duration: "6 ans",
    students: "60+",
    desc: "Un enseignement de qualité pour construire les bases solides de l'apprentissage de vos enfants.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: GraduationCap,
    image: "/gallerie/realisation.jpg",
    title: "Education de base",
    duration: "2 ans",
    students: "35+",
    desc: "Un programme complet pour renforcer les compétences fondamentales et préparer les élèves à l'avenir.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Code2,
    image: "/gallerie/labo_3.jpg",
    title: "Bases de la domotique",
    duration: "2 ans",
    students: "20+",
    desc: "Apprenez à automatiser votre maison avec les dernières technologies de domotique.",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Microscope,
    image: "/gallerie/IMG-20260519-WA0068.jpg",
    title: "Bases de la chimie",
    duration: "2 ans",
    students: "20+",
    desc: "Explorez les merveilles de la chimie à travers des expériences pratiques et des concepts fondamentaux.",
    color: "from-amber-500 to-yellow-500",
  },
];

function FormationsPage() {
  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Nos <span className="text-gradient">formations</span>
          </h1>
          <p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Des cursus pensés pour les métiers d'aujourd'hui et de demain.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f, i) => (
            <article
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 80}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-elegant transition-spring hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="relative h-[420px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-spring group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${f.image})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
                <div
                  className={`absolute -right-20 -top-20 size-52 rounded-full bg-gradient-to-br ${f.color} opacity-20 blur-3xl transition-smooth group-hover:opacity-40`}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                  <div
                    className={`mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-glow transition-spring group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <f.icon className="size-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {f.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {f.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" />
                      {f.students}
                    </span>
                  </div>
                  <Link
                    to="/contact"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-3"
                  >
                    En savoir plus
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
