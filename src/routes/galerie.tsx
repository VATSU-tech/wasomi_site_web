import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/section-heading";
import { Gallery } from "@/components/site/gallery";
import { galleryItems, galleryCategories } from "@/data/gallery";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — Wasomi" },
      { name: "description", content: "Explorez la vie du campus Wasomi : événements, réalisations étudiantes, équipements et espaces." },
      { property: "og:title", content: "Galerie — Wasomi" },
      { property: "og:description", content: "La vie au campus en images." },
    ],
  }),
  component: GaleriePage,
});

function GaleriePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative py-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold tracking-widest uppercase text-primary mb-4" data-aos="fade-down">
            Notre univers
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight" data-aos="fade-up">
            Galerie <span className="text-gradient">Wasomi</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Plongez dans l'univers de notre école : campus, équipements, événements et réalisations.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <Gallery items={galleryItems} categories={galleryCategories} />
      </section>
    </>
  );
}
