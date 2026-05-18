import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryItem } from "@/data/gallery";

interface Props {
  items: GalleryItem[];
  categories: string[];
}

export function Gallery({ items, categories }: Props) {
  const [filter, setFilter] = useState<string>("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === "Tous" ? items : items.filter((i) => i.category === filter);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length],
  );
  const prev = useCallback(
    () =>
      setLightbox((i) =>
        i === null ? null : (i - 1 + filtered.length) % filtered.length,
      ),
    [filtered.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, next, prev]);

  return (
    <div>
      {/* Filters */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 mb-10"
        data-aos="fade-up"
      >
        {["Tous", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-spring",
              filter === cat
                ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                : "glass text-muted-foreground hover:text-foreground hover:scale-105",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <article
            key={item.id}
            data-aos="fade-up"
            data-aos-delay={(idx % 6) * 60}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-card cursor-pointer shadow-elegant",
              "transition-spring hover:-translate-y-2",
              item.featured && "sm:col-span-2 lg:col-span-2 lg:row-span-2",
            )}
            onClick={() => setLightbox(idx)}
          >
            <div className={cn("relative overflow-hidden", item.featured ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-[4/3]")}>
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="size-full object-cover transition-spring group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-70 group-hover:opacity-100 transition-smooth" />
              {/* Glow ring on hover */}
              <div className="absolute inset-0 ring-2 ring-inset ring-primary/0 group-hover:ring-primary/60 transition-smooth rounded-2xl" />

              {/* Top actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-spring">
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  aria-label="Aimer"
                  className="gap-1 px-1 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  <Heart className="size-4" /> <span >{item.likes !== undefined ? item.likes : 0}</span>
                </button>
                {/* <button
                  onClick={(e) => { e.stopPropagation(); }}
                  aria-label="Aimer"
                  className="gap-1 px-1 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  <Heart className="size-4" /> <span >{item.comment !== undefined ? item.comment : 0}</span>
                </button> */}
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  aria-label="Partager"
                  className="size-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  <Share2 className="size-4" />
                </button>
              </div>

              {/* Category badge */}
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-semibold text-foreground">
                {item.category}
              </span>

              {/* Bottom info */}
              <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-spring">
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-smooth delay-75">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-spring">
                  <Maximize2 className="size-3.5" />
                  Voir en grand
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={filtered[lightbox].title}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={close}
        >
          <button
            aria-label="Fermer"
            onClick={close}
            className="absolute top-4 right-4 size-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth z-10"
          >
            <X className="size-5" />
          </button>
          <button
            aria-label="Précédent"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 size-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth z-10"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            aria-label="Suivant"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 size-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth z-10"
          >
            <ChevronRight className="size-5" />
          </button>

          <div
            className="max-w-6xl w-full max-h-[85vh] flex flex-col gap-4 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-glow flex-1 min-h-0">
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="size-full object-contain bg-surface"
              />
            </div>
            <div className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  {filtered[lightbox].category}
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold mt-1">
                  {filtered[lightbox].title}
                </h3>
                {filtered[lightbox].description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {filtered[lightbox].description}
                  </p>
                )}
              </div>
              <div className="text-xs text-muted-foreground shrink-0">
                {lightbox + 1} / {filtered.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
