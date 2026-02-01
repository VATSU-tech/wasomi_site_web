import { Mail, Phone, MapPin, Calendar } from "lucide-react";

const Contact = () => {
  const contact = [
    {
      icon: <Mail size={32} color="var(--primary-color)" />,
      content: "cswasomi@gmail.com",
    },
    {
      icon: <Phone size={32} color="var(--primary-color)" />,
      content: "+243 812 227 787, +243 998 862 270",
    },
    {
      icon: <MapPin size={32} color="var(--primary-color)" />,
      content: "Beni, Com.Bungulu Q.Residentiel 5rue SIVIRWA",
    },
    {
      icon: <Calendar size={32} color="var(--primary-color)" />,
      content: "Lundi - Vendredi : 7h30 - 16h00",
    },
    {
      icon: <i style={{color: "var(--primary-color)"}} className="fa-brands fa-whatsapp text-3xl"></i>,
      content: "+243 812 227 787",
    },
    {
      icon: <i style={{color: "var(--primary-color)"}} className="fa-brands fa-facebook text-3xl"></i>,
      content: "complexe scolaire wasomi",
    },
    {
      icon: <i style={{color: "var(--primary-color)"}} className="fa-brands fa-x-twitter text-3xl"></i>,
      content: "@wasomi_edu",
    },
    {
      icon: <i style={{color: "var(--primary-color)"}} className="fa-brands fa-instagram text-3xl"></i>,
      content: "@wasomi_edu",
    },
    {
      icon: <i style={{color: "var(--primary-color)"}} className="fa-brands fa-tiktok text-3xl"></i>,
      content: "cs_wasomi",
    },
  ];
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
          <div>
            <h2
              style={{
                fontSize: "2.5rem",
                marginBottom: "2rem",
                color: "white",
              }}
            >
              Contactez-nous
            </h2>
            <p style={{ marginBottom: "2rem", color: "#94a3b8" }}>
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
              {contact.map((item, index) => (
                <div className="flex gap-1 items-center" key={index}>
                  {item.icon}
                  <span >{item.content}</span>
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
            style={{
              background: "#334155",
              padding: "2rem",
              borderRadius: "1rem",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Nom Complet
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#475569",
                  color: "white",
                }}
                placeholder="Votre nom"
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Email
              </label>
              <input
                type="email"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#475569",
                  color: "white",
                }}
                placeholder="votre@email.com"
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Message
              </label>
              <textarea
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#475569",
                  color: "white",
                }}
                placeholder="Comment pouvons-nous vous aider ?"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
            >
              Envoyer le message
            </button>
          </form>
        </div>

        <footer
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
