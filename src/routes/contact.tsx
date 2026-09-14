import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  User,
  Baby,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useContactMutation, useAdmissionMutation, usePublicSettingsQuery, useProgramsQuery } from "@/hooks/useWasomiApi";
import { authStore } from "@/store/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Préinscription — Wasomi" },
      {
        name: "description",
        content:
          "Contactez l'école Wasomi ou effectuez une demande de préinscription en ligne.",
      },
      { property: "og:title", content: "Contact & Préinscription — Wasomi" },
      { property: "og:description", content: "Contactez-nous ou inscrivez-vous." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court (minimum 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().optional(),
  message: z.string().min(5, "Message trop court (minimum 5 caractères)"),
  phone: z.string().optional(),
});

const admissionSchema = z.object({
  last_name: z.string().min(2, "Nom de l'enfant requis (minimum 2 caractères)"),
  first_name: z.string().min(2, "Prénom de l'enfant requis (minimum 2 caractères)"),
  birth_date: z.string().min(1, "Date de naissance requise"),
  gender: z.enum(["M", "F"], { required_error: "Veuillez préciser le sexe de l'enfant" }),
  class_level: z.string().min(1, "Veuillez sélectionner la classe souhaitée"),
  program_id: z.string().optional(),
  guardian_name: z.string().min(2, "Nom du parent ou tuteur requis"),
  guardian_relation: z.string().optional(),
  phone: z.string().min(6, "Téléphone requis (ex: +243...)"),
  email: z.string().email("Adresse email invalide"),
  emergency_phone: z.string().optional(),
  address: z.string().optional(),
  previous_school: z.string().optional(),
  last_grade_result: z.string().optional(),
  message: z.string().optional(),
});

const AVAILABLE_CLASSES = [
  {
    cycle: "Crèche",
    items: [{ id: "Crèche (Pré-éveil)", label: "Crèche (Pré-éveil & Garderie)" }],
  },
  {
    cycle: "Maternelle",
    items: [
      { id: "1ère Maternelle", label: "1ère Maternelle (Petite Section)" },
      { id: "2ème Maternelle", label: "2ème Maternelle (Moyenne Section)" },
      { id: "3ème Maternelle", label: "3ème Maternelle (Grande Section)" },
    ],
  },
  {
    cycle: "Primaire",
    items: [
      { id: "1ère Primaire", label: "1ère Année Primaire" },
      { id: "2ème Primaire", label: "2ème Année Primaire" },
      { id: "3ème Primaire", label: "3ème Année Primaire" },
      { id: "4ème Primaire", label: "4ème Année Primaire" },
      { id: "5ème Primaire", label: "5ème Année Primaire" },
      { id: "6ème Primaire", label: "6ème Année Primaire" },
    ],
  },
];

