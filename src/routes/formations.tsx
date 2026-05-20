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
    icon: Code2,
    title: "Domotique",
    duration: "4 ans",
    students: "20+",
    desc: "Maîtrisez la domotique, et automatiser vos maison",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Palette,
    title: "Art plastique",
    duration: "2 ans",
    students: "30+",
    desc: "Concevez des produits désirables et attrayant de vos mains.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Gerer vos economie",
    duration: "3 ans",
    students: "60+",
    desc: "Apprenez a bien gerer vos economie, et diminuer vos depense.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "Informatique embarqué",
    duration: "2 ans",
    students: "45+",
    desc: "Programmer des micro controlleur, et automatiser des taches.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Megaphone,
    title: "Ecole de l'eloquance",
    duration: "3 ans",
    students: "100+",
    desc: "Apprenner a manier la langue de moliere comme un pro.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Briefcase,
    title: "Entrepreneuriat",
    duration: "1 an",
    students: "55+",
    desc: "De l'idée au marché : business model, levée de fonds, scale.",
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
