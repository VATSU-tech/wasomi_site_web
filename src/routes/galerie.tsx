import { createFileRoute } from "@tanstack/react-router";
import { Gallery } from "@/components/site/gallery";
import { useGalleryCategoriesQuery, useGalleryQuery } from "@/hooks/useWasomiApi";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — Wasomi" },
      {
        name: "description",
        content:
          "Explorez la vie chez Wasomi : événements, réalisations étudiantes, équipements et espaces.",
      },
      { property: "og:title", content: "Galerie — Wasomi" },
      { property: "og:description", content: "La vie chez Wasomi en images." },
    ],
  }),
  component: GaleriePage,
});

function GaleriePage() {
  const { data: categoriesData } = useGalleryCategoriesQuery();
  const { data: itemsData, isLoading, isError, error } = useGalleryQuery();

  const categories = categoriesData
    ? ["Tous", ...categoriesData.map((c) => c.name)]
    : ["Tous", "Équipements & Salles", "Activités & Événements", "Réalisations", "Extérieurs & Cadre"];

  const items = (itemsData ?? []).map((item) => ({
    id: String(item.id),
    title: item.title,
    src: item.image_url,
    category: item.category || "General",
    categoryId: item.category || "all",
    description: item.description || "",
    date: item.date || "2026",
    tags: item.tags || [],
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative py-20 text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Galerie <span className="text-gradient">Wasomi</span>
          </h1>
          <p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Plongez dans l'univers de notre école : site scolaire, équipements,
            événements et réalisations.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-surface-elevated animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center gap-3 mb-6">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              Impossible de charger la galerie depuis le serveur : {error?.message}
            </p>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucune image disponible dans la galerie.</p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <Gallery items={items} categories={categories} />
        )}
      </section>
    </>
  );
}
