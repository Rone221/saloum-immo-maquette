// Typographie française et dates. Dates toujours en lettres (allegement.md, 2.4).

const NBSP = " ";
const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** « juillet » dans « 8 juillet 2026 » : un nom de mois entier, pas le début d'un mot. */
const MOIS_SUIVANT = new RegExp(`(?=(?:${MOIS.join("|")})(?![\\p{L}]))`, "u").source;

/**
 * Espaces insécables : avant « : ; ? ! », à l'intérieur des guillemets,
 * entre les groupes de chiffres (46 000, 77 400 75 75), avant une unité ou un
 * multiple (3 km, 10 millions FCFA), dans une durée (7 min 26), entre « sortie »
 * et son numéro (sortie 10), entre le jour et le mois (8 juillet, 1er juin).
 */
export function typo(texte: string): string {
  return texte
    .replace(/ ([:;?!»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) (?=\d)/g, `$1${NBSP}`)
    .replace(/(\d) (?=(?:m²|ha|km|min|h|millions?|milliards?|FCFA)(?![\p{L}]))/gu, `$1${NBSP}`)
    .replace(/\b(millions?|milliards?) (?=FCFA\b)/g, `$1${NBSP}`)
    .replace(/\bmin (?=\d)/g, `min${NBSP}`)
    .replace(/\b([Ss]ortie) (?=\d)/g, `$1${NBSP}`)
    .replace(new RegExp(`(\\d|\\b1er) ${MOIS_SUIVANT}`, "gu"), `$1${NBSP}`)
    .replace(/(\+221) /g, `$1${NBSP}`);
}

/** « 2026-05-21 » devient « 21 mai 2026 » ; « 2025-04 » devient « avril 2025 ». */
export function dateLongue(iso: string): string {
  const [a, m, j] = iso.split("-");
  if (!m) return a;
  const mois = MOIS[Number(m) - 1];
  return j ? `${Number(j) === 1 ? "1er" : Number(j)} ${mois} ${a}` : `${mois} ${a}`;
}

/** « 2024-09 » devient « Septembre 2024 » : la date d'une ligne de travaux. */
export function moisEnLettres(iso: string): string {
  const d = dateLongue(iso);
  return d.charAt(0).toUpperCase() + d.slice(1);
}
