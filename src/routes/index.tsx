import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Baby,
  Blocks,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Microscope,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Gallery } from "@/components/site/gallery";
import { galleryItems, galleryCategories } from "@/data/gallery";
import { CountUp } from "@/components/site/count-up";
import { usePostsQuery } from "@/hooks/useWasomiApi";
import { Calendar } from "lucide-react";

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
  }),
  component: Home,
});

const cycles = [
  {
    icon: Baby,
    title: "Crèche",
    subtitle: "De 6 mois à 3 ans",
    desc: "Un accueil rassurant et chaleureux, un éveil sensoriel adapté aux tout-petits dans un cadre sécurisé.",
    image: "/gallerie/formation_maternelle.jpg",
    color: "from-sky-500 to-teal-500",
    stat: "Éveil & motricité",
  },
  {
    icon: Blocks,
    title: "Maternelle",
    subtitle: "Petite, moyenne & grande section",
    desc: "Des ateliers créatifs, le langage et la socialisation : l'enfant construit sa confiance en s'amusant.",
    image: "/gallerie/maternelle.jpg",
    color: "from-rose-500 to-orange-400",
    stat: "Lire, compter, créer",
  },
  {
    icon: BookOpen,
    title: "Primaire",
    subtitle: "De la 1ère à la 6ème",
    desc: "Des bases solides en lecture, écriture et mathématiques, avec une ouverture sur les sciences et les technologies.",
    image: "/gallerie/classe-premiere-primaire.jpg",
    color: "from-primary to-primary-glow",
    stat: "Bases solides",
  },
  {
    icon: GraduationCap,
    title: "Éducation de base",
    subtitle: "7ème & 8ème année",
    desc: "Consolider les fondamentaux, développer l'autonomie et préparer la suite du parcours avec un appui personnalisé.",
    image: "/gallerie/labo_1.jpg",
    color: "from-emerald-500 to-teal-600",
    stat: "Autonomie & méthode",
  },
];

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

const stats = [
  { val: 150, suf: "+", label: "Élèves accompagnés", icon: Users },
  { val: 4, suf: "", label: "Cycles d'enseignement", icon: BookOpen },
  { val: 2, suf: "", label: "Ateliers scientifiques", icon: Microscope },
  { val: 10, suf: "+", label: "Enseignants & éducateurs", icon: Sparkles },
];

const fallbackPosts = [
  {
    id: "1",
    title: "Rentrée 2026 : ce qui change cette année",
    date: "12 Septembre 2026",
    category: "Actualités",
    excerpt:
      "Nouveaux aménagements, nouvelle dynamique : bienvenue à tous pour une belle année.",
    img: "/gallerie/IMG-20260519-WA0002.jpg",
  },
  {
    id: "2",
    title: "Lipanda Fiesta : la fête de l'indépendance chez Wasomi",
    date: "30 Juin 2026",
    category: "Événement",
    excerpt:
      "Jeux, culture et compétitions : un moment fort qui rassemble toute la communauté scolaire.",
    img: "/gallerie/festival lipanda fiesta.jpg",
  },
  {
    id: "3",
    title: "Sortie à l'aéroport de Mavivi : dés coulisses inoubliables",
    date: "20 Février 2026",
    category: "Visite",
    excerpt:
      "Nos élèves ont découvert l'aviation de près lors d'une sortie pédagogique unique.",
    img: "/gallerie/sortie visite aeroport mavivi.jpg",
  },
];

const testimonials = [
  {
    name: "Maman de Naomi",
    role: "Maternelle — Grande section",
    text: "Ma fille rayonne depuis qu'elle est à Wasomi. Les éducatrices sont attentives, l'école est bien organisée, et je vois ses progrès chaque semaine.",
  },
  {
    name: "Papa de Jonathan",
    role: "3ème primaire",
    text: "Ce que j'apprécie, c'est la proximité : on connaît les enseignants, on est informé de la vie de l'école, et les résultats en classe parlent d'eux-mêmes.",
  },
  {
    name: "Tante de Grace",
    role: "1ère année primaire",
    text: "Les ateliers de sciences et le cadre sécurisé ont fait toute la différence pour notre famille. Je recommande Wasomi sans hésiter.",
  },
];

