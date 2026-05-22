import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Heart,
  Share2,
  Download,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryItem } from "@/data/gallery";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  items: GalleryItem[];
  categories: string[];
}

export function Gallery({ items, categories }: Props) {
  const [filter, setFilter] = useState<string>("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [shareItem, setShareItem] = useState<GalleryItem | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const isMobile = useIsMobile();

  const filtered = useMemo(
    () => (filter === "Tous" ? items : items.filter((i) => i.category === filter)),
    [filter, items],
  );

  const close = useCallback(() => {
    setLightbox(null);
    setZoomed(false);
  }, []);
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length],
  );
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length],
  );

  useEffect(() => {
    if (lightbox === null && !shareItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        setShareItem(null);
      }
      if (lightbox === null) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyTouchAction = body.style.touchAction;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = "none";
    body.style.overscrollBehavior = "none";

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.touchAction = previousBodyTouchAction;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [lightbox, close, next, prev, shareItem]);

  const getShareUrl = (item: GalleryItem) => `${window.location.origin}${item.src}`;

  const onShare = async (item: GalleryItem) => {
    const shareUrl = getShareUrl(item);
    if (navigator.share && isMobile) {
      try {
        await navigator.share({ title: item.title, text: item.description, url: shareUrl });
        return;
      } catch {
        // fallback modal
      }
    }
    setShareItem(item);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10" data-aos="fade-up">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => {
          const isActive = activeCard === item.id;
          return (
            <article
              key={item.id}
              data-aos="fade-up"
              data-aos-delay={(idx % 6) * 60}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-card cursor-pointer shadow-elegant transition-spring hover:-translate-y-2",
                item.featured && "sm:col-span-2 lg:col-span-2 lg:row-span-2",
              )}
              onClick={() => {
                if (isMobile && activeCard !== item.id) {
                  setActiveCard(item.id);
                  return;
                }
                setLightbox(idx);
              }}
            >
              <div className={cn("relative overflow-hidden", item.featured ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-[4/3]")}>
                <img src={item.src} alt={item.title} loading="lazy" className="size-full object-cover transition-spring group-hover:scale-110" />
                <div className={cn("absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent transition-smooth", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")} />

                <div className={cn("absolute top-4 right-4 flex gap-2 transition-spring", isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0")}>
                  <button onClick={(e) => e.stopPropagation()} aria-label="Aimer" className="gap-1 px-2 py-1 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground">
                    <Heart className="size-4" /> <span>{item.likes ?? 0}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onShare(item); }} aria-label="Partager" className="size-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground">
                    <Share2 className="size-4" />
                  </button>
                </div>

                <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-semibold text-foreground">{item.category}</span>

                <div className={cn("absolute inset-x-0 bottom-0 p-5 transition-spring", isActive ? "translate-y-0" : "translate-y-2 group-hover:translate-y-0")}>
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{item.title}</h3>
                  {item.description && <p className={cn("mt-1 text-sm text-muted-foreground line-clamp-2 transition-smooth", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>{item.description}</p>}
                  <div className={cn("mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary transition-spring", isActive ? "opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")}>
                    <Maximize2 className="size-3.5" /> Voir en grand
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {lightbox !== null && filtered[lightbox] && (
        <div role="dialog" aria-modal="true" aria-label={filtered[lightbox].title} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={close}>
          <button aria-label="Fermer" onClick={close} className="absolute top-4 right-4 size-12 rounded-full glass flex items-center justify-center z-10"><X className="size-5" /></button>
          <button aria-label="Précédent" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-8 size-12 rounded-full glass flex items-center justify-center z-10"><ChevronLeft className="size-5" /></button>
          <button aria-label="Suivant" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-8 size-12 rounded-full glass flex items-center justify-center z-10"><ChevronRight className="size-5" /></button>

          <div className="max-w-7xl w-full max-h-[92vh] flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-2xl overflow-auto shadow-glow flex-1 min-h-0 bg-black" onTouchStart={(e) => (touchStartX.current = e.changedTouches[0].clientX)} onTouchEnd={(e) => { const sx = touchStartX.current; if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (dx > 60) prev(); if (dx < -60) next(); touchStartX.current = null; }}>
              <img src={filtered[lightbox].src} alt={filtered[lightbox].title} className={cn("mx-auto h-full w-full object-contain transition-transform duration-300", zoomed && "scale-125 cursor-zoom-out")} onClick={() => setZoomed((z) => !z)} />
            </div>
          </div>
        </div>
      )}

      {shareItem && (
        <div className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4" onClick={() => setShareItem(null)}>
          <div className="w-full max-w-md glass rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Partager l'image</h3><button onClick={() => setShareItem(null)}><X className="size-5" /></button></div>
            <div className="flex gap-3 items-center mb-4"><img src={shareItem.src} alt={shareItem.title} className="size-16 rounded-lg object-cover" /><div><p className="font-medium text-sm">{shareItem.title}</p><p className="text-xs text-muted-foreground">{shareItem.category}</p></div></div>
            <div className="text-xs break-all bg-muted rounded-lg p-2 mb-3">{getShareUrl(shareItem)}</div>
            <div className="grid grid-cols-2 gap-2">
              <button className="glass rounded-lg py-2 text-sm" onClick={async () => { await navigator.clipboard.writeText(getShareUrl(shareItem)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Copy className="size-4 inline mr-1" />{copied ? "Copié" : "Copier"}</button>
              <a className="glass rounded-lg py-2 text-sm text-center" href={shareItem.src} download><Download className="size-4 inline mr-1" />Télécharger</a>
            </div>
          </div>
        </div>
      )}

      {shareItem && (
        <div className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4" onClick={() => setShareItem(null)}>
          <div className="w-full max-w-md glass rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Partager l'image</h3><button onClick={() => setShareItem(null)}><X className="size-5" /></button></div>
            <div className="flex gap-3 items-center mb-4"><img src={shareItem.src} alt={shareItem.title} className="size-16 rounded-lg object-cover" /><div><p className="font-medium text-sm">{shareItem.title}</p><p className="text-xs text-muted-foreground">{shareItem.category}</p></div></div>
            <div className="text-xs break-all bg-muted rounded-lg p-2 mb-3">{getShareUrl(shareItem)}</div>
            <div className="grid grid-cols-2 gap-2">
              <button className="glass rounded-lg py-2 text-sm" onClick={async () => { await navigator.clipboard.writeText(getShareUrl(shareItem)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Copy className="size-4 inline mr-1" />{copied ? "Copié" : "Copier"}</button>
              <a className="glass rounded-lg py-2 text-sm text-center" href={shareItem.src} download><Download className="size-4 inline mr-1" />Télécharger</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
