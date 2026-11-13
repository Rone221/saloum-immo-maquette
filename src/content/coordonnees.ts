// Coordonnées et navigation, sans source ni statut : ce module est importé par les
// composants client (menu mobile, liens de navigation, lien WhatsApp). Tout ce
// qu'il exporte part dans le JavaScript envoyé au navigateur : il ne contient
// que les chaînes affichées, jamais un `Fait`. Les faits, avec leur source et leur
// statut, sont dans site.ts, qui reprend ces valeurs.

export type Rubrique = { numero: string; libelle: string; href: string };

/** Ordre et libellés fixes (3.1). */
export const NAVIGATION: Rubrique[] = [
  { numero: "01", libelle: "Terrains", href: "/terrains/" },
  { numero: "02", libelle: "Aménager mon terrain", href: "/amenager/" },
  { numero: "03", libelle: "Comprendre le foncier", href: "/foncier/" },
  { numero: "04", libelle: "Diaspora", href: "/diaspora/" },
  { numero: "05", libelle: "À propos", href: "/a-propos/" },
  { numero: "06", libelle: "Contact", href: "/contact/" },
];

/** Nom de chaque page, pour la case « Page » du cartouche. */
export const NOMS_DE_PAGE: Record<string, string> = {
  "/": "Accueil",
  "/terrains/": "Terrains",
  "/terrains/lac-town/": "Lac Town",
  "/terrains/sakina-city/": "Sakina City",
  "/terrains/sicap-keur-massar/": "Sicap Keur Massar",
  "/terrains/recasement-aibd/": "Recasement AIBD",
  "/amenager/": "Aménager mon terrain",
  "/foncier/": "Comprendre le foncier",
  "/diaspora/": "Diaspora",
  "/a-propos/": "À propos",
  "/contact/": "Contact",
  "/mentions-legales/": "Mentions légales",
};

export type Numero = {
  /** « 77 400 75 75 » */
  court: string;
  /** « +221 77 400 75 75 » */
  long: string;
  href: string;
};

export const NUMERO_MOBILE: Numero = {
  court: "77 400 75 75",
  long: "+221 77 400 75 75",
  href: "tel:+221774007575",
};

export const NUMERO_FIXE: Numero = {
  court: "33 805 87 18",
  long: "+221 33 805 87 18",
  href: "tel:+221338058718",
};

export const ADRESSE_EMAIL = {
  adresse: "info@saloumimmo.com",
  href: "mailto:info@saloumimmo.com",
};

/** Numéro WhatsApp au format international, sans « + » (pour wa.me). */
export const WHATSAPP = "221774007575";
