import { Archivo, Besley } from "next/font/google";

// Deux familles, trois voix (direction v4, « Lettres »), jamais croisées.
//
// Archivo variable (axes de graisse et de largeur, 62 à 125 %) : le texte en largeur
// normale ; la voix technique en large et en chiffres tabulaires (`mesure`,
// `etiquette` : TF 15026/R, 150 m², les têtes de section) ; l'étroit gras pour les
// numéros peints sur les bornes.
export const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable", // obligatoire avec un axe en plus
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

// Besley variable (graisse 400 à 900, on ne sert que la 400) : les titres. Une
// égyptienne, la lettre des plans et des actes. L'italique sert à la devise du client
// et à elle seule. Jamais un paragraphe en Besley.
export const besley = Besley({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-besley",
  display: "swap",
});
