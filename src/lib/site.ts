// Coordonnées publiques de Saloum Immo (affiches 2026, LinkedIn, ancien site).
// À confirmer avec le client : fixe (805 ou 807), horaires, adresse exacte.
export const CONTACT = {
  whatsapp: "221774007575",
  phoneDisplay: "+221 77 400 75 75",
  phoneHref: "tel:+221774007575",
  phone2Display: "+221 77 624 62 60",
  phone2Href: "tel:+221776246260",
  landlineDisplay: "+221 33 805 87 18",
  landlineHref: "tel:+221338058718",
  email: "info@saloumimmo.com",
  address: "Paradise City, Sangalkam",
  city: "Dakar, Sénégal",
  hours: "Du lundi au samedi, de 9 h à 18 h",
  socials: {
    instagram: "https://www.instagram.com/saloum_immo/",
    tiktok: "https://www.tiktok.com/@saloum_imo",
    youtube: "https://www.youtube.com/@saloumimobat",
    linkedin: "https://www.linkedin.com/company/saloum-immo/",
  },
} as const;

export function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const WA_DEFAULT = waLink(
  "Bonjour Saloum Immo, je souhaite des informations sur vos terrains disponibles.",
);

export const NAV = [
  { href: "/terrains", label: "Terrains" },
  { href: "/construire", label: "Construire" },
  { href: "/diaspora", label: "Diaspora" },
  { href: "/guide-foncier", label: "Guide foncier" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=78`;
}

export function fcfa(n: number) {
  return `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;
}

export function fcfaShort(n: number) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(m)} M FCFA`;
  }
  return fcfa(n);
}
