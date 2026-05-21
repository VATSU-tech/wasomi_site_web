import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Twitter, Mail, MessageCircleCheck } from "lucide-react";
import {
  staffCategoryOrder,
  staffMembers,
  type StaffMember,
} from "@/data/staff";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Équipe — Wasomi" },
      {
        name: "description",
        content:
          "Rencontrez les enseignants, mentors et experts qui font la richesse de Wasomi.",
      },
      { property: "og:title", content: "Équipe — Wasomi" },
      { property: "og:description", content: "L'équipe Wasomi." },
    ],
  }),
  component: EquipePage,
});

const sortedStaff = [...staffMembers].sort((a, b) => {
  const byCategory =
    staffCategoryOrder.indexOf(a.category) -
    staffCategoryOrder.indexOf(b.category);
  if (byCategory !== 0) return byCategory;
  return a.order - b.order;
});

function EquipePage() {
  return (
    <>
      <section className="relative bg-hero py-20">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container mx-auto px-4 max-w-7xl relative text-center">
          <h1
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Notre <span className="text-gradient">équipe</span>
          </h1>
          <p
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Des enseignants passionnés, des mentors expérimentés, une communauté
            engagée.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStaff.map((member, i) => (
            <StaffCard key={member.id} member={member} delay={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function StaffCard({ member, delay }: { member: StaffMember; delay: number }) {
  return (
    <article
      data-aos="fade-up"
      data-aos-delay={(delay % 3) * 80}
      className="group relative rounded-2xl overflow-hidden bg-card shadow-elegant hover:shadow-glow transition-spring hover:-translate-y-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="size-full object-cover transition-spring group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-display text-xl font-bold">{member.name}</h3>
          <p className="text-sm text-primary font-semibold mt-1">
            {member.role}
          </p>
          <p className="text-xs text-muted-foreground/90 mt-1">
            {member.qualification}
          </p>
          <p className="text-sm text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all duration-500">
            {member.bio}
          </p>
          <div className="flex gap-2 mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-spring">
            {[
              {
                icon: MessageCircleCheck,
                href: member.linkedin,
                label: `LinkedIn de ${member.name}`,
              },
              {
                icon: Twitter,
                href: member.facebook,
                label: `Facebook de ${member.name}`,
              },
              {
                icon: Mail,
                href: member.email,
                label: `Email de ${member.name}`,
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href || "#"}
                aria-label={label}
                className="size-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
