import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, AlertCircle, ArrowRight } from "lucide-react";
import { usePostsQuery } from "@/hooks/useWasomiApi";
import { PostDetailModal } from "@/components/site/PostDetailModal";
import type { Post } from "@/types/domain";

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

const fallbackPosts: Post[] = [
  {
    id: "1",
    title: "Rentrée 2026 : ce qui change cette année",
    slug: "rentree-2026",
    summary:
      "Nouveaux aménagements, nouvelle dynamique : bienvenue à tous pour une belle année scolaire.",
    content:
      "Nouveaux aménagements, nouvelle dynamique : bienvenue à tous pour une belle année scolaire.\n\nCette rentrée marque plusieurs nouveautés au Complexe Scolaire Wasomi : espaces rénovés, ateliers renforcés et une communication encore plus fluide avec les familles.",
    category: "Actualités",
    cover_image: "/gallerie/IMG-20260519-WA0002.jpg",
    published_at: "2026-09-12",
    reading_time: "3 min",
  },
  {
    id: "2",
    title: "5 conseils pour réussir son année scolaire",
    slug: "conseils-reussite",
    summary: "Méthode, organisation et état d'esprit : nos meilleures pratiques.",
    content:
      "Méthode, organisation et état d'esprit : nos meilleures pratiques pour accompagner chaque enfant vers la réussite.\n\n1. Un rythme de travail régulier\n2. Un espace calme pour les devoirs\n3. Un dialogue ouvert avec les enseignants\n4. Des pauses et du sommeil suffisants\n5. La célébration des petits progrès",
    category: "Conseils",
    cover_image: "/gallerie/IMG-20260519-WA0021.jpg",
    published_at: "2026-03-28",
    reading_time: "4 min",
  },
  {
    id: "3",
    title: "Lipanda Fiesta : la fête de l'indépendance chez Wasomi",
    slug: "lipanda-fiesta",
    summary:
      "Compétitions, jeux et culture : un moment fort qui rassemble toute l'école.",
    content:
      "Compétitions, jeux et culture : un moment fort qui rassemble toute l'école.\n\nLa Lipanda Fiesta célèbre l'indépendance dans la joie, avec des ateliers, des présentations et des activités sportives pour tous les cycles.",
    category: "Événement",
    cover_image: "/gallerie/festival lipanda fiesta.jpg",
    published_at: "2026-06-30",
    reading_time: "2 min",
  },
  {
    id: "4",
    title: "Notre laboratoire de sciences, un espace pour expérimenter",
    slug: "labo-sciences",
    summary:
      "Un espace équipé pour permettre aux élèves des expériences pratiques dès le primaire.",
    content:
      "Un espace équipé pour permettre aux élèves des expériences pratiques dès le primaire.\n\nChimie, observation et curiosité : le laboratoire Wasomi transforme les notions abstraites en découvertes concrètes.",
    category: "Événement",
    cover_image: "/gallerie/IMG-20260519-WA0067.jpg",
    published_at: "2026-03-02",
    reading_time: "3 min",
  },
  {
    id: "5",
    title: "Visite à l'aéroport de Mavivi : une expérience inoubliable",
    slug: "visite-mavivi",
    summary:
      "Nos élèves ont découvert les coulisses de l'aviation et les métiers du secteur.",
    content:
      "Nos élèves ont découvert les coulisses de l'aviation et les métiers du secteur lors d'une sortie pédagogique à l'aéroport de Mavivi.",
    category: "Visite",
    cover_image: "/gallerie/sortie visite aeroport mavivi.jpg",
    published_at: "2026-02-20",
    reading_time: "2 min",
  },
  {
    id: "6",
    title: "Colonie de vacances : s'amuser et apprendre",
    slug: "colonie-vacances",
    summary:
      "Une expérience enrichissante où les enfants s'amusent tout en développant de nouvelles compétences.",
    content:
      "Une expérience enrichissante où les enfants s'amusent tout en développant de nouvelles compétences, dans un cadre sécurisé et bienveillant.",
    category: "Vacances",
    cover_image: "/gallerie/colonie de vaccances.jpg",
    published_at: "2026-08-10",
    reading_time: "2 min",
  },
];

function formatDate(iso?: string) {
  if (!iso) return "Date récente";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BlogPage() {
  const { data, isLoading, isError, error } = usePostsQuery();
  const [selected, setSelected] = useState<Post | null>(null);

  const posts = useMemo(() => {
    if (data?.items && data.items.length > 0) return data.items;
    return fallbackPosts;
  }, [data]);

  const [featured, ...rest] = posts;

  return (
    <>
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
            {featured && (
              <article
                data-aos="fade-up"
                className="group relative rounded-[2rem] overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 mb-14"
              >
                <div className="grid lg:grid-cols-2">
                  <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img
                      src={featured.cover_image || "/gallerie/IMG-20260519-WA0002.jpg"}
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
                      {formatDate(featured.published_at || featured.created_at)}
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wide">
                        {featured.category || "Actualités"}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug mb-4 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-7">
                      {featured.summary || featured.content?.slice(0, 160)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelected(featured)}
                      className="inline-flex items-center gap-2 font-semibold text-primary link-underline self-start"
                    >
                      En savoir plus
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p, i) => (
                <article
                  key={String(p.id || p.slug || p.title)}
                  data-aos="fade-up"
                  data-aos-delay={(i % 3) * 80}
                  className="group rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:rotate-1 transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="block w-full text-left"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={p.cover_image || "/gallerie/IMG-20260519-WA0002.jpg"}
                        alt={p.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground shadow">
                        {p.category || "Actualités"}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Calendar className="size-3.5" />
                        {formatDate(p.published_at || p.created_at)}
                      </div>
                      <h3 className="font-display text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {p.summary || p.content?.slice(0, 120)}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary link-underline">
                        Lire la suite
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </button>
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

      <PostDetailModal
        post={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
