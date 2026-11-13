import { Archivo, IBM_Plex_Mono } from "next/font/google";

// Archivo variable, axes de graisse et de largeur (62 à 125 %).
// Trois largeurs servent : 72 % (titres), 85 % (sous-titres), 100 % (texte).
export const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable", // obligatoire avec un axe en plus
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Mono : cotes, numéros de lots, dates, étiquettes de six mots au plus.
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
