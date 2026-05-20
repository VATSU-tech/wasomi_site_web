/**
 * Visual summary section with achievements, stats, and values
 */

import { SchoolHistoryConfig } from "@/data/school-history";

interface HistorySummarySectionProps {
  config: SchoolHistoryConfig;
}

export function HistorySummarySection({ config }: HistorySummarySectionProps) {
  return (
    <section className="py-20 container mx-auto px-4 max-w-7xl">
      {/* Section Title */}
      <div className="text-center mb-16" data-aos="fade-up">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">
          Fondamentaux
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
          Nos réalisations et valeurs
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Wasomi s'est construit sur trois piliers fondamentaux qui guident
          chaque décision et chaque action
        </p>
      </div>

      {/* Core Values */}
      <div className="mb-20">
        <h3 className="font-display text-2xl font-bold mb-8 text-center">
          Notre devise
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {config.coreValues.map((value, i) => (
            <div
              key={value.label}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="p-8 rounded-2xl glass border border-gradient/20 hover:shadow-glow transition-all group"
            >
              <div className="text-5xl font-display font-bold text-gradient mb-4">
                {value.label.charAt(0)}
              </div>
              <h4 className="font-display text-xl font-semibold mb-3 group-hover:text-gradient transition-colors">
                {value.label}
              </h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Achievements */}
      <div>
        <h3 className="font-display text-2xl font-bold mb-8 text-center">
          Nos réalisations
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.keyAchievements.map((achievement, i) => (
            <div
              key={achievement.title}
              data-aos="zoom-in"
              data-aos-delay={i * 100}
              className="p-6 rounded-2xl glass border border-gradient/20 hover:shadow-glow transition-all hover:scale-105 group text-center"
            >
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform origin-center">
                {achievement.icon}
              </div>
              <h4 className="font-display font-semibold mb-2 group-hover:text-gradient transition-colors">
                {achievement.title}
              </h4>
              <p className="text-muted-foreground text-sm mb-3">
                {achievement.description}
              </p>
              {achievement.stats && (
                <div className="text-2xl font-bold text-gradient">
                  {achievement.stats}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
