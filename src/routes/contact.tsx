import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, GraduationCap } from "lucide-react";
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
  name: z.string().min(2, "Nom trop court (minimum 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(6, "Téléphone requis (ex: +243...)"),
  program_id: z.string().optional(),
  message: z.string().optional(),
});

function ContactPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"contact" | "admission">("contact");
  const [sentContact, setSentContact] = useState(false);
  const [sentAdmission, setSentAdmission] = useState(false);

  // Form states
  const [contactData, setContactData] = useState({ name: "", email: "", subject: "", message: "", phone: "" });
  const [admissionData, setAdmissionData] = useState({
    name: "",
    email: "",
    phone: "",
    program_id: "",
    message: "",
  });

  const initialAdmissionState = {
    name: "",
    email: "",
    phone: "",
    program_id: "",
    message: "",
  };

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const contactMutation = useContactMutation();
  const admissionMutation = useAdmissionMutation();
  const { data: settings } = usePublicSettingsQuery();
  const { data: programsData } = useProgramsQuery();

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
    } catch (err: any) {
      if (err?.fields) {
        setFormErrors(err.fields);
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
      return;
    }

    try {
      await admissionMutation.mutateAsync(result.data);
      setSentAdmission(true);
    } catch (err: any) {
      if (err?.fields) {
        setFormErrors(err.fields);
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-hero">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-wider text-primary mb-6">
            <Mail className="size-3.5" />
            Contact & Préinscriptions
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Construisons Votre Avenir <span className="text-gradient">Ensemble</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Posez-nous vos questions ou préinscrivez-vous directement en quelques clics pour réserver votre place.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info Card Sidebar */}
          <div className="space-y-6">
            <div className="card-premium p-8 rounded-2xl bg-surface border border-border space-y-6">
              <h2 className="font-display text-xl font-bold">Nos Coordonnées</h2>

              <div className="space-y-4 text-sm">
                <a href="https://www.google.com/maps?q={settings?.contact_address || 'Rue N°5,Q.Residentiel, C.Bungulu, Beni, Nord-Kivu, RDC'}" target="_blank" className="flex items-start gap-4 border-border border rounded-2xl p-2 hover:bg-surface-elevated transition-smooth">
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

                <a href="tel:+24396000000" className="flex items-start gap-4 border-border border rounded-2xl p-2 hover:bg-surface-elevated transition-smooth">
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

            <div className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground space-y-3 shadow-elegant">
              <GraduationCap className="size-8" />
              <h3 className="font-display font-bold text-lg">Inscriptions Ouvertes 2026</h3>
              <p className="text-xs text-primary-foreground/90 leading-relaxed">
                Les places dans nos cohortes d'excellence sont limitées. Remplissez le formulaire de préinscription pour bénéficier d'un entretien personnalisé.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2 card-premium p-8 rounded-2xl bg-surface border border-border">
            {/* Tabs selector */}
            <div className="flex p-1 rounded-xl bg-muted mb-8">
              <button
                type="button"
                onClick={() => { setTab("contact"); setFormErrors({}); }}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-smooth",
                  tab === "contact"
                    ? "bg-surface-elevated text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Message Général
              </button>
              <button
                type="button"
                onClick={() => { setTab("admission"); setFormErrors({}); }}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-smooth",
                  tab === "admission"
                    ? "bg-surface-elevated text-foreground shadow-sm"
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
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
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
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
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
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
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
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
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
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth resize-none"
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
                <form onSubmit={handleAdmissionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nom complet de l'élève <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={admissionData.name}
                      onChange={(e) => setAdmissionData({ ...admissionData, name: e.target.value })}
                      placeholder="Nom et Prénom"
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                    />
                    {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name.join(', ')}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={admissionData.email}
                        onChange={(e) => setAdmissionData({ ...admissionData, email: e.target.value })}
                        placeholder="eleve@exemple.com"
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                      {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email.join(', ')}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Téléphone / WhatsApp <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={admissionData.phone}
                        onChange={(e) => setAdmissionData({ ...admissionData, phone: e.target.value })}
                        placeholder="+243 970 000 000"
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                      {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone.join(', ')}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Formation souhaitée</label>
                    <select
                      value={admissionData.program_id}
                      onChange={(e) => setAdmissionData({ ...admissionData, program_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                    >
                      <option value="">-- Sélectionner une formation --</option>
                      {programsData && Array.isArray(programsData) && programsData.map((prog: any) => (
                        <option key={prog.id} value={prog.id}>
                          {prog.title} ({prog.duration || "Formation"})
                        </option>
                        ))}
                      <option value="conseil">Conseil d'orientation / À définir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message ou remarques (optionnel)</label>
                    <textarea
                      rows={4}
                      value={admissionData.message}
                      onChange={(e) => setAdmissionData({ ...admissionData, message: e.target.value })}
                      placeholder="Parlez-nous de vos objectifs d'études ou posez vos questions..."
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={admissionMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-spring disabled:opacity-50"
                  >
                    {admissionMutation.isPending ? "Soumission en cours..." : "Soumettre la Préinscription"}
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
