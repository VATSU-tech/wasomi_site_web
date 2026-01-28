import React from "react";
import { Star, Heart, Shield } from "lucide-react";

const reasons = [
  {
    icon: <Star size={32} color="var(--accent-color)" />,
    title: "Excellence Pédagogique",
    text: "Un programme enrichi qui dépasse les standards, préparant les enfants aux défis futurs.",
  },
  {
    icon: <Heart size={32} color="var(--primary-color)" />,
    title: "Suivi Personnalisé",
    text: "Chaque enfant est unique. Nous adaptons notre approche pour répondre aux besoins de chacun.",
  },
  {
    icon: <Shield size={32} color="#10b981" />,
    title: "Cadre Sécurisé",
    text: "Un environnement bienveillant et sécurisé où votre enfant peut s'épanouir en toute confiance.",
  },
];

const Motivation = () => {
  return (
    <section id="motivation" style={{ background: "var(--white)" }}>
      <div className="container">
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          Pourquoi choisir Vision Future ?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
          }}
        >
          {reasons.map((item, index) => (
            <div key={index} style={{ textAlign: "center", padding: "1rem" }}>
              <div
                style={{
                  background: "var(--secondary-color)",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ marginBottom: "1rem" }}>{item.title}</h3>
              <p style={{ color: "var(--text-light)" }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "4rem",
            textAlign: "center",
            background: "var(--primary-color)",
            color: "white",
            padding: "3rem",
            borderRadius: "1rem",
          }}
        >
          <h3 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>
            Prêts à nous rejoindre ?
          </h3>
          <p
            style={{
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
            }}
          >
            Offrez à votre enfant le meilleur départ dans la vie. Les
            inscriptions pour la prochaine rentrée sont ouvertes.
          </p>
          <a
            href="#contact"
            className="btn-primary"
            style={{
              background: "white",
              color: "var(--primary-color)",
              textDecoration: "none",
              padding: "1rem 2rem",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Contacter l'administration
          </a>
        </div>
      </div>
    </section>
  );
};

export default Motivation;
