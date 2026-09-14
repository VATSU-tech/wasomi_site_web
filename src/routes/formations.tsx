import { createFileRoute } from "@tanstack/react-router";
import {
  Code2,
  ArrowRight,
  Clock,
  Users,
  Baby,
  Blocks,
  BookOpen,
  GraduationCap,
  Microscope,
  BadgeDollarSign,
  CalendarClock,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProgramsQuery } from "@/hooks/useWasomiApi";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/formations")({
  head: () => ({
    meta: [
      { title: "Formations & cycles — CS Wasomi" },
      {
        name: "description",
        content:
          "Crèche, maternelle, primaire, éducation de base et ateliers de sciences : découvrez les cycles du Complexe Scolaire Wasomi.",
      },
      { property: "og:title", content: "Formations — CS Wasomi" },
      {
        property: "og:description",
        content: "Des cycles pensés pour chaque âge.",
      },
    ],
  }),
  component: FormationsPage,
});

type FormationDetail = {
  id: string | number;
  icon: typeof Baby;
  image: string;
  title: string;
  fullName: string;
  duration: string;
  students: string;
  desc: string;
  color: string;
  fees: {
    total: string;
    cycle: string;
    connectedFees: string;
    labotech: string;
    infirmary: string;
    firstInstallment: string;
    secondInstallment: string;
    thirdInstallment: string;
  };
  schedule: {
    arrivalTime: string;
    classStart: string;
    morningBreak: string;
    lunchTime: string;
    middayBreak: string;
    afternoonResume: string;
    classEnd: string;
    specialHours: string;
  };
};

const sharedFees = {
  total: "530 $",
  connectedFees: "10 $",
  labotech: "50 $",
  infirmary: "12 $",
  firstInstallment: "200 $",
  secondInstallment: "150 $",
  thirdInstallment: "180 $",
};

