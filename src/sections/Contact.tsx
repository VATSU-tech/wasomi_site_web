import type { ReactNode } from "react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { contact_items, contact_form_fields } from "../data/content";
import { contact_icon, contact_content } from "../Typescript/types";

const Contact = () => {
  const iconMap: Record<contact_icon, ReactNode> = {
    Mail: <Mail size={32} color="var(--primary-color)" />,
    Phone: <Phone size={32} color="var(--primary-color)" />,
    MapPin: <MapPin size={32} color="var(--primary-color)" />,
    Calendar: <Calendar size={32} color="var(--primary-color)" />,
    Whatsapp: (
      <i
        style={{ color: "var(--primary-color)" }}
        className="fa-brands fa-whatsapp text-3xl"
      ></i>
    ),
    Facebook: (
      <i
        style={{ color: "var(--primary-color)" }}
        className="fa-brands fa-facebook text-3xl"
      ></i>
    ),
    XTwitter: (
      <i
        style={{ color: "var(--primary-color)" }}
        className="fa-brands fa-x-twitter text-3xl"
      ></i>
    ),
    Instagram: (
      <i
        style={{ color: "var(--primary-color)" }}
        className="fa-brands fa-instagram text-3xl"
      ></i>
    ),
    Tiktok: (
      <i
        style={{ color: "var(--primary-color)" }}
        className="fa-brands fa-tiktok text-3xl"
      ></i>
    ),
  };

  const renderContent = (content: contact_content[]) =>
    content.map((item, index) => {
      const isLast = index === content.length - 1;
      if (item.type === "link") {
        return (
          <span key={`${item.href}-${index}`}>
            <a
              className="linkContact hover:text-[var(--primary-color)]"
              href={item.href}
              data-hover={item.hover}
              target={item.newTab ? "_blank" : undefined}
              rel={item.newTab ? "noopener noreferrer" : undefined}
            >
              {item.label}
            </a>
            {!isLast && ", "}
          </span>
        );
      }

      return (
        <span key={`${item.label}-${index}`}>
          {item.label}
          {!isLast && ", "}
        </span>
      );
    });

  return (
    <section
      id="contact"
      style={{
        background: "rgba(30, 59, 32,.8)",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
          }}
        >
          <div data-aos="fade-up" data-aos-duration="1000">
            <h2
              data-aos="fade-up"
              data-aos-duration="1000"
              style={{
                fontSize: "2.5rem",
                marginBottom: "2rem",
                color: "white",
              }}
            >
              Contactez-nous
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="150"
              data-aos-duration="1000"
              style={{ marginBottom: "2rem", color: "#94a3b8" }}
            >
              Nous sommes à votre écoute pour toute question ou demande
              d'information. N'hésitez pas à venir nous visiter.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {contact_items.map((item, index) => (
                <div
                  className="flex gap-1 items-center"
                  key={index}
                  data-aos="fade-up-right"
                  data-aos-delay={item.delay}
                  data-aos-duration="1000"
                >
                  {iconMap[item.icon]}
                  <span>{renderContent(item.content)}</span>
                </div>
              ))}
              {/* <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <MapPin color="var(--primary-color)" />
                <span>123 Avenue de l'Éducation, Ville-Moderne</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Phone color="var(--primary-color)" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Mail color="var(--primary-color)" />
                <span>contact@visionfuture.edu</span>
              </div> */}
            </div>
          </div>

          <form
            data-aos="fade-up"
            data-aos-duration="1000"
            style={{
              background: "#334155",
              padding: "2rem",
              borderRadius: "1rem",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            {contact_form_fields.map((field) => (
              <div
                key={field.name}
                style={{ marginBottom: field.type === "textarea" ? "2rem" : "1rem" }}
                data-aos="fade-up"
                data-aos-delay={field.delay}
                data-aos-duration="1000"
              >
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={field.rows ?? 4}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "#475569",
                      color: "white",
                      minHeight: "180px",
                      resize: "none",
                    }}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "#475569",
                      color: "white",
                    }}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            <button
              data-aos="zoom-in"
              data-aos-delay="450"
              data-aos-duration="1000"
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
            >
              Envoyer le message
            </button>
          </form>
        </div>

        <footer
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--primary-color)",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          <p>&copy; 2026 WASOMI. Tous droits réservés.</p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
