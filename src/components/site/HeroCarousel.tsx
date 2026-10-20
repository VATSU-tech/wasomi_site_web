import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { useHeroSlidesQuery } from "@/hooks/useWasomiApi";
import type { HeroSlide } from "@/types/domain";
import { cn } from "@/lib/utils";

const DEFAULT_DURATION_MS = 5000;
const MIN_DURATION_MS = 1000;
const MAX_DURATION_MS = 120_000;

const FALLBACK: HeroSlide = {
  id: "fallback",
  title: "Une école qui fait grandir chaque enfant",
  subtitle:
    "De la crèche aux humanités, nous accompagnons vos enfants avec une pédagogie vivante, des ateliers de sciences et un cadre où ils se sentent en confiance.",
  video_url: "./gallerie/vid.mp4",
  cta_label: "Préinscrire mon enfant",
  cta_href: "/contact?tab=admission",
  duration_ms: DEFAULT_DURATION_MS,
};

function slideDurationMs(slide: HeroSlide | undefined): number {
  const n = Number(slide?.duration_ms);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_DURATION_MS;
  return Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, Math.round(n)));
}

export function HeroCarousel() {
  const { data } = useHeroSlidesQuery();
  const slides = data && data.length > 0 ? data : [FALLBACK];
  const [index, setIndex] = useState(0);
  const slide = slides[index % slides.length];

  const activeDurationMs = slideDurationMs(slide);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), activeDurationMs);
    return () => clearTimeout(id);
  }, [index, slides.length, activeDurationMs]);

  const ctaIsAdmission =
    !slide.cta_href ||
    slide.cta_href.includes("admission") ||
    slide.cta_href.includes("contact");

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((s, i) => {
          const active = i === index % slides.length;
          return (
            <div
              key={String(s.id)}
              className={cn(
                "absolute inset-0 transition-opacity duration-2000 ease-out",
                active ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
              aria-hidden={!active}
            >
              {s.video_url ? (
                <video
                  key={`media-${s.id}-${active ? "on" : "off"}`}
                  src={s.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={active ? "auto" : "none"}
                  className={cn(
                    "size-full object-cover",
                    active && "slide-in-home",
                  )}
                />
              ) : (
                <img
                  key={`media-${s.id}-${active ? "on" : "off"}`}
                  src={s.image_url || "/gallerie/vue-generale-campus-wasomi.jpg"}
                  alt=""
                  className={cn(
                    "size-full object-cover",
                    active && "slide-in-home",
                  )}
                />
              )}
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.18),transparent_55%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <div
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full
            border border-white/20 bg-white/10
            text-white/90 text-xs md:text-sm font-semibold mb-8
            overflow-hidden"
            data-aos="fade-up"
          >
            {/* Background flouté */}
            <div
              className="absolute inset-0
              bg-[url('https://www.shutterstock.com/image-photo/red-gps-map-260nw-2494094029.jpg')]
              bg-cover
              scale-110
              bg-[position:60%_50%]"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Contenu net */}
            <a
              href="https://maps.app.goo.gl/bSDTmFdURd7dP6zz5"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-2 shadow-xl"
            >
              <MapPin className="size-4" />
              <span>Complexe Scolaire Wasomi — Beni, Nord-Kivu</span>
            </a>
          </div>

          <h1
            key={`t-${slide.id}`}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] animate-page-in"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            {slide.title || FALLBACK.title}
          </h1>

          <p
            key={`s-${slide.id}`}
            className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl animate-page-in"
            data-aos="fade-up"
            data-aos-delay="180"
          >
            {slide.subtitle || FALLBACK.subtitle}
          </p>

          <div
            className="mt-10 flex flex-wrap gap-4"
            data-aos="fade-up"
            data-aos-delay="280"
          >
            {ctaIsAdmission ? (
              <Link
                to="/contact"
                search={{ tab: "admission" }}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-900 font-bold shadow-xl hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 transition-all duration-1000"
              >
                {slide.cta_label || "Préinscrire mon enfant"}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <a
                href={slide.cta_href || "/formations"}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-900 font-bold shadow-xl hover:-translate-y-0.5 transition-all duration-1000"
              >
                {slide.cta_label || "En savoir plus"}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
            <Link
              to="/formations"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 text-white font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-1000"
            >
              Découvrir nos cycles
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((s, i) => (
            <button
              key={String(s.id)}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === index % slides.length
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
          Découvrir
        </span>
        <div className="size-8 rounded-full border border-white/30 flex items-center justify-center animate-bounce">
          <ArrowRight className="size-3.5 rotate-90" />
        </div>
      </div>
    </section>
  );
}