const fallbackFormations: FormationDetail[] = [
  {
    id: 1,
    icon: Baby,
    image: "/gallerie/IMG-20260519-WA0016.jpg",
    title: "Creche",
    fullName: "Crèche – Pré-éveil et socialisation",
    duration: "4 ans",
    students: "10+",
    desc: "Des enseignants passionnés pour accompagner vos enfants dans leur développement global.",
    color: "from-sky-500 to-teal-500",
    fees: {
      ...sharedFees,
      cycle: "Cycle complet",
    },
    schedule: {
      arrivalTime: "07h00 - 07h30",
      classStart: "07h30",
      morningBreak: "09h30 - 09h45",
      lunchTime: "11h30",
      middayBreak: "12h00 - 13h00",
      afternoonResume: "13h00",
      classEnd: "15h00",
      specialHours: "Sortie anticipée possible pour les plus petits sur demande.",
    },
  },
  {
    id: 2,
    icon: Blocks,
    image: "/gallerie/formation_maternelle.jpg",
    title: "Maternelle",
    fullName: "Maternelle – Cycle complet",
    duration: "3 ans",
    students: "20+",
    desc: "Un environnement stimulant pour favoriser l'éveil et la créativité de vos enfants.",
    color: "from-rose-500 to-orange-400",
    fees: {
      ...sharedFees,
      cycle: "Cycle complet",
    },
    schedule: {
      arrivalTime: "07h00 - 07h30",
      classStart: "07h30",
      morningBreak: "09h30 - 09h45",
      lunchTime: "11h45",
      middayBreak: "12h00 - 13h00",
      afternoonResume: "13h00",
      classEnd: "15h15",
      specialHours: "Ateliers créatifs hebdomadaires en fin de journée.",
    },
  },
  {
    id: 3,
    icon: BookOpen,
    image: "/gallerie/IMG-20260519-WA0021.jpg",
    title: "Primaire",
    fullName: "Primaire – 1ère en 6ème année",
    duration: "6 ans",
    students: "60+",
    desc: "Un enseignement de qualité pour construire les bases solides de l'apprentissage de vos enfants.",
    color: "from-primary to-primary-glow",
    fees: {
      ...sharedFees,
      cycle: "1ère en 6ème année",
    },
    schedule: {
      arrivalTime: "06h45 - 07h20",
      classStart: "07h30",
      morningBreak: "10h00 - 10h20",
      lunchTime: "12h00",
      middayBreak: "12h30 - 13h30",
      afternoonResume: "13h30",
      classEnd: "16h00",
      specialHours: "Étude surveillée optionnelle après les cours.",
    },
  },
  {
    id: 4,
    icon: GraduationCap,
    image: "/gallerie/realisation.jpg",
    title: "Education de base",
    fullName: "Éducation de base – 7ème et 8ème année",
    duration: "2 ans",
    students: "35+",
    desc: "Un programme complet pour renforcer les compétences fondamentales et préparer les élèves à l'avenir.",
    color: "from-emerald-500 to-teal-600",
    fees: {
      ...sharedFees,
      cycle: "7ème et 8ème année",
    },
    schedule: {
      arrivalTime: "06h45 - 07h20",
      classStart: "07h30",
      morningBreak: "10h00 - 10h20",
      lunchTime: "12h10",
      middayBreak: "12h30 - 13h30",
      afternoonResume: "13h30",
      classEnd: "16h00",
      specialHours: "Séances d'appui le mercredi après-midi selon le niveau.",
    },
  },
  {
    id: 5,
    icon: Code2,
    image: "/gallerie/labo_3.jpg",
    title: "Bases de la domotique",
    fullName: "Bases de la domotique – Atelier technologique",
    duration: "2 ans",
    students: "20+",
    desc: "Apprenez à automatiser votre maison avec les dernières technologies de domotique.",
    color: "from-primary to-primary-glow",
    fees: {
      ...sharedFees,
      cycle: "Atelier complémentaire",
    },
    schedule: {
      arrivalTime: "13h15 - 13h30",
      classStart: "13h30",
      morningBreak: "N/A",
      lunchTime: "N/A",
      middayBreak: "N/A",
      afternoonResume: "14h45",
      classEnd: "16h30",
      specialHours: "Cours organisés en sessions pratiques de l'après-midi.",
    },
  },
  {
    id: 6,
    icon: Microscope,
    image: "/gallerie/IMG-20260519-WA0068.jpg",
    title: "Bases de la chimie",
    fullName: "Bases de la chimie – Atelier scientifique",
    duration: "2 ans",
    students: "20+",
    desc: "Explorez les merveilles de la chimie à travers des expériences pratiques et des concepts fondamentaux.",
    color: "from-amber-500 to-yellow-500",
    fees: {
      ...sharedFees,
      cycle: "Atelier complémentaire",
    },
    schedule: {
      arrivalTime: "13h15 - 13h30",
      classStart: "13h30",
      morningBreak: "N/A",
      lunchTime: "N/A",
      middayBreak: "N/A",
      afternoonResume: "14h45",
      classEnd: "16h30",
      specialHours: "Ateliers intensifs planifiés certains samedis.",
    },
  },
];

