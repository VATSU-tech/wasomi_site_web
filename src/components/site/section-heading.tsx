import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: Props) {
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
        <span className="inline-flex cache items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 mb-5">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" style={{ animationDuration: "2s" }} />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
