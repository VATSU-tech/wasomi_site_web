import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-[var(--nav-height)] overflow-hidden bg-gradient-to-b from-transparent via-black/50 to-black/90"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center lg:text-left lg:mx-0">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="block text-[var(--secondary-color)] uppercase tracking-wider font-semibold mb-4"
          >
            L'excellence dès le début
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-[var(--primary-color)] drop-shadow-lg"
          >
            Forger les esprits de demain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0"
          >
            <span className="text-[var(--primary-color)]">WASOMI</span> une école moderne axée sur l'épanouissement, l'innovation et la réussite de chaque enfant.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Inscrivez votre enfant <ArrowRight size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#about"
              className="inline-flex secondary-btn items-center justify-center px-6 py-3 rounded-lg font-semibold text-[var(--secondary-color)] border-2 border-[var(--secondary-color)] hover:bg-white/10 transition-all drop-shadow-lg"
            >
              Découvrir l'école
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