function FormationsPage() {
  const { data: apiPrograms, isLoading, isError, error } = useProgramsQuery();

  const displayFormations: FormationDetail[] = apiPrograms && apiPrograms.length > 0
    ? apiPrograms.map((p, idx) => ({
        id: p.id,
        icon: [Baby, Blocks, BookOpen, GraduationCap, Code2, Microscope][idx % 6],
        image: p.image || "/gallerie/IMG-20260519-WA0016.jpg",
        title: p.title,
        fullName: p.title,
        duration: p.duration || "1 an",
        students: (p as { students?: string }).students || "30+",
        desc: p.summary || p.description || "Formation d'excellence.",
        color: (p as { color?: string }).color || ["from-indigo-500 to-purple-500", "from-pink-500 to-rose-500", "from-primary to-primary-glow", "from-emerald-500 to-teal-500", "from-primary to-primary-glow", "from-amber-500 to-yellow-500"][idx % 6],
        fees: {
          ...sharedFees,
          ...((p as { fees?: Partial<FormationDetail["fees"]> }).fees || {}),
          total: (p as { fees?: { total?: string } }).fees?.total || (p.price ? `${p.price}` : sharedFees.total),
          cycle: (p as { fees?: { cycle?: string } }).fees?.cycle || p.level || "Cycle complet",
        },
        schedule: {
          arrivalTime: "07h00 - 07h30",
          classStart: "07h30",
          morningBreak: "09h30 - 09h45",
          lunchTime: "11h30",
          middayBreak: "12h00 - 13h00",
          afternoonResume: "13h00",
          classEnd: "15h00",
          specialHours: "Programme modulable.",
          ...((p as { schedule?: Partial<FormationDetail["schedule"]> }).schedule || {}),
        },
      }))
    : fallbackFormations;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl py-14 text-center">
          <span className="badge-soft">Nos cycles d'enseignement</span>
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-5"
            data-aos="fade-up"
          >
            Un cycle pour <span className="text-primary">chaque âge</span>
          </h1>
          <p
            className="mt-5 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            De la crèche aux ateliers scientifiques, découvrez les parcours
            proposés au Complexe Scolaire Wasomi.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[440px] rounded-3xl bg-surface animate-pulse border border-border" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center gap-3 mb-6">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              Impossible de charger les formations depuis le serveur : {error?.message}
            </p>
          </div>
        )}

        {!isLoading && displayFormations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucune formation disponible pour le moment.</p>
          </div>
        )}

        {!isLoading && displayFormations.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFormations.map((f, i) => (
              <article
                key={f.id}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 80}
                className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-[440px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${f.image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-card/10" />
                  <div
                    className={`absolute -right-20 -top-20 size-52 rounded-full bg-gradient-to-br ${f.color} opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40`}
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                    <div
                      className={`mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <f.icon className="size-7 text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {f.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5 text-primary" />
                        {f.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5 text-primary" />
                        ~{f.students}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                          >
                            En savoir plus
                            <ArrowRight className="size-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{f.fullName}</DialogTitle>
                            <DialogDescription>{f.desc}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 text-sm">
                            <div className="grid gap-2.5 rounded-2xl border border-border bg-surface p-5">
                              <p className="inline-flex items-center gap-2 font-bold text-foreground">
                                <BadgeDollarSign className="size-4 text-primary" /> Frais scolaires
                              </p>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {[
                                  { label: "Total annuel", value: f.fees.total, highlight: true },
                                  { label: "Cycle", value: f.fees.cycle },
                                  { label: "Frais connexes", value: f.fees.connectedFees },
                                  { label: "Labotech", value: f.fees.labotech },
                                  { label: "Infirmerie", value: f.fees.infirmary },
                                ].map(({ label, value, highlight }) => (
                                  <div key={label} className="flex items-center justify-between rounded-xl bg-card border border-border px-4 py-2.5">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className={highlight ? "font-bold text-primary" : "font-semibold"}>{value}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 mt-1">
                                <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
                                  Paiement en 3 tranches
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    ["1ère", f.fees.firstInstallment],
                                    ["2ème", f.fees.secondInstallment],
                                    ["3ème", f.fees.thirdInstallment],
                                  ].map(([label, value]) => (
                                    <span key={label as string} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-semibold">
                                      <Check className="size-3 text-emerald-500" />
                                      {label}: {value}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid gap-2.5 rounded-2xl border border-border bg-surface p-5">
                              <p className="inline-flex items-center gap-2 font-bold text-foreground">
                                <CalendarClock className="size-4 text-primary" /> Horaires scolaires
                              </p>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {[
                                  { label: "Arrivée", value: f.schedule.arrivalTime },
                                  { label: "Début des cours", value: f.schedule.classStart },
                                  { label: "Pause du matin", value: f.schedule.morningBreak },
                                  { label: "Repas", value: f.schedule.lunchTime },
                                  { label: "Pause de midi", value: f.schedule.middayBreak },
                                  { label: "Reprise", value: f.schedule.afternoonResume },
                                  { label: "Fin des cours", value: f.schedule.classEnd },
                                ].map(({ label, value }) => (
                                  <div key={label} className="flex items-center justify-between rounded-xl bg-card border border-border px-4 py-2.5">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className="font-semibold">{value}</span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {f.schedule.specialHours}
                              </p>
                            </div>

                            <Link
                              to="/contact"
                              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                              Préinscrire mon enfant
                              <ArrowRight className="size-4" />
                            </Link>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary link-underline"
                      >
                        S'inscrire
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}