import { Star, Heart, Shield, Cpu, Medal, Bus } from "lucide-react";

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
  {
    icon: <Cpu size={32} color="#10b9f1" />,
    title: "Technologie de pointe",
    text: "Des outils modernes pour accompagner les enfants dans leur apprentissage.",
  },
  {
    icon: <Medal size={32} color="#a9a911" />,
    title: "Vie sportive",
    text: "Des activités sportives pour développer le corps et l'esprit.",
  },
  {
    icon: <Bus size={32} color="#6f6f6f" />,
    title: "Transport securiser",
    text: "Des bus pour le transport securiser de vos enfant en toute cisronstance et en toute intemperie",
  },
];

const Motivation = () => {
  return (
    <section
      id="motivation"
      style={{ background: "var(--white)", minHeight: "100vh" }}
    >
      <div className="container">
        <h2
          data-aos="fade-up"
          data-aos-duration="800"
          style={{
            fontSize: "2.5rem",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          Pourquoi choisir{" "}
          <span style={{ color: "var(--primary-color)" }}>WASOMI</span> ?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
          }}
        >
          {reasons.map((item, index) => (
            <div
              key={index}
              data-aos="zoom-in-up"
              data-aos-delay={index * 120}
              data-aos-duration="700"
              style={{ textAlign: "center", padding: "1rem" }}
            >
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
      </div>
    </section>
  );
};

export default Motivation;
