import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Baby,
  Blocks,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Trophy,
  Pyramid,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Gallery } from "@/components/site/gallery";
import { galleryItems, galleryCategories } from "@/data/gallery";
import { CountUp } from "@/components/site/count-up";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { NewsFeatured } from "@/components/site/NewsFeatured";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { useProgramsQuery, usePublicSettingsQuery } from "@/hooks/useWasomiApi";
import { normalizeSiteKpis } from "@/lib/site-kpis";
import type { Program } from "@/types/domain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CS Wasomi — École maternelle & primaire d'excellence à Beni" },
      {
        name: "description",
        content:
          "Le Complexe Scolaire Wasomi accueille vos enfants de la crèche à la 8ème année à Beni : pédagogie de l'éveil, sciences, technologies et éducation de base dans un cadre familial et sécurisé.",
      },
      { property: "og:title", content: "CS Wasomi — École d'excellence à Beni" },
      {
        property: "og:description",
        content:
          "Crèche, maternelle, primaire et éducation de base — une école vivante, humaine et tournée vers l'avenir.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/gallerie/vue-generale-campus-wasomi.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://wasomi.cd/" },
    ],
  }),
  component: Home,
});

type CycleCard = {
  id: string | number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  color: string;
  stat: string;
};

const CYCLE_ICONS: LucideIcon[] = [Baby, Blocks, BookOpen, Pyramid];
const CYCLE_COLORS = [
  "from-sky-500 to-teal-500",
  "from-rose-500 to-orange-400",
  "from-primary to-primary-glow",
  "from-emerald-500 to-teal-600",
];

/** Fallback si l'API formations est indisponible — même ordre que les 4 premiers cycles historiques */
const fallbackCycles: CycleCard[] = [
  {
    id: "fallback-1",
    icon: Baby,
    title: "Crèche",
    subtitle: "De 6 mois à 3 ans",
    desc: "Un accueil rassurant et chaleureux, un éveil sensoriel adapté aux tout-petits dans un cadre sécurisé.",
    image: "/gallerie/formation_maternelle.jpg",
    color: "from-sky-500 to-teal-500",
    stat: "Éveil & motricité",
  },
  {
    id: "fallback-2",
    icon: Blocks,
    title: "Maternelle",
    subtitle: "Petite, moyenne & grande section",
    desc: "Des ateliers créatifs, le langage et la socialisation : l'enfant construit sa confiance en s'amusant.",
    image: "/gallerie/maternelle.jpg",
    color: "from-rose-500 to-orange-400",
    stat: "Lire, compter, créer",
  },
  {
    id: "fallback-3",
    icon: BookOpen,
    title: "Primaire",
    subtitle: "De la 1ère à la 6ème",
    desc: "Des bases solides en lecture, écriture et mathématiques, avec une ouverture sur les sciences et les technologies.",
    image: "/gallerie/classe-premiere-primaire.jpg",
    color: "from-primary to-primary-glow",
    stat: "Bases solides",
  },
  {
    id: "fallback-4",
    icon: Pyramid,
    title: "Éducation de base",
    subtitle: "7ème & 8ème année",
    desc: "Consolider les fondamentaux, développer l'autonomie et préparer la suite du parcours avec un appui personnalisé.",
    image: "/gallerie/labo_1.jpg",
    color: "from-emerald-500 to-teal-600",
    stat: "Autonomie & méthode",
  },
];

function mapProgramsToCycles(programs: Program[]): CycleCard[] {
  return programs.slice(0, 4).map((p, idx) => ({
    id: p.id,
    icon: CYCLE_ICONS[idx % CYCLE_ICONS.length],
    title: p.title,
    subtitle: p.level || p.duration || "Cycle Wasomi",
    desc: p.summary || p.description || "Formation d'excellence au Complexe Scolaire Wasomi.",
    image: p.image || "/gallerie/formation_maternelle.jpg",
    color: p.color || CYCLE_COLORS[idx % CYCLE_COLORS.length],
    stat: p.duration || p.students || "Wasomi",
  }));
}

const values = [
  {
    icon: HeartHandshake,
    title: "Une équipe qui connaît chaque enfant",
    desc: "Enseignants et éducateurs présents, à l'écoute des familles, attentifs au rythme de chacun.",
  },
  {
    icon: Lightbulb,
    title: "Apprendre par la pratique",
    desc: "Laboratoires, ateliers de sciences, initiation au numérique : les enfants expérimentent avant de comprendre.",
  },
  {
    icon: ShieldCheck,
    title: "Un cadre sûr et bienveillant",
    desc: "Infirmerie, environnement surveillé et valeurs de respect : les parents sont rassurés, les enfants épanouis.",
  },
  {
    icon: Trophy,
    title: "Les réussites de nos élèves",
    desc: "Distinctions, fêtes pédagogiques et projets menés à terme : chaque progrès est célébré.",
  },
];

