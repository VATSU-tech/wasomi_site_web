/**
 * Interactive timeline component showing key dates in school history
 */

import { SchoolHistoryConfig } from "@/data/school-history";

interface HistoryTimelineProps {
  config: SchoolHistoryConfig;
}

export function HistoryTimeline({ config }: HistoryTimelineProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">
            Notre chronologie
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Une progression remarquable
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les jalons importants qui ont marqué l'évolution de Wasomi
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

          {/* Timeline items */}
          <div className="space-y-12 md:space-y-16">
            {config.keyDates.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.year}
                  className="relative"
                  data-aos={isEven ? "fade-right" : "fade-left"}
                  data-aos-delay={index * 100}
                >
                  <div className={`grid md:grid-cols-2 gap-8 items-center`}>
                    {isEven ? (
                      <>
                        {/* Left content */}
                        <div className="text-right">
                          <h3 className="font-display text-2xl md:text-3xl font-bold text-gradient mb-2">
                            {item.year}
                          </h3>
                          <p className="font-semibold text-lg mb-2">
                            {item.event}
                          </p>
                          {item.details && (
                            <p className="text-muted-foreground text-sm">
                              {item.details}
                            </p>
                          )}
                        </div>

                        {/* Center circle */}
                        <div className="hidden md:flex justify-center">
                          <div className="size-6 rounded-full bg-gradient-primary shadow-glow" />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Center circle */}
                        <div className="hidden md:flex justify-center">
                          <div className="size-6 rounded-full bg-gradient-primary shadow-glow" />
                        </div>

                        {/* Right content */}
                        <div>
                          <h3 className="font-display text-2xl md:text-3xl font-bold text-gradient mb-2">
                            {item.year}
                          </h3>
                          <p className="font-semibold text-lg mb-2">
                            {item.event}
                          </p>
                          {item.details && (
                            <p className="text-muted-foreground text-sm">
                              {item.details}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile center dot */}
                  <div className="md:hidden absolute -left-6 top-2 size-4 rounded-full bg-gradient-primary shadow-glow border-4 border-background" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
