import { ArrowRight } from "lucide-react";

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
            data-aos-delay="100"
            data-aos-duration="700"
            className="block text-[var(--secondary-color)] uppercase tracking-wider font-semibold mb-4"
          >
            L'excellence dès le début
          </span>
          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="900"
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-[var(--primary-color)] drop-shadow-lg"
          >
            Forger les esprits de demain
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="320"
            data-aos-duration="850"
            className="text-xl text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0"
          >
            <span className="text-[var(--primary-color)]">WASOMI</span> une école moderne axée sur l'épanouissement, l'innovation et la réussite de chaque enfant.
          </p>
          <div
            data-aos="zoom-in-up"
            data-aos-delay="450"
            data-aos-duration="800"
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="#contact"
              data-aos="fade-right"
              data-aos-delay="520"
              data-aos-duration="700"
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Inscrivez votre enfant <ArrowRight size={20} />
            </a>
            <a
              href="#about"
              data-aos="fade-left"
              data-aos-delay="620"
              data-aos-duration="700"
              className="inline-flex secondary-btn items-center justify-center px-6 py-3 rounded-lg font-semibold text-[var(--secondary-color)] border-2 border-[var(--secondary-color)] hover:bg-white/10 transition-all drop-shadow-lg"
            >
              Découvrir l'école
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
