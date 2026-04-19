import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Wasomi" },
      { name: "description", content: "Actualités, conseils et histoires inspirantes de la communauté Wasomi." },
      { property: "og:title", content: "Blog — Wasomi" },
      { property: "og:description", content: "Actualités et conseils." },
    ],
  }),
  component: BlogPage,
});

const posts = [
  { title: "Rentrée 2025 : ce qui change", date: "12 avr. 2025", category: "Actualités", excerpt: "Nouveaux programmes, nouveaux espaces, nouvelle énergie.", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" },
  { title: "5 conseils pour réussir son projet de fin d'année", date: "28 mars 2025", category: "Conseils", excerpt: "Méthode, outils, état d'esprit : nos meilleures pratiques.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" },
  { title: "Hackathon Wasomi : retour sur l'édition 2024", date: "15 mars 2025", category: "Événement", excerpt: "48h, 30 équipes, des projets incroyables.", img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80" },
  { title: "Témoignage : de stagiaire à Lead Designer", date: "2 mars 2025", category: "Alumni", excerpt: "Le parcours inspirant de Sarah, promo 2021.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
  { title: "L'IA dans nos cursus : notre approche", date: "20 fév. 2025", category: "Pédagogie", excerpt: "Comment nous intégrons l'IA dans toutes nos formations.", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
  { title: "Portes ouvertes : venez nous rencontrer", date: "10 fév. 2025", category: "Actualités", excerpt: "Samedi 22 février, toute la journée.", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80" },
];

function BlogPage() {
  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight" data-aos="fade-up">
            Le <span className="text-gradient">blog</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
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
                <img src={p.img} alt={p.title} loading="lazy" className="size-full object-cover transition-spring group-hover:scale-110" />
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
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.excerpt}</p>
                <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-smooth">
                  Lire l'article <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
