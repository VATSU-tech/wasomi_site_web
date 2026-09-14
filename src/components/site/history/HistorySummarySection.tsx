/**
 * Visual summary section with achievements, stats, and values
 */

import { SchoolHistoryConfig } from "@/data/school-history";

interface HistorySummarySectionProps {
  config: SchoolHistoryConfig;
}

const colorPalette = [
  { bg: "from-primary to-primary-glow", text: "text-primary" },
  { bg: "from-purple-500 to-pink-500", text: "text-purple-600 dark:text-purple-400" },
  { bg: "from-green-500 to-emerald-500", text: "text-green-600 dark:text-green-400" },
  { bg: "from-orange-500 to-red-500", text: "text-orange-600 dark:text-orange-400" },
];

export function HistorySummarySection({ config }: HistorySummarySectionProps) {
  const getColorForIndex = (index: number) => colorPalette[index % colorPalette.length];

  return (
    <section className="py-20 container mx-auto px-4 max-w-7xl">
      {/* Section Title */}
      <div className="text-center mb-16" data-aos="fade-up">
        <span className="badge-soft">
          Nos valeurs
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-4">
          Ce qui guide notre école
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
              className="p-8 rounded-3xl bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                <span className="font-display text-xl font-bold text-primary group-hover:text-primary-foreground transition-colors">
                  {value.label.charAt(0)}
                </span>
              </div>
              <h4 className="font-display text-xl font-semibold mb-3">
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
          Nos résultats
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.keyAchievements.map((achievement, i) => {
            const color = getColorForIndex(i);
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.title}
                data-aos="zoom-in"
                data-aos-delay={i * 100}
                className="p-7 rounded-3xl bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center"
              >
                <div className={`size-16 mx-auto rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <IconComponent className="size-8 text-white" />
                </div>
                <h4 className="font-display font-semibold mb-2">
                  {achievement.title}
                </h4>
                <p className="text-muted-foreground text-sm mb-3">
                  {achievement.description}
                </p>
                {achievement.stats && (
                  <div className="text-2xl font-bold text-primary">
                    {achievement.stats}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
