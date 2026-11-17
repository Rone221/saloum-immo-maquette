// Petits outils de l'espace client de démonstration : dates d'une demande, nombres,
// classes des boutons. Sans état, pour le serveur comme pour le navigateur.

import { BOUTON_CONTOUR, BOUTON_FORME, BOUTON_PLEIN, BOUTON_VRAI } from "@/lib/classes";
import { dateLongue } from "@/lib/format";

/** Espace insécable, puis espace fine insécable : écrites par leur code, pour qu'un éditeur ne les perde pas. */
export const INSECABLE = " ";
export const FINE = " ";

/** 12564 devient « 12 564 », avec l'espace fine du site. Écrit à la main : le serveur et le navigateur donnent la même chaîne. */
export function nombre(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, FINE);
}

/** 0,274 devient « 27 % ». Jamais de décimale : une part de démonstration n'est pas si précise. */
export function pourCent(part: number): string {
  return `${Math.round(part * 100)}${INSECABLE}%`;
}

/** 2,6 : un nombre à une décimale, avec sa virgule. */
export function decimale(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

/** « 2026-11-16 » devient « 16 novembre » : le jour et le mois, sans l'année (un axe, une période). */
export function jourMois(iso: string): string {
  return dateLongue(iso).replace(/ \d{4}$/, "");
}

/**
 * Le jour et l'heure d'une demande, à l'heure de qui lit : « 17 novembre 2026 » et
 * « 14 h 05 ». Les mêmes mots que le récépissé de la fiche de demande.
 */
export function jourEtHeure(iso: string): { jour: string; heure: string } {
  const d = new Date(iso);
  const deux = (n: number) => String(n).padStart(2, "0");
  return {
    jour: dateLongue(`${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`),
    heure: `${d.getHours()}${INSECABLE}h${INSECABLE}${deux(d.getMinutes())}`,
  };
}

/**
 * Les boutons de l'espace client, sur de vrais <button> : les habits du bouton du site
 * (components/boutons.tsx), sans l'aimant. Ici on travaille, le bouton ne bouge pas.
 */
export const BOUTON = `${BOUTON_FORME} ${BOUTON_VRAI} min-h-11 px-5 py-2 transition-surface`;
export { BOUTON_CONTOUR, BOUTON_PLEIN };
