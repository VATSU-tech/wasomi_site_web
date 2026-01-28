import React from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--nav-height)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--primary-color)",
          }}
        >
          Vision Future
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: "none", gap: "2rem" }}>
          {/* We will toggle display via media queries in CSS if we had them or inline styles logic */}
          <a href="#hero">Accueil</a>
          <a href="#about">À propos</a>
          <a href="#projects">Projets</a>
          <a href="#motivation">Parents</a>
          <a href="#contact" className="btn-primary">
            Contact
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: "transparent", color: "var(--text-color)" }}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Simple Mobile Menu Implementation */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "var(--nav-height)",
            left: 0,
            right: 0,
            background: "white",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        >
          <a href="#hero" onClick={() => setIsOpen(false)}>
            Accueil
          </a>
          <a href="#about" onClick={() => setIsOpen(false)}>
            À propos
          </a>
          <a href="#projects" onClick={() => setIsOpen(false)}>
            Projets
          </a>
          <a href="#motivation" onClick={() => setIsOpen(false)}>
            Parents
          </a>
          <a href="#contact" onClick={() => setIsOpen(false)}>
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
