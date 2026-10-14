import { Link } from "@tanstack/react-router";
import { Calendar, Mail, User, Clock3, Tag } from "lucide-react";
import type { Post } from "@/types/domain";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(iso?: string) {
  if (!iso) return "Article récent";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PostDetailModal({ post, open, onOpenChange }: Props) {
  if (!post) return null;

  const cover = post.cover_image || "/gallerie/IMG-20260519-WA0002.jpg";
  const body = (post.content || post.summary || "").trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[92vh] overflow-hidden p-0 gap-0 sm:max-w-2xl rounded-t-3xl sm:rounded-3xl",
          "border-border shadow-2xl",
          "[&>button]:top-4 [&>button]:right-4 [&>button]:z-10",
          "[&>button]:size-10 [&>button]:rounded-xl [&>button]:bg-black/50 [&>button]:text-white",
          "[&>button]:opacity-100 [&>button]:ring-0 [&>button]:hover:bg-black/70 [&>button]:hover:opacity-100",
        )}
        aria-describedby="post-detail-body"
      >
        <div className="relative aspect-[16/9] shrink-0 bg-surface">
          <img src={cover} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {post.category && (
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/95 text-xs font-semibold shadow">
              <Tag className="size-3 text-primary" />
              {post.category}
            </span>
          )}
        </div>

        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(92vh-40vw)] sm:max-h-[min(52vh,420px)] space-y-4">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              {post.reading_time && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {post.reading_time}
                </span>
              )}
              {post.author?.name && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {post.author.name}
                  {post.author.role ? ` · ${post.author.role}` : ""}
                </span>
              )}
            </div>
            <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
              {post.title}
            </DialogTitle>
            {post.summary && post.summary !== body && (
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                {post.summary}
              </DialogDescription>
            )}
          </DialogHeader>

          {post.author?.avatar && (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
              <img
                src={post.author.avatar}
                alt=""
                className="size-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{post.author.name}</p>
                {post.author.role && (
                  <p className="text-xs text-muted-foreground truncate">{post.author.role}</p>
                )}
              </div>
            </div>
          )}

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div
            id="post-detail-body"
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed"
          >
            {body || "Contenu indisponible pour le moment."}
          </div>

          <div className="pt-4 border-t border-border flex flex-wrap gap-3">
            <Link
              to="/contact"
              search={{ tab: "contact" }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-lg"
              onClick={() => onOpenChange(false)}
            >
              <Mail className="size-4" />
              Nous contacter à ce sujet
            </Link>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-surface transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
