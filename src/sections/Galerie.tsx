import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
    category: "Classe",
    title: "Apprentissage Interactif",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    category: "Environnement",
    title: "Notre Campus",
  },
  {
    id: 3,
    src: "https://imgs.search.brave.com/FETcMZeglQLQ5T5Ls-aPFKD4Ws7InL1cPxCQyCz-ak0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9vcmRp/bmF0ZXVyLWQtZW5z/ZWlnbmVtZW50LTQt/ODE5OTg0Ny5qcGc",
    category: "Technologie",
    title: "Salle Informatique",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    category: "Activités",
    title: "Sport & Loisirs",
  },
  {
    id: 5,
    src: "https://imgs.search.brave.com/kVP-w4Bd2_JgG5c_158btmiBS6RieuwuE6leX_v9QaQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vc3RvY2ticm9r/ZXIvc3RvY2ticm9r/ZXIxNzA5L3N0b2Nr/YnJva2VyMTcwOTAw/Mjk0Lzg1MjgwMzQx/LWVuZmFudHMtbGV2/YW50LWxlcy1tYWlu/cy1hdS1jb3Vycy1k/ZS1sYS1sZSVDMyVB/N29uLWRlLWwtJUMz/JUE5Y29sZS1wcmlt/YWlyZS1ncm9zLXBs/YW4uanBnP3Zlcj02",
    category: "Diplômes",
    title: "Réussite Scolaire",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1536337005238-94b997371b40?auto=format&fit=crop&q=80&w=800",
    category: "Ateliers",
    title: "Créativité",
  },
];

export default function Galerie() {
  return (
    <section className="py-20 bg-slate-50 min-h-screen" id="galerie">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 5 }}
            className="text-4xl font-bold text-[var(--text-color)] mb-4"
          >
            Notre Galerie
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 w-20 bg-[var(--primary-color)] mx-auto rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[var(--text-light)] mt-4 max-w-2xl mx-auto"
          >
            Découvrez en images la vie quotidienne, les événements marquants et
            l'atmosphère unique de notre établissement.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 p-5 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[var(--primary-color)] text-sm font-bold uppercase tracking-wider mb-2 block">
                    {image.category}
                  </span>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {image.title}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white mt-2">
                    <Plus size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          {/* <button className="btn-primary rounded-full m-4 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all">
            Voir plus de photos
          </button> */}
        </motion.div>
      </div>
    </section>
  );
}
