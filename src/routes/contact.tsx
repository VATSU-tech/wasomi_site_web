import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Wasomi" },
      {
        name: "description",
        content:
          "Contactez l'école Wasomi. Notre équipe vous répond sous 24h ouvrées.",
      },
      { property: "og:title", content: "Contact — Wasomi" },
      { property: "og:description", content: "Contactez-nous." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

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
            Une question, un projet, une candidature ? On vous répond au plus
            vite.
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
                value: "123 Avenue de l'Éducation, Kinshasa",
              },
              { icon: Phone, title: "Téléphone", value: "+243 000 000 000" },
              { icon: Mail, title: "Email", value: "contact@wasomi.school" },
            ].map((c) => (
              <div
                key={c.title}
                className="p-5 rounded-2xl glass hover:shadow-glow transition-spring flex items-start gap-4"
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
              </div>
            ))}
          </div>

          {/* Form */}
          <form
            className="lg:col-span-3 p-8 rounded-2xl glass shadow-elegant"
            data-aos="fade-left"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="size-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4 animate-glow-pulse">
                  <CheckCircle2 className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold">
                  Message envoyé !
                </h3>
                <p className="text-muted-foreground mt-2">
                  Nous revenons vers vous très vite.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-semibold text-primary hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Nom" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>
                <Field label="Sujet" name="subject" />
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:shadow-glow focus:outline-none transition-smooth resize-none"
                    placeholder="Votre message..."
                  />
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-spring"
                >
                  Envoyer le message
                  <Send className="size-4" />
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-2">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:shadow-glow focus:outline-none transition-smooth"
      />
    </div>
  );
}
