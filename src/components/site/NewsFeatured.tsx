import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, X, Mail } from "lucide-react";
import { usePostsQuery } from "@/hooks/useWasomiApi";
import type { Post } from "@/types/domain";
import { cn } from "@/lib/utils";

const fallbackPosts = [
  {
    id: "1",
    title: "Rentrée 2026 : ce qui change cette année",
    slug: "rentree-2026",
    summary:
      "Nouveaux aménagements, nouvelle dynamique : bienvenue à tous pour une belle année.",
    content:
      "Nouveaux aménagements, nouvelle dynamique : bienvenue à tous pour une belle année scolaire au Complexe Scolaire Wasomi.",
    category: "Actualités",
    cover_image: "/gallerie/IMG-20260519-WA0002.jpg",
    published_at: "2026-09-12",
  },
  {
    id: "2",
    title: "Lipanda Fiesta : la fête de l'indépendance chez Wasomi",
    slug: "lipanda-fiesta",
    summary: "Jeux, culture et compétitions : un moment fort qui rassemble toute la communauté scolaire.",
    content: "Jeux, culture et compétitions : un moment fort qui rassemble toute la communauté scolaire.",
    category: "Événement",
    cover_image: "/gallerie/festival lipanda fiesta.jpg",
    published_at: "2026-06-30",
  },
  {
    id: "3",
    title: "Sortie à l'aéroport de Mavivi",
    slug: "sortie-mavivi",
    summary: "Nos élèves ont découvert l'aviation de près lors d'une sortie pédagogique unique.",
    content: "Nos élèves ont découvert l'aviation de près lors d'une sortie pédagogique unique.",
    category: "Visite",
    cover_image: "/gallerie/sortie visite aeroport mavivi.jpg",
    published_at: "2026-02-20",
  },
] as Post[];

function formatDate(iso?: string) {
  if (!iso) return "Article récent";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsFeatured() {
  const { data } = usePostsQuery({ limit: 6 });
  const posts =
    data?.items && data.items.length > 0 ? data.items : fallbackPosts;
  const [featured, ...rest] = posts;
  const others = rest.slice(0, 3);
  const [selected, setSelected] = useState<Post | null>(null);

  if (!featured) return null;

  return (
    <>
      <section className="py-14 sm:py-20 container mx-auto px-4 max-w-7xl">
        <article
          className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl"
          data-aos="fade-up"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[16/11] lg:aspect-auto lg:min-h-[420px]">
              <img
                src={featured.cover_image || "/gallerie/IMG-20260519-WA0002.jpg"}
                alt={featured.title}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-card/95 text-xs font-semibold shadow">
                {featured.category || "À la une"}
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Calendar className="size-3.5" />
                {formatDate(featured.published_at || featured.created_at)}
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {featured.title}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                {featured.summary || featured.content?.slice(0, 220)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(featured)}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Afficher plus
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border font-semibold hover:border-primary/40 hover:bg-surface transition-all"
                >
                  Voir le blog
                </Link>
              </div>
            </div>
          </div>
        </article>

        {others.length > 0 && (
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {others.map((p, i) => (
              <button
                key={String(p.id)}
                type="button"
                onClick={() => setSelected(p)}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group text-left rounded-3xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.cover_image || "/gallerie/IMG-20260519-WA0002.jpg"}
                    alt={p.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold shadow">
                    {p.category || "Actualités"}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="size-3.5" />
                    {formatDate(p.published_at || p.created_at)}
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-2">
                    {p.summary || p.content?.slice(0, 120)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Afficher plus
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
          onClick={() => setSelected(null)}
        >
          <div
            className={cn(
              "bg-card w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl border border-border shadow-2xl overflow-hidden",
              "max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] shrink-0">
              <img
                src={selected.cover_image || "/gallerie/IMG-20260519-WA0002.jpg"}
                alt=""
                className="size-full object-cover"
              />
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 size-10 rounded-xl bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  {selected.category || "Actualités"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatDate(selected.published_at || selected.created_at)}
                </span>
                {selected.reading_time && <span>{selected.reading_time}</span>}
                {selected.author?.name && (
                  <span>Par {selected.author.name}</span>
                )}
              </div>
              <h3
                id="news-modal-title"
                className="font-display text-2xl md:text-3xl font-bold leading-tight"
              >
                {selected.title}
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {selected.content || selected.summary}
              </div>
              <div className="pt-4 border-t border-border flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  search={{ tab: "contact" }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-lg"
                  onClick={() => setSelected(null)}
                >
                  <Mail className="size-4" />
                  Nous contacter à ce sujet
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold"
                  onClick={() => setSelected(null)}
                >
                  Plus d'actualités
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
