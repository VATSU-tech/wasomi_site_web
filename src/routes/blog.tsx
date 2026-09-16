import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, AlertCircle, ArrowRight } from "lucide-react";
import { usePostsQuery } from "@/hooks/useWasomiApi";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Actualités — CS Wasomi" },
      {
        name: "description",
        content:
          "Actualités, événements et moments de vie de la communauté du Complexe Scolaire Wasomi.",
      },
      { property: "og:title", content: "Blog — CS Wasomi" },
      { property: "og:description", content: "Actualités et conseils." },
      { property: "og:image", content: "/gallerie/IMG-20260519-WA0002.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://wasomi.cd/blog" },
    ],
  }),
  component: BlogPage,
});

const fallbackPosts = [
  {
    id: "1",
    title: "Rentrée 2026 : ce qui change cette année",
    date: "12 Septembre 2026",
    category: "Actualités",
    excerpt:
      "Nouveaux aménagements, nouvelle dynamique : bienvenue à tous pour une belle année scolaire.",
    img: "/gallerie/IMG-20260519-WA0002.jpg",
  },
  {
    id: "2",
    title: "5 conseils pour réussir son année scolaire",
    date: "28 Mars 2026",
    category: "Conseils",
    excerpt:
      "Méthode, organisation et état d'esprit : nos meilleures pratiques.",
    img: "/gallerie/IMG-20260519-WA0021.jpg",
  },
  {
    id: "3",
    title: "Lipanda Fiesta : la fête de l'indépendance chez Wasomi",
    date: "30 Juin 2026",
    category: "Événement",
    excerpt:
      "Compétitions, jeux et culture : un moment fort qui rassemble toute l'école.",
    img: "/gallerie/festival lipanda fiesta.jpg",
  },
  {
    id: "4",
    title: "Notre laboratoire de sciences, un espace pour expérimenter",
    date: "2 Mars 2026",
    category: "Événement",
    excerpt:
      "Un espace équipé pour permettre aux élèves des expériences pratiques dès le primaire.",
    img: "/gallerie/IMG-20260519-WA0067.jpg",
  },
  {
    id: "5",
    title: "Visite à l'aéroport de Mavivi : une expérience inoubliable",
    date: "20 Février 2026",
    category: "Visite",
    excerpt:
      "Nos élèves ont découvert les coulisses de l'aviation et les métiers du secteur.",
    img: "/gallerie/sortie visite aeroport mavivi.jpg",
  },
  {
    id: "6",
    title: "Colonie de vacances : s'amuser et apprendre",
    date: "10 Août 2026",
    category: "Vacances",
    excerpt:
      "Une expérience enrichissante où les enfants s'amusent tout en développant de nouvelles compétences.",
    img: "/gallerie/colonie de vaccances.jpg",
  },
];

function BlogPage() {
  const { data, isLoading, isError, error } = usePostsQuery();

  const posts = data?.items && data.items.length > 0
    ? data.items.map((p) => ({
        id: String(p.id),
        title: p.title,
        date: p.published_at ? new Date(p.published_at).toLocaleDateString('fr-FR', { day: "numeric", month: "long", year: "numeric" }) : "Date récente",
        category: p.category || "Actualités",
        excerpt: p.summary || p.content?.slice(0, 140) || "",
        img: p.cover_image || "/gallerie/IMG-20260519-WA0002.jpg",
      }))
    : fallbackPosts;

  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl py-14 text-center">
          <span className="badge-soft">La vie de l'école</span>
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-5"
            data-aos="fade-up"
          >
            Le <span className="text-primary">journal</span> de Wasomi
          </h1>
          <p
            className="mt-5 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Actualités, événements et moments forts de notre communauté scolaire.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 max-w-7xl">
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-surface animate-pulse border border-border" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center gap-3 mb-6">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              Impossible de charger les articles du blog : {error?.message}
            </p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <>
            {/* Featured post */}
            {featured && (
              <article
                data-aos="fade-up"
                className="group relative rounded-[2rem] overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 mb-14"
              >
                <div className="grid lg:grid-cols-2">
                  <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img
                      src={featured.img}
                      alt={featured.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground shadow">
                      À la une
                    </span>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="size-3.5 text-primary" />
                      {featured.date}
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wide">
                        {featured.category}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug mb-4 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-7">
                      {featured.excerpt}
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 font-semibold text-primary link-underline self-start"
                    >
                      En savoir plus
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Rest of posts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p, i) => (
                <article
                  key={p.id || p.title}
                  data-aos="fade-up"
                  data-aos-delay={(i % 3) * 80}
                  className="group rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground shadow">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="size-3.5" />
                      {p.date}
                    </div>
                    <h3 className="font-display text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {p.excerpt}
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary link-underline"
                    >
                      Lire la suite
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun article disponible pour le moment.</p>
          </div>
        )}
      </section>
    </>
  );
}