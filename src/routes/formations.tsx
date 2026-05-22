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
  CircleDot,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/formations")({
  head: () => ({
    meta: [
      { title: "Formations — Wasomi" },
      {
        name: "description",
        content:
          "Découvrez les formations Wasomi : développement web, design, data, marketing et plus encore.",
      },
      { property: "og:title", content: "Formations — Wasomi" },
      {
        property: "og:description",
        content: "Programmes innovants pour révéler votre talent.",
      },
    ],
  }),
  component: FormationsPage,
});

type FormationDetail = {
  id: number;
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
  // options: string[];
  // usefulInfos: string[];
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

const formations: FormationDetail[] = [
  {
    id: 1,
    icon: Baby,
    image: "/gallerie/IMG-20260519-WA0016.jpg",
    title: "Creche",
    fullName: "Crèche – Pré-éveil et socialisation",
    duration: "4 ans",
    students: "10+",
    desc: "Des enseignants passionnés pour accompagner vos enfants dans leur développement global.",
    color: "from-indigo-500 to-purple-500",
    fees: {
      ...sharedFees,
      cycle: "Cycle complet",
    },
    // options: ["Éveil sensoriel", "Premières notions de langage", "Activités motrices"],
    // usefulInfos: [
    //   "Suivi pédagogique individualisé",
    //   "Encadrement rapproché et sécurisé",
    //   "Communication régulière avec les parents",
    // ],
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
    color: "from-pink-500 to-rose-500",
    fees: {
      ...sharedFees,
      cycle: "Cycle complet",
    },
    // options: ["Expression orale et artistique", "Initiation au calcul", "Jeux éducatifs"],
    // usefulInfos: [
    //   "Classes adaptées à l'âge des enfants",
    //   "Progression pédagogique par compétence",
    //   "Activités d'éveil culturel et citoyen",
    // ],
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
    color: "from-blue-500 to-cyan-500",
    fees: {
      ...sharedFees,
      cycle: "1ère en 6ème année",
    },
    // options: ["Français et mathématiques renforcés", "Sciences et découverte", "Activités sportives"],
    // usefulInfos: [
    //   "Évaluations continues pendant l'année",
    //   "Suivi des performances par trimestre",
    //   "Accompagnement à la méthode de travail",
    // ],
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
    color: "from-emerald-500 to-teal-500",
    fees: {
      ...sharedFees,
      cycle: "7ème et 8ème année",
    },
    // options: ["Renforcement des compétences fondamentales", "Projet d'orientation", "Initiation numérique"],
    // usefulInfos: [
    //   "Préparation à la transition vers le secondaire",
    //   "Soutien académique en modules ciblés",
    //   "Activités de responsabilisation et leadership",
    // ],
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
    color: "from-blue-500 to-purple-500",
    fees: {
      ...sharedFees,
      cycle: "Atelier complémentaire",
    },
    // options: ["Capteurs et automatismes", "Programmation embarquée", "Mini-projets pratiques"],
    // usefulInfos: [
    //   "Accès au laboratoire selon planning",
    //   "Travaux pratiques encadrés",
    //   "Présentation de projet en fin de module",
    // ],
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
    // options: ["Manipulations en laboratoire", "Sécurité expérimentale", "Méthodologie scientifique"],
    // usefulInfos: [
    //   "Kit de laboratoire requis",
    //   "Séances démonstratives encadrées",
    //   "Rapports d'expérience évalués",
    // ],
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
  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Nos <span className="text-gradient">formations</span>
          </h1>
          <p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Des cursus pensés pour les métiers d'aujourd'hui et de demain.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f, i) => (
            <article
              key={f.id}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 80}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-elegant transition-spring hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="relative h-[420px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-spring group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${f.image})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
                <div
                  className={`absolute -right-20 -top-20 size-52 rounded-full bg-gradient-to-br ${f.color} opacity-20 blur-3xl transition-smooth group-hover:opacity-40`}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                  <div
                    className={`mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-glow transition-spring group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <f.icon className="size-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {f.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {f.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" />
                      {f.students}
                    </span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-3"
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
                        <div className="grid gap-2 rounded-lg border p-4">
                          <p className="inline-flex items-center gap-2 font-semibold">
                            <BadgeDollarSign className="size-4 text-primary" /> Frais scolaires
                          </p>
                          <p>Total annuel: {f.fees.total}</p>
                          <p>Cycle: {f.fees.cycle}</p>
                          <p>Frais connexes: {f.fees.connectedFees}</p>
                          <p>Frais Labotech: {f.fees.labotech}</p>
                          <p>Infirmerie: {f.fees.infirmary}</p>
                          <p>1ère tranche: {f.fees.firstInstallment}</p>
                          <p>2ème tranche: {f.fees.secondInstallment}</p>
                          <p>3ème tranche: {f.fees.thirdInstallment}</p>
                        </div>

                  {/*      <div className="grid gap-2 rounded-lg border p-4">
                          <p className="inline-flex items-center gap-2 font-semibold">
                            <CircleDot className="size-4 text-primary" /> Options disponibles
                          </p>
                          {f.options.map((option) => (
                            <p key={option}>• {option}</p>
                          ))}
                        </div>

                        <div className="grid gap-2 rounded-lg border p-4">
                          <p className="inline-flex items-center gap-2 font-semibold">
                            <Info className="size-4 text-primary" /> Informations utiles
                          </p>
                          {f.usefulInfos.map((info) => (
                            <p key={info}>• {info}</p>
                          ))}
                        </div>*/}

                        <div className="grid gap-2 rounded-lg border p-4">
                          <p className="inline-flex items-center gap-2 font-semibold">
                            <CalendarClock className="size-4 text-primary" /> Horaires scolaires
                          </p>
                          <p>Arrivée: {f.schedule.arrivalTime}</p>
                          <p>Début des cours: {f.schedule.classStart}</p>
                          <p>Pause du matin: {f.schedule.morningBreak}</p>
                          <p>Heure du repas: {f.schedule.lunchTime}</p>
                          <p>Pause de midi: {f.schedule.middayBreak}</p>
                          <p>Reprise des cours: {f.schedule.afternoonResume}</p>
                          <p>Fin des cours: {f.schedule.classEnd}</p>
                          <p>Horaires spéciaux: {f.schedule.specialHours}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
