import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Wasomi" },
      {
        name: "description",
        content:
          "Actualités, conseils et histoires inspirantes de la communauté Wasomi.",
      },
      { property: "og:title", content: "Blog — Wasomi" },
      { property: "og:description", content: "Actualités et conseils." },
    ],
  }),
  component: BlogPage,
});

const posts = [
  {
    title: "Rentrée 2025 : ce qui change",
    date: "12 Septembre 2025",
    category: "Actualités",
    excerpt: "Nouveaux programmes, nouveaux espaces, nouvelle énergie.",
    img: "/gallerie/IMG-20260519-WA0002.jpg",
  },
  {
    title: "5 conseils pour réussir ses examens scolaire",
    date: "28 mars 2025",
    category: "Conseils",
    excerpt: "Méthode, outils, état d'esprit : nos meilleures pratiques.",
    img: "/gallerie/IMG-20260519-WA0021.jpg",
  },
  {
    title: "Independance: lipanda fiesta chez wasomi",
    date: "30 juin 2025",
    category: "Événement",
    excerpt:
      "Competition, Jeux, Culture, a l'occasion de la fete d'indépendance.",
    img: "/gallerie/festival lipanda fiesta.jpg",
  },
  {
    title: "Labo science : inauguration de notre nouvel espace",
    date: "2 mars 2025",
    category: "Événement",
    excerpt:
      "inauguration de notre nouvel espace de laboratoire scientifique équipé des dernières technologies pour les expériences pratiques.",
    img: "/gallerie/IMG-20260519-WA0067.jpg",
  },
  {
    title: "Visite a l'aeroport de mavivi : une experience inoubliable",
    date: "20 fév. 2025",
    category: "Visite",
    excerpt:
      "Nos élèves ont eu la chance de visiter l'aéroport de Mavivi, découvrant les coulisses de l'aviation et les métiers passionnants du secteur.",
    img: "/gallerie/sortie visite aeroport mavivi.jpg",
  },
  {
    title: "Colonie de vacances : s'amuser et apprendre pendant les vacances",
    date: "10 Aout 2025",
    category: "Vaccances",
    excerpt:
      "Notre colonie de vacances offre une expérience enrichissante où les enfants peuvent s'amuser tout en développant de nouvelles compétences à travers des activités ludiques et éducatives.",
    img: "gallerie/colonie de vaccances.jpg",
  },
];

function BlogPage() {
  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Le <span className="text-gradient">blog</span>
          </h1>
          <p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Actualités, conseils et histoires de notre communauté.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article
              key={p.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 80}
              className="group rounded-2xl overflow-hidden bg-card shadow-elegant hover:shadow-glow transition-spring hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="size-full object-cover transition-spring group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-semibold text-foreground">
                  {p.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="size-3.5" />
                  {p.date}
                </div>
                <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-smooth">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {p.excerpt}
                </p>
                {/* <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-smooth"
                >
                  Lire l'article <ArrowRight className="size-4" />
                </Link> */}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
