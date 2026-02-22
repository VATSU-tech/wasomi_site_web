import { ExternalLink } from "lucide-react";

interface Partner {
  name: string;
  description: string;
  website: string;
  color: string;
  image: string;
}

const partners: Partner[] = [
  {
    name: "Code Club",
    description: "Réseau mondial de clubs de code gratuits pour les enfants.",
    website: "https://codeclub.org",
    color: "var(--primary-color)", // Emerald
    image: "https://imgs.search.brave.com/zyJUA0y577312Fu8sjKmey1VDU-t_pt4Px2MwNm7ggs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29kaW5na2lkcy1h/ZnJpY2EuY29tL2Fm/cmljYW4tY2hpbGRy/ZW4tbGVhcm5pbmct/Y29kaW5nLXdpdGgt/Y29tcHV0ZXJzLWlu/LmpwZw", // Emerald
  },
  {
    name: "Raspberry Pi",
    description:
      "Ordinateurs abordables et logiciels pour l'apprentissage de la programmation.",
    website: "https://www.raspberrypi.org",
    color: "#F52202", // Amber
    image: "https://imgs.search.brave.com/KQB5cqeaW6IP9XKF4wrIIBctOkaMx3ZbxUXMUytgGGk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bG9nby53aW5lL2Ev/bG9nby9SYXNwYmVy/cnlfUGkvUmFzcGJl/cnJ5X1BpLUxvZ28u/d2luZS5zdmc", // Raspberry pink
  },
  {
    name: "Beni Futur",
    description: "Promouvoir l'innovation et la technologie à Beni.",
    website: "https://benifutur.com",
    color: "#3B82F6", // Blue
    image: "https://imgs.search.brave.com/BwQDpfKWmZeEn40wGNjYEXrEM6BhYvrexsmbIHHilc8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dGhlb3JnLmNvbS8x/MDRlNTgwZS0zZTQx/LTRiNWYtOTM4My02/NmVhZDU4NjVkZjRf/dGh1bWIuanBn", // Blue
  },
  {
    name: "Tech Education",
    description: "Partenaire pour l'excellence éducative technologique.",
    website: "https://techeducation.com",
    color: "#F59E0B", // Amber
    image: "https://imgs.search.brave.com/zB0Uc_45ELhN_kTOtwjZRZziyw7qFDbeBW0RfeFGaGY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTIv/Mzg0LzMwMy9zbWFs/bC90ZWNoLWJvb2st/ZWR1Y2F0aW9uLWxv/Z28tdmVjdG9yLmpw/Zw", // Amber
  },
  {
    name: "Science Pour Tous",
    description: "Vulgarisation scientifique et accès aux ressources.",
    website: "https://sciencepourtous.fr",
    color: "#8B5CF6", // Violet
    image: "https://imgs.search.brave.com/qWWNiYJhRZCxPUL0fNywaqL88P67pGh_YiM4Rgo2sGE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdGV1cnMtcHJl/bWl1bS9jZXJjbGUt/YmxldS1tb3Qtc2Np/ZW5jZS1kZXNzdXNf/NTU0NjgyLTExNjYw/LmpwZz9zZW10PWFp/c19zZV9lbnJpY2hl/ZCZ3PTc0MCZxPTgw", // Violet
  },
  {
    name: "Innov Lab",
    description: "Laboratoire d'innovation pour les jeunes créateurs.",
    website: "https://innovlab.fr",
    color: "#252E0B", // Amber
    image: "https://search.brave.com/images?q=innov+lab+logo&context=W3sic3JjIjoiaHR0cHM6Ly9pbWcuZnJlZXBpay5jb20vcHJlbWl1bS12ZWN0b3IvaW5ub3ZhdGlvbi1sb2dvLWxhYi1jcmVhdGl2ZS1kZXNpZ24tcm9ja2V0LXNjaWVuY2UtZGVzaWduLXRlbXBsYXRlXzY2OTc5NC0zNTYuanBnP3NlbXQ9YWlzX2h5YnJpZCZ3PTc0MCZxPTgwIiwidGV4dCI6IlZlY3RvciBpbm5vdmF0aW9uIGxvZ28gbGFiIGNyZWF0aXZlIGRlc2lnbiByb2NrZXQgc2NpZW5jZSBkZXNpZ24gdGVtcGxhdGUiLCJwYWdlX3VybCI6Imh0dHBzOi8vd3d3LmZyZWVwaWsuY29tL3ZlY3RvcnMvaW5ub3ZhdGlvbi1sYWItbG9nbyJ9XQ%3D%3D&sig=caade06a2d094a9dc42fa0a6719da33f3fd1f61bce285321cb7450b8b77dbfe7&nonce=11e04c7629273e7464c8d89f31f0bfd4",
  },
];

const Partners = () => {
  return (
    <section id="partners" className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div
          data-aos="fade-up"
          data-aos-duration="800"
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
          {partners.map((partner, index) => (
            <div
              style={{ border: `2px solid ${partner.color}` }}
              key={index}
              data-aos="zoom-in-up"
              data-aos-delay={index * 80}
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
