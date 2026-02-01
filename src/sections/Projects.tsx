const projects = [
  {
    title: "Classe Numérique",
    desc: "Équipement de toutes les classes avec des tableaux interactifs et des tablettes pour les élèves.",
    status: "En cours",
  },
  {
    title: "Jardin Pédagogique",
    desc: "Création d'un potager pour sensibiliser les enfants à la nature et à l'alimentation saine.",
    status: "Terminé",
  },
  {
    title: "Bibliothèque Moderne",
    desc: "Rénovation de la bibliothèque avec un espace lecture confortable et plus de 1000 nouveaux ouvrages.",
    status: "À venir",
  },
  {
    title: "Bâtiment",
    desc: "Construction d'un nouveau bâtiment pour accueillir plus d'élèves pour les classes secondaires.",
    status: "À venir",
  },
  {
    title: "Labo Informatique",
    status: "Terminé",
    desc: "Construction d'un d'un labo informatique pour les élèves.",
  },
  {
    title: "Labo scientifique",
    status: "En cours",
    desc: "Construction d'un d'un labo scientifique pour les élèves.",
  },
];

const Projects = () => {
  return (
    <section
      id="projects"
      style={{ background: "var(--secondary-color)", minHeight: "100vh" }}
    >
      <div className="container">
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          Nos Projets
        </h2>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>
          Voici nos projets en cours et à venir <br />
          qui vonts rendre l'école plus moderne et plus agréable pour les
          élèves.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  background:
                    project.status === "Terminé" ? "#dcfce7" : "#dbeafe",
                  color: project.status === "Terminé" ? "#166534" : "#1e40af",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                {project.status}
              </div>
              <h3 style={{ marginBottom: "1rem" }}>{project.title}</h3>
              <p style={{ color: "var(--text-light)" }}>{project.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
