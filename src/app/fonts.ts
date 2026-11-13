import { Archivo } from "next/font/google";

// Une seule famille (recherche/allegement.md, 2.4) : Archivo variable, axes de
// graisse et de largeur (62 à 125 %). Deux largeurs servent : 75 % pour h1 et h2,
// 100 % pour tout le reste.
export const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable", // obligatoire avec un axe en plus
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
