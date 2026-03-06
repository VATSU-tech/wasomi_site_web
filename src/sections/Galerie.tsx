import { Plus } from "lucide-react";
import { gallery_images } from "../data/content";

export default function Galerie() {
  return (
    <section className="py-20 bg-slate-50 min-h-screen" id="galerie">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-4xl font-bold text-[var(--text-color)] mb-4"
          >
            Notre Galerie
          </h2>
          <div
            data-aos="zoom-in"
            data-aos-delay="150"
            data-aos-duration="650"
            className="h-1 w-20 bg-[var(--primary-color)] mx-auto rounded-full"
          />
          <p
            data-aos="fade-up"
            data-aos-delay="240"
            data-aos-duration="800"
            className="text-[var(--text-light)] mt-4 max-w-2xl mx-auto"
          >
            Découvrez en images la vie quotidienne, les événements marquants et
            l'atmosphère unique de notre établissement.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery_images.map((image) => (
            <div
              key={image.id}
              data-aos="fade-up"
              data-aos-delay={image.delay}
              data-aos-duration="750"
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:p-2 p-5 group-hover:scale-110"
                />
              </div>

              {/* Hover Badge */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Voir la photo
                </span>
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
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div
          data-aos="fade-up"
          data-aos-delay="500"
          data-aos-duration="700"
          className="text-center mt-12"
        >
          {/* <button className="btn-primary rounded-full m-4 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all">
            Voir plus de photos
          </button> */}
        </div>
      </div>
    </section>
  );
}
