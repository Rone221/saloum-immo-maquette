import { WHATSAPP } from "@/content/coordonnees";

/**
 * Lien WhatsApp vers le numéro de Saloum Immo, avec un message pré-rempli.
 * Le texte n'est affiché que sur la page Contact (allegement.md, 2.9).
 */
export function waHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
