import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, GraduationCap } from "lucide-react";
import { useContactMutation, useAdmissionMutation, usePublicSettingsQuery } from "@/hooks/useWasomiApi";
import { authStore } from "@/store/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { toast } from "sonner";
import { z } from "zod";

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
  phone: z.string().min(6, "Téléphone requis"),
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
  const [admissionData, setAdmissionData] = useState({ name: "", email: "", phone: "", message: "" });
  
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const contactMutation = useContactMutation();
  const admissionMutation = useAdmissionMutation();
  const { data: settings } = usePublicSettingsQuery();

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
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-4xl relative text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Parlons <span className="text-gradient">ensemble</span>
          </h1>
          <p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Une question, un projet ou une demande de préinscription ? Notre équipe vous répond au plus vite.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-4" data-aos="fade-right">
            {[
              {
                icon: MapPin,
                title: "Adresse",
                value: settings?.address ?? "5 Rue Sivirwa Q.Residentiel, C.Bungulu, Beni",
                link: "https://maps.app.goo.gl/B5W7Stfqe8WuNYVF9",
              },
              {
                icon: Phone,
                title: "Téléphone",
                value: settings?.phone ?? "+243 997 742 651",
                link: `tel:${(settings?.phone ?? "+243 997 742 651").replace(/\s+/g, '')}`,
              },
              {
                icon: Mail,
                title: "Email",
                value: settings?.email ?? "cswasomi@gmail.com",
                link: `mailto:${settings?.email ?? "cswasomi@gmail.com"}`,
              },
            ].map((c) => (
              <a
                key={c.title}
                href={c.link}
                target="_blank"
                className="p-5 rounded-2xl glass hover:shadow-glow hover:border-primary transition-spring flex items-start gap-4"
              >
                <div className="size-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
                  <c.icon className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {c.title}
                  </div>
                  <div className="font-medium mt-1">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form container */}
          <div className="lg:col-span-3 p-8 rounded-2xl glass shadow-elegant" data-aos="fade-left">
            {/* Tab switchers */}
            <div className="flex gap-2 p-1.5 bg-surface-elevated rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setTab("contact"); setFormErrors({}); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-smooth ${
                  tab === "contact"
                    ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Message de contact
              </button>
              <button
                type="button"
                onClick={() => { setTab("admission"); setFormErrors({}); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-smooth flex items-center justify-center gap-2 ${
                  tab === "admission"
                    ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="size-4" />
                Préinscription
              </button>
            </div>

            {/* General Server Error Banner */}
            {(contactMutation.isError || admissionMutation.isError) && (
              <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3">
                <AlertCircle className="size-5 shrink-0" />
                <p className="text-sm">
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
                    Message envoyé avec succès !
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Notre équipe vous recontactera sous 24h ouvrées.
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
                <form onSubmit={handleContactSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Nom <span className="text-primary">*</span></label>
                      <input
                        type="text"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                      {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name.join(', ')}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email <span className="text-primary">*</span></label>
                      <input
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                      {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email.join(', ')}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Sujet</label>
                      <input
                        type="text"
                        value={contactData.subject}
                        onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Message <span className="text-primary">*</span></label>
                    <textarea
                      required
                      rows={5}
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      placeholder="Expliquez-nous votre demande..."
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth resize-none"
                    />
                    {formErrors.message && <p className="text-xs text-destructive mt-1">{formErrors.message.join(', ')}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-spring disabled:opacity-50"
                  >
                    {contactMutation.isPending ? "Envoi en cours..." : "Envoyer le message"}
                    <Send className="size-4" />
                  </button>
                </form>
              )
            )}

            {/* TAB 2: ADMISSION */}
            {tab === "admission" && (
              sentAdmission ? (
                <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                  <div className="size-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4">
                    <CheckCircle2 className="size-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Demande de préinscription enregistrée !
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Nous avons bien reçu votre dossier de préinscription et prendrons contact très prochainement.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSentAdmission(false); setAdmissionData({ name: "", email: "", phone: "", message: "" }); }}
                    className="mt-6 text-sm font-semibold text-primary hover:underline"
                  >
                    Soumettre une autre préinscription
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAdmissionSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Nom complet <span className="text-primary">*</span></label>
                    <input
                      type="text"
                      required
                      value={admissionData.name}
                      onChange={(e) => setAdmissionData({ ...admissionData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                    />
                    {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name.join(', ')}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email <span className="text-primary">*</span></label>
                      <input
                        type="email"
                        required
                        value={admissionData.email}
                        onChange={(e) => setAdmissionData({ ...admissionData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                      {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email.join(', ')}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Téléphone <span className="text-primary">*</span></label>
                      <input
                        type="tel"
                        required
                        value={admissionData.phone}
                        onChange={(e) => setAdmissionData({ ...admissionData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth"
                      />
                      {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone.join(', ')}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Précisions ou questions (optionnel)</label>
                    <textarea
                      rows={4}
                      value={admissionData.message}
                      onChange={(e) => setAdmissionData({ ...admissionData, message: e.target.value })}
                      placeholder="Précisez le niveau ou la formation souhaitée..."
                      className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none transition-smooth resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={admissionMutation.isPending}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-spring disabled:opacity-50"
                  >
                    {admissionMutation.isPending ? "Soumission en cours..." : "Soumettre la préinscription"}
                    <GraduationCap className="size-4" />
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