function Home() {
  const { data: settings } = usePublicSettingsQuery();
  const { data: apiPrograms, isLoading: programsLoading } = useProgramsQuery();
  const stats = normalizeSiteKpis(settings?.site_kpis).items;
  const cycles: CycleCard[] =
    apiPrograms && apiPrograms.length > 0
      ? mapProgramsToCycles(apiPrograms)
      : fallbackCycles;

  return (
    <>
      <HeroCarousel />
      <NewsFeatured />

      {/* ============ STATS BAR / VALEURS ============ */}
      <section className="relative bg-surface border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl py-12 sm:py-16">
          <SectionHeading
            eyebrow="Nos valeurs"
            title="Wasomi en chiffres"
            description="Des indicateurs concrets qui reflètent la vie de l'école et notre engagement auprès des familles."
            className="mb-10"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div
                key={s.key}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <CountUp
                  end={s.value}
                  suffix={s.suffix || ""}
                  className="font-display text-4xl md:text-5xl font-bold text-primary"
                />
                <div className="text-sm text-muted-foreground mt-2 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BIENVENUE / PRÉSENTATION ============ */}
      <section className="py-14 sm:py-24 container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div data-aos="fade-up">
            <div className="relative">
              <div className="hidden sm:block absolute -top-5 -left-5 size-32 rounded-3xl bg-primary/10 -z-10" />
              <div className="hidden sm:block absolute -bottom-5 -right-5 size-40 rounded-full bg-secondary/20 -z-10" />
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/gallerie/classe-premiere-primaire.jpg"
                  alt="Élèves de première année primaire en classe"
                  loading="lazy"
                  className="aspect-[4/3] size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-card border border-border rounded-2xl px-5 py-4 shadow-lg flex items-center gap-3">
                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-6 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-lg leading-none">
                    Depuis 2021
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    au cœur de Beni
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="fade-up">
            <SectionHeading
              align="left"
              eyebrow="Bienvenue"
              title="Une école de proximité, une exigence de qualité"
              className="mb-6"
            />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Au Complexe Scolaire Wasomi, chaque enfant est connu par son nom.
              Notre conviction est simple : un bon départ change tout. C'est
              pourquoi nous mettons l'accent sur l'éveil, les fondamentaux et
              la confiance.
            </p>
            {/* <p className="text-muted-foreground leading-relaxed mb-8">
              De la crèche à la 8ème année, nos enseignants accompagnent les
              élèves dans un parcours cohérent — avec des ateliers de sciences,
              une initiation aux technologies et une vie scolaire riche en
              activités.
            </p> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Effectifs raisonnables, suivi individualisé",
                "Ateliers de chimie & de domotique",
                "Sorties pédagogiques et fêtes scolaires",
                "Communication régulière avec les familles",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="group mt-10 inline-flex items-center gap-2 font-semibold text-primary link-underline"
            >
              Découvrir notre histoire
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CYCLES D'ENSEIGNEMENT (4 premières formations, ordre admin) ============ */}
      <section className="py-14 sm:py-24 bg-surface border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeading
            eyebrow="Nos cycles"
            title="Un parcours continu, de la crèche à la 8ème"
            description="Chaque étape a ses besoins. Nos programmes sont pensés pour que l'enfant grandisse en confiance, sans rupture."
          />
          {programsLoading && (!apiPrograms || apiPrograms.length === 0) ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[380px] rounded-3xl bg-card border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cycles.map((c, i) => (
                <article
                  key={c.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 90}
                  className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:rotate-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={c.image}
                      alt={`${c.title} — ${c.subtitle}`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    <div
                      className={`absolute top-4 left-4 size-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                    >
                      <c.icon className="size-6 text-white" />
                    </div>
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground shadow">
                      {c.stat}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold">
                      {c.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary mt-1 uppercase tracking-wide">
                      {c.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                      {c.desc}
                    </p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link
                      to="/formations"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300"
                    >
                      En savoir plus
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ ATOUTS ============ */}
      <section className="py-14 sm:py-24 container mx-auto px-4 max-w-7xl">
        <SectionHeading
          eyebrow="Pourquoi Wasomi"
          title="Ce qui fait la différence au quotidien"
          description="Bien plus qu'une école : une communauté où l'on grandit ensemble, avec sérieux et bienveillance."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={v.title}
              data-aos="fade-up"
              data-aos-delay={i * 90}
              className="group rounded-3xl p-7 bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 size-24 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <v.icon className="size-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg font-bold leading-snug mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ VIE SCOLAIRE (galerie) ============ */}
      <section className="py-14 sm:py-24 bg-surface border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeading
            eyebrow="La vie à Wasomi"
            title="Des moments qui comptent"
            description="Nos classes, nos ateliers, nos sorties et nos fêtes : la vie scolaire, en images."
          />
          <Gallery
            items={galleryItems.filter(
              (item) =>
                item.id === "10" ||
                item.id === "3" ||
                item.id === "79" ||
                item.id === "83" ||
                item.id === "80" ||
                item.id === "14" ||
                item.id === "18",
            )}
            categories={galleryCategories}
          />
          <div className="mt-12 text-center" data-aos="fade-up">
            <Link
              to="/galerie"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-card border border-border font-semibold hover:border-primary/40 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Voir toute la galerie
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </>
  );
}
