import {
  Star,
  Heart,
  Shield,
  Cpu,
  Medal,
  Bus,
  type LucideIcon,
} from "lucide-react";
import { motivation_element } from "../data/content";
import { motivation } from "../Typescript/types";

const iconMap: Record<motivation["icon"], LucideIcon> = {
  Star,
  Heart,
  Shield,
  Cpu,
  Medal,
  Bus,
};

const Motivation = () => {
  return (
    <section
      id="motivation"
      style={{ background: "var(--white)", minHeight: "100vh" }}
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
          {motivation_element.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={index}
                data-aos="zoom-in-up"
                data-aos-delay={item.delay}
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
                  <Icon size={32} color={item.iconColor} />
                </div>
                <h3 style={{ marginBottom: "1rem" }}>{item.title}</h3>
                <p style={{ color: "var(--text-light)" }}>{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Motivation;
