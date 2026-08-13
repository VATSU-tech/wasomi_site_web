import { createFileRoute } from "@tanstack/react-router";
import { AudioPlayer } from "@/components/site/history/AudioPlayer";
import { HistoryFullText } from "@/components/site/history/HistoryFullText";
import { HistoryTimeline } from "@/components/site/history/HistoryTimeline";
import { HistorySummarySection } from "@/components/site/history/HistorySummarySection";
import { useVTTData } from "@/hooks/useVTTData";
import { schoolHistoryConfig } from "@/data/school-history";
import { usePageQuery } from "@/hooks/useWasomiApi";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Wasomi" },
      {
        name: "description",
        content:
          "Notre histoire, notre mission, nos valeurs : découvrez ce qui fait Wasomi.",
      },
      { property: "og:title", content: "À propos — Wasomi" },
      {
        property: "og:description",
        content: "Notre histoire et notre mission.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: aboutPage } = usePageQuery('about');
  const { data: vttData } = useVTTData(schoolHistoryConfig.subtitlesFile);
  const cues = vttData?.cues || [];

  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-4xl relative text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            {aboutPage?.title ?? (
              <>
                À propos de <span className="text-gradient">Wasomi</span>
              </>
            )}
          </h1>
          <p
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {aboutPage?.content ||
              "Fondée en 2021, Wasomi est née d'une conviction simple : chaque élève mérite une éducation qui révèle son potentiel unique. Aujourd'hui, c'est plusieurs élèves formés chez nous."}
          </p>
        </div>
      </section>

      <section className="py-5 container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div data-aos="fade-right">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-glow">
              <img
                src="/gallerie/realisation.jpg"
                alt="Notre mission"
                className="size-full object-cover"
              />
            </div>
          </div>
          <div data-aos="fade-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              Notre mission
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
              Former les talents qui changeront le monde
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nous croyons en une pédagogie où l'humain est au centre. Chaque
              élève est accompagné individuellement par un mentor, et nos
              programmes sont conçus pour garantir un apprentissage d'excellence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Notre objectif : faire éclore des leaders éthiques, créatifs et
              compétents, capables d'apporter des solutions aux défis de demain.
            </p>
          </div>
        </div>
      </section>

      {/* History Summary Section */}
      <HistorySummarySection config={schoolHistoryConfig} />

      {/* History Timeline */}
      <HistoryTimeline config={schoolHistoryConfig} />

      {/* Audio Player Section */}
      <section className="py-16 container mx-auto px-4 max-w-4xl">
        <div data-aos="fade-up">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
            Écoutez notre histoire
          </h2>
          {cues.length > 0 && (
            <AudioPlayer audioSrc={schoolHistoryConfig.audioFile} cues={cues} />
          )}
        </div>
      </section>

      {/* Full Immersive History Section */}
      <HistoryFullText
        textPath={schoolHistoryConfig.textFile}
        audioPath={schoolHistoryConfig.audioFile}
        vttPath={schoolHistoryConfig.subtitlesFile}
        backgroundImage={schoolHistoryConfig.backgroundImage}
        backgroundOpacity={schoolHistoryConfig.overlayOpacity}
      />
    </>
  );
}
