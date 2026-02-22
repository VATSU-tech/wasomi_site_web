import {projects_element} from "../data/content";

const Projects = () => {
  return (
    <section
      id="projects"
      style={{ background: "var(--secondary-color)", minHeight: "100vh" }}
    >
      <div className="container">
        <h2
          data-aos="fade-up"
          data-aos-duration="1000"
          style={{
            fontSize: "2.5rem",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          Nos Projets
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="150"
          data-aos-duration="750"
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
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
          {projects_element.map((project, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={project.delay}
              data-aos-duration="750"
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
