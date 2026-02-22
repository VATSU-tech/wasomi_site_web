import { about_element } from "../data/content";

const About = () => {
  return (
    <section
      id="about"
      style={{ background: "var(--white)", minHeight: "100vh" }}
    >
      <div className="container">
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 4rem auto",
          }}
        >
          <h2 className="text-4xl mb-1" style={{ marginBottom: "1rem" }} data-aos="fade-up">
            Notre École, Notre Mission
          </h2>
          <p className="text-lg text-gray-600 mb-4" data-aos="fade-up" data-aos-delay="200">
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
          {about_element.map((elem)=>(
          <div
            style={{
              padding: "2rem",
              background: "var(--secondary-color)",
              borderRadius: "1rem",
            }}
            data-aos="fade-up"
            data-aos-delay={elem.delay}
            data-aos-duration="1000"
          >
            <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              {elem.title}
            </h3>
            <p>{elem.content}</p>
          </div>))}
          
            {/* <ul style={{ listStylePosition: "inside", lineHeight: "2" }}>
              <li>Excellence académique</li>
              <li>Respect et inclusion</li>
              <li>Créativité et innovation</li>
            </ul> */}
        </div>
      </div>
    </section>
  );
};

export default About;