function Home() {
  const { data: postsData } = usePostsQuery();
  const posts =
    postsData?.items && postsData.items.length > 0
      ? postsData.items.slice(0, 3).map((p) => ({
        id: String(p.id),
        title: p.title,
        date: p.published_at
          ? new Date(p.published_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          : "Article récent",
        category: p.category || "Actualités",
        excerpt: p.summary || p.content?.slice(0, 120) || "",
        img: p.cover_image || "/gallerie/IMG-20260519-WA0002.jpg",
      }))
      : fallbackPosts;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/gallerie/vue-generale-campus-wasomi.jpg"
            alt="Vue du Complexe Scolaire Wasomi"
            className="size-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.18),transparent_55%)]" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative pt-28 sm:pt-32 pb-20">
          <div className="max-w-3xl">
            <div
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full
             border border-white/20 bg-white/10
             text-white/90 text-xs md:text-sm font-semibold mb-8
             overflow-hidden"
              data-aos="fade-up"
            >
              {/* Background image flouté */}
              <div
                className="absolute inset-0
               bg-[url('https://imgs.search.brave.com/Ed9zp9EkGKYIZ10tCxpnmVwIw2M_Oq4S4v1HVhS0ZlI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzQzLzkzLzE1/LzM2MF9GXzg0Mzkz/MTU0NF90QW5mMTRR/TGJzUWVvMHoxUWRW/UHlQdFZZZ3c2S09u/Qy5qcGc')]
               bg-cover
               bg-center
              
               scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Contenu net */}
              <a
                href="https://maps.app.goo.gl/bSDTmFdURd7dP6zz5"
                target="_blank"
                className="relative z-10 flex items-center gap-2 shadow-xl"
              >
                <MapPin className="size-4" />

                <span>Complexe Scolaire Wasomi — Beni, Nord-Kivu</span>
              </a>
            </div>
            <h1
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              Une école qui fait grandir{" "}
              <span className="text-gradient bg-gradient-to-r from-sky-300 to-emerald-300">
                chaque enfant
              </span>
              , du premier pas à la réussite.
            </h1>
            <p
              className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl"
              data-aos="fade-up"
              data-aos-delay="180"
            >
              De la crèche à la 8ème année, nous accompagnons vos enfants avec
              une pédagogie vivante, des ateliers de sciences et un cadre où
              ils se sentent en confiance.
            </p>
            <div
              className="mt-10 flex flex-wrap gap-4"
              data-aos="fade-up"
              data-aos-delay="280"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-900 font-bold shadow-xl hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 transition-all duration-300"
              >
                Préinscrire mon enfant
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/formations"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 text-white font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                Découvrir nos cycles
              </Link>
            </div>
            <div
              className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4"
              data-aos="fade-up"
              data-aos-delay="380"
            >
              {[
                { icon: Baby, label: "Crèche & Maternelle" },
                { icon: BookOpen, label: "Primaire" },
                { icon: Microscope, label: "Sciences & Numérique" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 text-white/80 text-sm font-medium"
                >
                  <Icon className="size-4 text-emerald-300" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
            Découvrir
          </span>
          <div className="size-8 rounded-full border border-white/30 flex items-center justify-center animate-bounce">
            <ArrowRight className="size-3.5 rotate-90" />
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="relative bg-surface border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <CountUp
                  end={s.val}
                  suffix={s.suf}
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <div className="relative">
              <div className="absolute -top-5 -left-5 size-32 rounded-3xl bg-primary/10 -z-10" />
              <div className="absolute -bottom-5 -right-5 size-40 rounded-full bg-secondary/20 -z-10" />
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
                  <GraduationCap className="size-6 text-primary" />
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

          <div data-aos="fade-left">
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
            <p className="text-muted-foreground leading-relaxed mb-8">
              De la crèche à la 8ème année, nos enseignants accompagnent les
              élèves dans un parcours cohérent — avec des ateliers de sciences,
              une initiation aux technologies et une vie scolaire riche en
              activités.
            </p>
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

      {/* ============ CYCLES D'ENSEIGNEMENT ============ */}
      <section className="py-14 sm:py-24 bg-surface border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeading
            eyebrow="Nos cycles"
            title="Un parcours continu, de la crèche à la 8ème"
            description="Chaque étape a ses besoins. Nos programmes sont pensés pour que l'enfant grandisse en confiance, sans rupture."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cycles.map((c, i) => (
              <article
                key={c.title}
                data-aos="fade-up"
                data-aos-delay={i * 90}
                className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
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

      {/* ============ ACTUALITÉS ============ */}
      <section className="py-14 sm:py-24 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <SectionHeading
            align="left"
            eyebrow="Actualités"
            title="Les dernières nouvelles de l'école"
            className="mb-0"
          />
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-semibold text-primary link-underline shrink-0"
          >
            Tout le blog
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article
              key={p.id}
              data-aos="fade-up"
              data-aos-delay={i * 90}
              className="group rounded-3xl overflow-hidden bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground shadow">
                  {p.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="size-3.5" />
                  {p.date}
                </div>
                <h3 className="font-display text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {p.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ TÉMOIGNAGES ============ */}
      <section className="py-14 sm:py-24 bg-surface border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeading
            eyebrow="Paroles de familles"
            title="Ils nous confient leurs enfants"
            description="Ce que nous racontent les parents et tuteurs qui ont choisi Wasomi."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                data-aos="fade-up"
                data-aos-delay={i * 90}
                className="rounded-3xl p-7 bg-card border border-border hover:border-primary/25 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground flex-1 italic">
                  “{t.text}”
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
                  <div className="size-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA PRÉINSCRIPTION ============ */}
      <section className="py-14 sm:py-24 container mx-auto px-4 max-w-7xl">
        <div
          className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 text-center bg-gradient-primary text-primary-foreground shadow-2xl"
          data-aos="zoom-in"
        >
          <div className="absolute -top-24 -left-24 size-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-32 -right-16 size-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-10 right-16 hidden lg:block text-white/10 font-display text-8xl font-bold">
            Wasomi
          </div>
          <div className="relative">
            <div className="inline-flex px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase mb-6">
              Inscriptions ouvertes
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto">
              Prêt à confier l'avenir de votre enfant à une équipe qui croit en
              lui ?
            </h2>
            <p className="mt-5 text-white/85 max-w-xl mx-auto text-base md:text-lg">
              Remplissez une préinscription en quelques minutes. Notre équipe
              d'admission vous recontacte rapidement pour un échange
              personnalisé.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                Préinscription en ligne
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+243997742651"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/25 text-white font-semibold hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                <Phone className="size-4" />
                Nous appeler
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}