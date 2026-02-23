import { ArrowRight } from "lucide-react";
import { hero_actions, hero_content } from "../data/content";

const actionClasses = {
  primary:
    "btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all",
  secondary:
    "inline-flex secondary-btn items-center justify-center px-6 py-3 rounded-lg font-semibold text-[var(--secondary-color)] border-2 border-[var(--secondary-color)] hover:bg-white/10 transition-all drop-shadow-lg",
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-[var(--nav-height)] overflow-hidden bg-gradient-to-b from-transparent via-black/50 to-black/90"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center lg:text-left lg:mx-0">
          <span
            data-aos="fade-down"
            data-aos-delay={hero_content.delays.eyebrow}
            data-aos-duration="1000"
            className="block text-[var(--secondary-color)] uppercase tracking-wider font-semibold mb-4"
          >
            {hero_content.eyebrow}
          </span>
          <h1
            data-aos="fade-up"
            data-aos-delay={hero_content.delays.title}
            data-aos-duration="1000"
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-[var(--primary-color)] drop-shadow-lg"
          >
            {hero_content.title}
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay={hero_content.delays.description}
            data-aos-duration="1000"
            className="text-xl text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0"
          >
            {hero_content.description.before}
            <span className="text-[var(--primary-color)]">
              {hero_content.description.highlight}
            </span>
            {hero_content.description.after}
          </p>
          <div
            data-aos="zoom-in-up"
            data-aos-delay="450"
            data-aos-duration="1000"
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            {hero_actions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                data-aos="zoom-in"
                data-aos-delay={action.delay}
                data-aos-duration="1000"
                className={actionClasses[action.variant]}
              >
                {action.label}
                {action.icon === "arrow-right" ? (
                  <ArrowRight size={20} />
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