function computeAge(birthDateStr: string): number | null {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

function ContactPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"contact" | "admission">("contact");
  const [sentContact, setSentContact] = useState(false);
  const [sentAdmission, setSentAdmission] = useState(false);

  // Form states
  const [contactData, setContactData] = useState({ name: "", email: "", subject: "", message: "", phone: "" });
  const [admissionData, setAdmissionData] = useState({
    last_name: "",
    first_name: "",
    birth_date: "",
    gender: "M" as "M" | "F",
    class_level: "",
    program_id: "",
    guardian_name: "",
    guardian_relation: "Père",
    phone: "",
    email: "",
    emergency_phone: "",
    address: "",
    previous_school: "",
    last_grade_result: "",
    message: "",
  });

  const initialAdmissionState = {
    last_name: "",
    first_name: "",
    birth_date: "",
    gender: "M" as "M" | "F",
    class_level: "",
    program_id: "",
    guardian_name: "",
    guardian_relation: "Père",
    phone: "",
    email: "",
    emergency_phone: "",
    address: "",
    previous_school: "",
    last_grade_result: "",
    message: "",
  };

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const contactMutation = useContactMutation();
  const admissionMutation = useAdmissionMutation();
  const { data: settings } = usePublicSettingsQuery();
  const { data: programsData } = useProgramsQuery();

  const calculatedAge = computeAge(admissionData.birth_date);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = contactSchema.safeParse(contactData);
    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      setFormErrors(formatted as Record<string, string[]>);
      return;
    }

    try {
      const res = await contactMutation.mutateAsync(result.data);
      if (res.data?.authenticated && res.data.user) {
        authStore.setUser(res.data.user);
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
        toast.success("Connexion réussie");
        navigate({ to: "/admin" });
        return;
      }
      setSentContact(true);
    } catch (err: unknown) {
      const errorObj = err as { fields?: Record<string, string[]> };
      if (errorObj?.fields) {
        setFormErrors(errorObj.fields);
      }
    }
  };

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = admissionSchema.safeParse(admissionData);
    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      setFormErrors(formatted as Record<string, string[]>);
      toast.error("Veuillez vérifier les informations renseignées.");
      return;
    }

    try {
      const fullName = `${result.data.last_name} ${result.data.first_name}`.trim();
      await admissionMutation.mutateAsync({
        ...result.data,
        name: fullName,
        age: calculatedAge ?? undefined,
      });
      setSentAdmission(true);
      toast.success("Demande de préinscription envoyée avec succès !");
    } catch (err: unknown) {
      const errorObj = err as { fields?: Record<string, string[]>; message?: string };
      if (errorObj?.fields) {
        setFormErrors(errorObj.fields);
      } else {
        toast.error(errorObj?.message || "Une erreur est survenue lors de l'enregistrement.");
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-surface">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="badge-soft">
            <Mail className="size-3.5" />
            Contact & Préinscriptions
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-5 mb-4">
            Construisons l'avenir de votre enfant{" "}
            <span className="text-primary">ensemble</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Posez-nous vos questions ou préinscrivez votre enfant directement
            en quelques clics.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info Card Sidebar */}
          <div className="space-y-6">
            <div className="card-premium p-8 rounded-3xl bg-card border border-border space-y-6">
              <h2 className="font-display text-xl font-bold">Nos Coordonnées</h2>

              <div className="space-y-4 text-sm">
                <a href="https://maps.app.goo.gl/bSDTmFdURd7dP6zz5" target="_blank" className="flex items-start gap-4 border-border border rounded-2xl p-2 hover:bg-surface-elevated transition-smooth">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Adresse</h3>
                    <p className="text-muted-foreground mt-0.5">
                      {settings?.contact_address || "Rue N°5,Q.Residentiel, C.Bungulu, Beni, Nord-Kivu, RDC"}
                    </p>
                  </div>
                </a>

                <a href="tel:+243970000000" className="flex items-start gap-4 border-border border rounded-2xl p-2 hover:bg-surface-elevated transition-smooth">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Téléphone & WhatsApp</h3>
                    <p className="text-muted-foreground mt-0.5">
                      {settings?.contact_phone || "+243 970 000 000"}
                    </p>
                  </div>
                </a>

                <a href="mailto:contact@wasomi.cd" className="flex items-start gap-4 border-border border rounded-2xl p-2 hover:bg-surface-elevated transition-smooth">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground mt-0.5">
                      {settings?.contact_email || "contact@wasomi.cd"}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-primary text-primary-foreground space-y-3 shadow-xl">
              <div className="flex items-center gap-3">
                <GraduationCap className="size-7" />
                <h3 className="font-display font-bold text-lg">Inscriptions ouvertes</h3>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                Les places dans nos classes sont limitées. Remplissez le
                formulaire de préinscription pour un premier échange
                personnalisé avec notre équipe.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2 card-premium p-8 rounded-3xl bg-card border border-border">
            {/* Tabs selector */}
            <div className="flex p-1.5 rounded-2xl bg-surface border border-border mb-8">
              <button
                type="button"
                onClick={() => { setTab("contact"); setFormErrors({}); }}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                  tab === "contact"
                    ? "bg-card text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Message Général
              </button>
              <button
                type="button"
                onClick={() => { setTab("admission"); setFormErrors({}); }}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                  tab === "admission"
                    ? "bg-card text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Préinscription Élève
              </button>
            </div>

            {(contactMutation.isError || admissionMutation.isError) && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
                <AlertCircle className="size-5 shrink-0" />
                <p>
                  {contactMutation.error?.message || admissionMutation.error?.message || "Une erreur est survenue lors de l'envoi."}
                </p>
              </div>
            )}

            {/* TAB 1: CONTACT */}
            {tab === "contact" && (
              sentContact ? (
                <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                  <div className="size-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4">
                    <CheckCircle2 className="size-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Message Envoyé avec Succès !
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSentContact(false); setContactData({ name: "", email: "", subject: "", message: "", phone: "" }); }}
                    className="mt-6 text-sm font-semibold text-primary hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nom complet <span className="text-primary">*</span></label>
                    <input
                      type="text"
                      required
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                    />
                    {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name.join(', ')}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email <span className="text-primary">*</span></label>
                      <input
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="exemple@domaine.com"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                      />
                      {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email.join(', ')}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Téléphone / WhatsApp</label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        placeholder="+243..."
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Sujet</label>
                    <input
                      type="text"
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                      placeholder="Sujet de votre message"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message <span className="text-primary">*</span></label>
                    <textarea
                      rows={5}
                      required
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      placeholder="Écrivez votre message ici..."
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 resize-none"
                    />
                    {formErrors.message && <p className="text-xs text-destructive mt-1">{formErrors.message.join(', ')}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-spring disabled:opacity-50"
                  >
                    {contactMutation.isPending ? "Envoi en cours..." : "Envoyer le Message"}
                    <Send className="size-4" />
                  </button>
                </form>
              )
            )}

            {/* TAB 2: ADMISSION ENRICHIE */}
            {tab === "admission" && (
              sentAdmission ? (
                <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                  <div className="size-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4">
                    <CheckCircle2 className="size-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Demande de préinscription enregistrée !
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Nous avons bien reçu le dossier complet de préinscription. Notre équipe d'admission analysera votre profil et vous recontactera rapidement.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSentAdmission(false); setAdmissionData(initialAdmissionState); }}
                    className="mt-6 text-sm font-semibold text-primary hover:underline"
                  >
                    Soumettre une autre préinscription
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAdmissionSubmit} className="space-y-6">
                  {/* SECTION 1 : ÉLÈVE */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                      <Baby className="size-4 text-primary" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        1. Identité de l'élève
                      </h4>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Nom de l'enfant <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={admissionData.last_name}
                          onChange={(e) => setAdmissionData({ ...admissionData, last_name: e.target.value })}
                          placeholder="Ex: Kasereka"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                        {formErrors.last_name && (
                          <p className="text-xs text-destructive mt-1">{formErrors.last_name.join(', ')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Prénom de l'enfant <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={admissionData.first_name}
                          onChange={(e) => setAdmissionData({ ...admissionData, first_name: e.target.value })}
                          placeholder="Ex: David"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                        {formErrors.first_name && (
                          <p className="text-xs text-destructive mt-1">{formErrors.first_name.join(', ')}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Sexe / Genre <span className="text-primary">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setAdmissionData({ ...admissionData, gender: "M" })}
                            className={cn(
                              "py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-smooth",
                              admissionData.gender === "M"
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-surface border-border text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <span> Garçon</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdmissionData({ ...admissionData, gender: "F" })}
                            className={cn(
                              "py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-smooth",
                              admissionData.gender === "F"
                                ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                                : "bg-surface border-border text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <span> Fille</span>
                          </button>
                        </div>
                        {formErrors.gender && (
                          <p className="text-xs text-destructive mt-1">{formErrors.gender.join(', ')}</p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Date de naissance <span className="text-primary">*</span>
                          </label>
                          {calculatedAge !== null && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              <Sparkles className="size-3" />
                              {calculatedAge} an{calculatedAge > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <input
                          type="date"
                          required
                          max={new Date().toISOString().split("T")[0]}
                          value={admissionData.birth_date}
                          onChange={(e) => setAdmissionData({ ...admissionData, birth_date: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                        {formErrors.birth_date && (
                          <p className="text-xs text-destructive mt-1">{formErrors.birth_date.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2 : CLASSE SOUHAITÉE */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                      <GraduationCap className="size-4 text-primary" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        2. Classe & Niveau souhaité
                      </h4>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Classe demandée <span className="text-primary">*</span>
                        </label>
                        <select
                          required
                          value={admissionData.class_level}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Synchronise automatiquement le program_id correspondant si possible
                            let matchedProg = "";
                            if (val.includes("Crèche")) matchedProg = "Creche";
                            else if (val.includes("Maternelle")) matchedProg = "Maternelle";
                            else if (val.includes("Primaire")) matchedProg = "Primaire";
                            setAdmissionData({
                              ...admissionData,
                              class_level: val,
                              program_id: matchedProg || admissionData.program_id,
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        >
                          <option value="">-- Sélectionner la classe --</option>
                          {AVAILABLE_CLASSES.map((grp) => (
                            <optgroup key={grp.cycle} label={`Cycle : ${grp.cycle}`}>
                              {grp.items.map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        {formErrors.class_level && (
                          <p className="text-xs text-destructive mt-1">{formErrors.class_level.join(', ')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Programme Wasomi associé
                        </label>
                        <select
                          value={admissionData.program_id}
                          onChange={(e) => setAdmissionData({ ...admissionData, program_id: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        >
                          <option value="">-- Sélectionner le cycle --</option>
                          {programsData && Array.isArray(programsData) && programsData.map((prog: { id: string | number; title: string; duration?: string }) => (
                            <option key={prog.id} value={String(prog.id)}>
                              {prog.title} {prog.duration ? `(${prog.duration})` : ""}
                            </option>
                          ))}
                          <option value="Creche">Crèche</option>
                          <option value="Maternelle">Maternelle</option>
                          <option value="Primaire">Primaire</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3 : PARENT / TUTEUR */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                      <User className="size-4 text-primary" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        3. Responsable légal (Parent / Tuteur)
                      </h4>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Nom complet du tuteur <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={admissionData.guardian_name}
                          onChange={(e) => setAdmissionData({ ...admissionData, guardian_name: e.target.value })}
                          placeholder="Nom, Post-nom et Prénom"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                        {formErrors.guardian_name && (
                          <p className="text-xs text-destructive mt-1">{formErrors.guardian_name.join(', ')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Lien de parenté
                        </label>
                        <select
                          value={admissionData.guardian_relation}
                          onChange={(e) => setAdmissionData({ ...admissionData, guardian_relation: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        >
                          <option value="Père">Père</option>
                          <option value="Mère">Mère</option>
                          <option value="Tuteur légal">Tuteur légal</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Téléphone WhatsApp principal <span className="text-primary">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={admissionData.phone}
                          onChange={(e) => setAdmissionData({ ...admissionData, phone: e.target.value })}
                          placeholder="+243 970 000 000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                        {formErrors.phone && (
                          <p className="text-xs text-destructive mt-1">{formErrors.phone.join(', ')}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Email de contact <span className="text-primary">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={admissionData.email}
                          onChange={(e) => setAdmissionData({ ...admissionData, email: e.target.value })}
                          placeholder="parent@exemple.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                        {formErrors.email && (
                          <p className="text-xs text-destructive mt-1">{formErrors.email.join(', ')}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Téléphone alternatif / Urgence
                        </label>
                        <input
                          type="tel"
                          value={admissionData.emergency_phone}
                          onChange={(e) => setAdmissionData({ ...admissionData, emergency_phone: e.target.value })}
                          placeholder="+243..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Adresse de résidence (Beni)
                        </label>
                        <input
                          type="text"
                          value={admissionData.address}
                          onChange={(e) => setAdmissionData({ ...admissionData, address: e.target.value })}
                          placeholder="Quartier, Commune, Avenue..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4 : SCOLARITÉ & REMARQUES */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                      <ShieldCheck className="size-4 text-primary" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        4. Scolarité antérieure & Remarques
                      </h4>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          École de provenance (si applicable)
                        </label>
                        <input
                          type="text"
                          value={admissionData.previous_school}
                          onChange={(e) => setAdmissionData({ ...admissionData, previous_school: e.target.value })}
                          placeholder="Nom de l'école précédente"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-foreground">
                          Dernier pourcentage / Mention
                        </label>
                        <input
                          type="text"
                          value={admissionData.last_grade_result}
                          onChange={(e) => setAdmissionData({ ...admissionData, last_grade_result: e.target.value })}
                          placeholder="Ex: 68%, Distinction..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-foreground">
                        Remarques ou besoins particuliers (santé, régime, etc.)
                      </label>
                      <textarea
                        rows={3}
                        value={admissionData.message}
                        onChange={(e) => setAdmissionData({ ...admissionData, message: e.target.value })}
                        placeholder="Informations médicales, allergies ou toute précision utile pour l'équipe pédagogique..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border focus:border-primary focus:outline-none transition-smooth text-sm resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={admissionMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-elegant hover:shadow-glow transition-spring disabled:opacity-50 text-base"
                  >
                    {admissionMutation.isPending ? "Transmission du dossier en cours..." : "Valider et Soumettre le Dossier de Préinscription"}
                    <GraduationCap className="size-5" />
                  </button>
                </form>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
