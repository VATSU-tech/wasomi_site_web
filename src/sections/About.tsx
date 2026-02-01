
const About = () => {
  return (
    <section id="about" style={{ background: "var(--white)",minHeight:"100vh" }}>
      <div className="container">
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 4rem auto",
          }}
        >
          <h2 className="text-4xl mb-1" style={{marginBottom: "1rem"}}>
            Notre École, Notre Mission
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Située au cœur de la ville, notre établissement propose un
            environnement d'apprentissage stimulant où chaque élève est
            encouragé à développer son plein potentiel.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          <div
            style={{
              padding: "2rem",
              background: "var(--secondary-color)",
              borderRadius: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              Situation Actuelle
            </h3>
            <p>
              Nous accueillons aujourd'hui plus de 100 élèves dans des classes
              modernes et équipées. Notre équipe pédagogique est composée de
              professionnels passionnés et dévoués.
            </p>
          </div>
          <div
            style={{
              padding: "2rem",
              background: "var(--secondary-color)",
              borderRadius: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              Notre Vision
            </h3>
            <p>
              Devenir la référence en matière d'éducation innovante, en
              intégrant les nouvelles technologies et des méthodes
              d'apprentissage actives.
            </p>
          </div>     <div
            style={{
              padding: "2rem",
              background: "var(--secondary-color)",
              borderRadius: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              Notre Vision
            </h3>
            <p>
              Devenir la référence en matière d'éducation innovante, en
              intégrant les nouvelles technologies et des méthodes
              d'apprentissage actives.
            </p>
          </div>     <div
            style={{
              padding: "2rem",
              background: "var(--secondary-color)",
              borderRadius: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              Notre Vision
            </h3>
            <p>
              Devenir la référence en matière d'éducation innovante, en
              intégrant les nouvelles technologies et des méthodes
              d'apprentissage actives.
            </p>
          </div>
               <div
            style={{
              padding: "2rem",
              background: "var(--secondary-color)",
              borderRadius: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              Philosophie
            </h3>
            <p>
              Chaque eleve est unique et nous devons a tout prix trouver la methode d'apprentissage qui lui convient le mieux.
            </p>
          </div>
          <div
            style={{
              padding: "2rem",
              background: "var(--secondary-color)",
              borderRadius: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              Valeurs
            </h3>
            <ul style={{ listStylePosition: "inside", lineHeight: "2" }}>
              <li>Excellence académique</li>
              <li>Respect et inclusion</li>
              <li>Créativité et innovation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
