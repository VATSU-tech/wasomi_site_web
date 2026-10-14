import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star, X, Send, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useFeaturedReviewsQuery,
  useApprovedReviewsQuery,
  useSubmitReviewMutation,
} from "@/hooks/useWasomiApi";
import type { Review } from "@/types/domain";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/site/section-heading";

const fallbackReviews: Review[] = [
  {
    id: "1",
    author_name: "Maman de Naomi",
    author_role: "Maternelle — Grande section",
    content:
      "Ma fille rayonne depuis qu'elle est à Wasomi. Les éducatrices sont attentives, l'école est bien organisée, et je vois ses progrès chaque semaine.",
    rating: 5,
  },
  {
    id: "2",
    author_name: "Papa de Jonathan",
    author_role: "3ème primaire",
    content:
      "Ce que j'apprécie, c'est la proximité : on connaît les enseignants, on est informé de la vie de l'école, et les résultats en classe parlent d'eux-mêmes.",
    rating: 5,
  },
  {
    id: "3",
    author_name: "Tante de Grace",
    author_role: "1ère année primaire",
    content:
      "Les ateliers de sciences et le cadre sécurisé ont fait toute la différence pour notre famille. Je recommande Wasomi sans hésiter.",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star
          key={j}
          className={cn(
            "size-4",
            j < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="snap-start shrink-0 w-[min(100%,320px)] rounded-3xl p-7 bg-card border border-border hover:border-primary/25 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Stars rating={review.rating || 5} />
      <blockquote className="text-sm leading-relaxed text-foreground flex-1 italic mt-4">
        “{review.content}”
      </blockquote>
      <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
        <div className="size-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
          {review.author_name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-sm">{review.author_name}</div>
          {review.author_role && (
            <div className="text-xs text-muted-foreground">{review.author_role}</div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  const { data: featured } = useFeaturedReviewsQuery();
  const { data: allApproved } = useApprovedReviewsQuery();
  const submitMutation = useSubmitReviewMutation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    author_name: "",
    author_role: "",
    content: "",
    rating: 5,
  });

  const carousel =
    featured && featured.length > 0 ? featured.slice(0, 7) : fallbackReviews;
  const allList =
    allApproved && allApproved.length > 0 ? allApproved : fallbackReviews;

  const scrollBy = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMutation.mutateAsync(form);
      toast.success("Merci ! Votre avis sera publié après validation.");
      setForm({ author_name: "", author_role: "", content: "", rating: 5 });
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Impossible d'envoyer l'avis.");
    }
  };

  return (
    <>
      <section className="py-14 sm:py-24 bg-surface border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <SectionHeading
              align="left"
              eyebrow="Paroles de familles"
              title="Ils nous confient leurs enfants"
              description="Les avis validés de notre communauté scolaire."
              className="mb-0"
            />
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Précédent"
                className="size-11 rounded-xl border border-border bg-card flex items-center justify-center hover:border-primary/40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Suivant"
                className="size-11 rounded-xl border border-border bg-card flex items-center justify-center hover:border-primary/40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
            style={{ scrollbarWidth: "thin" }}
          >
            {carousel.map((t) => (
              <ReviewCard key={String(t.id)} review={t} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="px-6 py-3 rounded-2xl border border-border font-semibold hover:border-primary/40 hover:bg-card transition-all"
            >
              Voir tous les avis
            </button>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Laisser un avis
            </button>
          </div>
        </div>
      </section>

      {showAll && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAll(false)}
        >
          <div
            className="bg-card w-full max-w-3xl rounded-3xl border border-border shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-bold text-xl">Tous les avis</h3>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setShowAll(false)}
                className="size-9 rounded-lg border border-border flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {allList.map((r) => (
                <ReviewCard key={String(r.id)} review={r} />
              ))}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <form
            onSubmit={onSubmit}
            className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl">Votre avis</h3>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setShowForm(false)}
                className="size-9 rounded-lg border border-border flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Votre témoignage sera publié après validation par l'équipe.
            </p>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Votre nom
              </label>
              <input
                required
                minLength={2}
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm"
                placeholder="Ex. Parent de Léa"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Lien avec l'école
              </label>
              <input
                value={form.author_role}
                onChange={(e) => setForm({ ...form, author_role: e.target.value })}
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm"
                placeholder="Ex. Parent — 2ème primaire"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Note
              </label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    className="p-1"
                    aria-label={`${n} étoiles`}
                  >
                    <Star
                      className={cn(
                        "size-6",
                        n <= form.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Message
              </label>
              <textarea
                required
                minLength={10}
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm"
                placeholder="Partagez votre expérience…"
              />
            </div>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold disabled:opacity-60"
            >
              <Send className="size-4" />
              {submitMutation.isPending ? "Envoi…" : "Envoyer mon avis"}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              Une question ?{" "}
              <Link to="/contact" search={{ tab: "contact" }} className="text-primary font-semibold">
                Contactez-nous
              </Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
}
