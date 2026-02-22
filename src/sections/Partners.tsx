import { ExternalLink } from "lucide-react";
import { partners_element } from "../data/content";

const Partners = () => {
  return (
    <section id="partners" className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Nos Partenaires
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Nous collaborons avec des organisations leaders pour offrir le
            meilleur de la technologie et de l'éducation à nos élèves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners_element.map((partner, index) => (
            <div
              style={{ border: `2px solid ${partner.color}` }}
              key={index}
              data-aos="zoom-in-up"
              data-aos-delay={partner.delay}
              data-aos-duration="750"
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Image Area Placeholder */}
              <div
                className={`h-48 relative overflow-hidden border-b border-[${partner.color}]`}
                style={{ backgroundImage: `url(${partner.image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",borderBottomColor:partner.color }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <h3 className={`text-3xl font-bold text-white tracking-wider`} style={{textShadow: `2px 2px 4px ${partner.color}, 2px 2px 4px rgba(0,0,0,.4)`}}>
                    {partner.name}
                  </h3>
                </div>

                {/* Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transform  translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-slate-900 px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-slate-100"
                  >
                    {partner.website} <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              {/* Description Content */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-2">
                  {partner.name}
                </h4>
                <p className="text-slate-600 text-sm">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
