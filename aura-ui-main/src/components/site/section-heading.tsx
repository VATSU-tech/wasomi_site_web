import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "center", className }: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-12",
        align === "center" ? "mx-auto text-center" : "",
        className,
      )}
      data-aos="fade-up"
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold tracking-widest uppercase text-primary mb-4">
          <span className="size-1.5 rounded-full bg-primary animate-glow-pulse" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
