import { createFileRoute, Link } from "@tanstack/react-router";
import { AudioPlayer } from "@/components/site/history/AudioPlayer";
// import { HistoryFullText } from "@/components/site/history/HistoryFullText";
import { HistoryTimeline } from "@/components/site/history/HistoryTimeline";
import { HistorySummarySection } from "@/components/site/history/HistorySummarySection";
import { SectionHeading } from "@/components/site/section-heading";
import { useVTTData } from "@/hooks/useVTTData";
import { schoolHistoryConfig } from "@/data/school-history";
import { usePageQuery } from "@/hooks/useWasomiApi";
import { ArrowRight, GraduationCap, Heart, BookOpen, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — CS Wasomi" },
      {
        name: "description",
        content:
          "Notre histoire, notre mission, nos valeurs : découvrez ce qui fait le Complexe Scolaire Wasomi à Beni.",
      },
      { property: "og:title", content: "À propos — CS Wasomi" },
      {
        property: "og:description",
        content: "Notre histoire et notre mission.",
      },
      { property: "og:image", content: "/gallerie/vue-generale-campus-wasomi.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://wasomi.cd/about" },
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div className="container mx-auto px-4 max-w-4xl pt-10 pb-16 text-center">
          <span className="badge-soft">
            Notre histoire
          </span>
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-5"
            data-aos="fade-up"
          >
            {aboutPage?.title ?? (
              <>
                Une école née d'une{" "}
                <span className="text-primary">conviction</span>
              </>
            )}
          </h1>
          <p
            className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {aboutPage?.content ||
              "En 2021, la famille Paluku Sivirwa décide de créer une école où chaque enfant serait accompagné avec exigence et bienveillance. Aujourd'hui, le Complexe Scolaire Wasomi accompagne plus de 150 élèves, de la crèche à la 8ème année."}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div data-aos="fade-up">
            <div className="relative">
              <div className="hidden sm:block absolute -top-5 -right-5 size-32 rounded-3xl bg-secondary/20 -z-10" />
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/gallerie/realisation.jpg"
                  alt="Réalisations des élèves du Complexe Scolaire Wasomi"
                  className="aspect-[4/3] size-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 left-6 bg-card border border-border rounded-2xl px-5 py-4 shadow-lg flex items-center gap-3">
                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="size-6 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-lg leading-none">
                    100 % de réussite
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    à l'examen national de fin de primaire
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-aos="fade-up">
            <SectionHeading
              align="left"
              eyebrow="Notre mission"
              title="Faire grandir chaque enfant, tout simplement"
              className="mb-5"
            />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Notre mission va bien au-delà des résultats : elle consiste à
              offrir à chaque enfant un environnement où il se sent en
              sécurité, encouragé et capable de réussir.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Heart, title: "Bienveillance", desc: "Chaque enfant est connu et valorisé." },
                { icon: BookOpen, title: "Exigence", desc: "Des bases solides pour la suite du parcours." },
                { icon: Users, title: "Communauté", desc: "Familles et école travaillent main dans la main." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl bg-surface border border-border p-5">
                  <Icon className="size-6 text-primary mb-3" />
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {desc}
                  </div>
                </div>
              ))}
            </div>
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
          <SectionHeading
            eyebrow="Écoutez notre histoire"
            title="Le récit de Wasomi, raconté par l'équipe"
            description="Appuyez sur lecture pour découvrir les coulisses de notre aventure."
          />
          {cues.length > 0 && (
            <AudioPlayer audioSrc={schoolHistoryConfig.audioFile} cues={cues} />
          )}
        </div>
      </section>

      {/* Full Immersive History Section */}
      {/* <HistoryFullText
        textPath={schoolHistoryConfig.textFile}
        audioPath={schoolHistoryConfig.audioFile}
        vttPath={schoolHistoryConfig.subtitlesFile}
        backgroundImage={schoolHistoryConfig.backgroundImage}
        backgroundOpacity={schoolHistoryConfig.overlayOpacity}
      /> */}

      {/* CTA visite */}
      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="rounded-[2rem] bg-surface border border-border p-8 md:p-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Venez découvrir notre école
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Le meilleur moyen de comprendre Wasomi, c'est de pousser nos portes
            et de rencontrer notre équipe.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Nous contacter
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}