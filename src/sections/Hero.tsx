import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="hero"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        paddingTop: "var(--nav-height)",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <span
            style={{
              color: "var(--primary-color)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
              display: "block",
            }}
          >
            L'excellence dès le début
          </span>
          <h1
            style={{
              fontSize: "3.5rem",
              marginBottom: "1.5rem",
              lineHeight: "1.1",
            }}
          >
            Forger les esprits de demain
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--text-light)",
              marginBottom: "2rem",
            }}
          >
            Une école moderne axée sur l'épanouissement, l'innovation et la
            réussite de chaque enfant.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a
              href="#contact"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              Inscrivez votre enfant <ArrowRight size={20} />
            </a>
            <a
              href="#about"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
              }}
            >
              Découvrir l'école
            </a>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            height: "400px",
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#cbd5e1",
          }}
        >
          {/* Placeholder for School Image */}
          <div style={{ textAlign: "center" }}>
            <p>Illustration de l'école</p>
            <small>(Image path: /assets/school-hero.jpg)</small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
