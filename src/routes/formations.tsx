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
    title: "Creche",
    duration: "4 ans",
    students: "10+",
    desc: "Des enseignants passionnés pour accompagner vos enfants dans leur développement global.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Blocks,
    title: "Maternelle",
    duration: "3 ans",
    students: "20+",
    desc: "Un environnement stimulant pour favoriser l'éveil et la créativité de vos enfants.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: BookOpen,
    title: "Primaire",
    duration: "6 ans",
    students: "60+",
    desc: "Un enseignement de qualité pour construire les bases solides de l'apprentissage de vos enfants.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: GraduationCap,
    title: "Education de base",
    duration: "2 ans",
    students: "35+",
    desc: "Un programme complet pour renforcer les compétences fondamentales et préparer les élèves à l'avenir.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Code2,
    title: "Bases de la domotique",
    duration: "2 ans",
    students: "20+",
    desc: "Apprenez à automatiser votre maison avec les dernières technologies de domotique.",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Microscope,
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
              className="group relative p-6 rounded-2xl glass hover:shadow-glow transition-smooth hover:-translate-y-2 overflow-hidden"
            >
              <div
                className={`absolute -top-20 -right-20 size-48 rounded-full bg-gradient-to-br ${f.color} opacity-20 group-hover:opacity-40 blur-2xl transition-smooth`}
              />
              <div className="relative transition-smooth">
                <div
                  className={`size-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-glow mb-5 group-hover:scale-110 group-hover:rotate-3 transition-spring`}
                >
                  <f.icon className="size-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {f.desc}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
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
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-smooth"
                >
                  En savoir plus <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
