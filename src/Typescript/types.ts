export interface type_element{
    title: string
    content: string
    delay: number
}
export type motivation_icon = "Star" | "Heart" | "Shield" | "Cpu" | "Medal" | "Bus";
export interface motivation {
    icon: motivation_icon;
    iconColor: string;
    title : string;
    delay : number;
    text : string;
}
export interface type_projects {
    title: string
    desc: string
    delay: number
    status: "En cours" | "Terminé" | "À venir"
}
export interface type_partner {
  name: string;
  description: string;
  website: string;
  color: string;
  image: string;
  delay: number;
}

export interface type_gallery_image {
  id: number;
  src: string;
  category: string;
  delay: number;
  title: string;
}

export type hero_action_variant = "primary" | "secondary";
export interface type_hero_action {
  label: string;
  href: string;
  delay: number;
  variant: hero_action_variant;
  icon?: "arrow-right";
}

export interface type_hero_content {
  eyebrow: string;
  title: string;
  description: {
    before: string;
    highlight: string;
    after: string;
  };
  delays: {
    eyebrow: number;
    title: number;
    description: number;
  };
}

export type contact_icon =
  | "Mail"
  | "Phone"
  | "MapPin"
  | "Calendar"
  | "Whatsapp"
  | "Facebook"
  | "XTwitter"
  | "Instagram"
  | "Tiktok";

export type contact_content =
  | { type: "link"; label: string; href: string; hover?: string; newTab?: boolean }
  | { type: "text"; label: string };

export interface type_contact_item {
  icon: contact_icon;
  delay: number;
  content: contact_content[];
}

export interface type_contact_form_field {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "textarea";
  rows?: number;
  delay: number;
}
