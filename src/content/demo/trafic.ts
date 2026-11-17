// Trafic de démonstration de l'espace client (direction v4, section 7 :
// recherche/revue-4/direction-v4.md).
//
// TOUT CE QUI EST CHIFFRÉ ICI EST INVENTÉ. La maquette n'a ni serveur ni mesure
// d'audience : ces nombres ne décrivent pas le site de Saloum Immo. Ils servent à
// montrer l'écran, et chaque bloc qui les affiche le dit dessous, en clair.
//
// Ce qui est vrai : les noms et les adresses des pages (lus dans la navigation et les
// programmes du site). Ce qui est inventé : les visites, les parts, les compteurs.
//
// La série ne suit pas l'horloge : elle s'arrête à une date fixe. La démonstration
// montre les mêmes nombres à tout le monde, et une capture d'hier vaut pour demain.
// Elle est fabriquée par une formule fixe (une pente, un rythme de semaine, quelques
// pointes) : aucun tirage au hasard, le serveur et le navigateur écrivent la même page.

import { NAVIGATION } from "../coordonnees";
import { PROGRAMMES } from "../programmes";

/** Un jour de la série : sa date (AAAA-MM-JJ) et ses visites, inventées. */
export type Jour = { date: string; visites: number };

/** Une ligne d'un classement : une page, une provenance, un appareil. */
export type Part = {
  nom: string;
  /** L'adresse de la page, pour les pages. */
  detail?: string;
  /** Le nombre, inventé. */
  valeur: number;
  /** Sa part du total, de 0 à 1 : c'est elle qui s'écrit, en pour cent. */
  part: number;
  /** Sa longueur sur la plus grande de la liste, de 0 à 1 : le trait qui la mesure. */
  mesure: number;
};

export type PeriodeTrafic = {
  cle: string;
  jours: number;
  /** « 30 jours » */
  libelle: string;
  /** Premier et dernier jour, AAAA-MM-JJ. */
  debut: string;
  fin: string;
  serie: Jour[];
  visites: number;
  visiteurs: number;
  pagesVues: number;
  clicsWhatsApp: number;
  /** Visites par jour, en moyenne, arrondies. */
  moyenne: number;
  /** Le jour le plus haut de la période. */
  sommet: Jour;
  pages: Part[];
  provenances: Part[];
  appareils: Part[];
};

/** Le dernier jour de la série, et sa longueur : du 19 août au 16 novembre 2026. */
const DERNIER_JOUR = "2026-11-16";
const LONGUEUR = 90;

/** La date, n jours plus tard (ou plus tôt). En temps universel : pas d'heure d'été. */
function decaler(iso: string, n: number): string {
  const [a, m, j] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10);
}

/** Le rythme d'une semaine, du lundi au dimanche : un creux le vendredi, plus de monde le week-end. */
const SEMAINE = [1, 0.95, 0.97, 1.03, 0.84, 1.1, 1.18];
/** Quelques pointes, au rang du jour dans la série. */
const POINTES: Record<number, number> = { 47: 58, 48: 31, 71: 84, 72: 49, 73: 22, 86: 41 };

/** Les visites d'un jour : une pente douce (96 à 174), la semaine, un écart fixe, une pointe. */
function visitesDuJour(rang: number, date: string): number {
  const [a, m, j] = date.split("-").map(Number);
  const jourDeSemaine = (new Date(Date.UTC(a, m - 1, j)).getUTCDay() + 6) % 7;
  const pente = 96 + (rang / (LONGUEUR - 1)) * 78;
  const ecart = ((rang * 53 + 17) % 29) - 14;
  return Math.round(pente * SEMAINE[jourDeSemaine] + ecart + (POINTES[rang] ?? 0));
}

const SERIE: Jour[] = Array.from({ length: LONGUEUR }, (_, rang) => {
  const date = decaler(DERNIER_JOUR, rang - (LONGUEUR - 1));
  return { date, visites: visitesDuJour(rang, date) };
});

/**
 * Partage un total en nombres entiers, selon des poids : les parts retombent juste sur
 * le total (les plus gros restes prennent les unités qui manquent).
 */
function repartir(total: number, poids: number[]): number[] {
  const somme = poids.reduce((s, p) => s + p, 0);
  const bruts = poids.map((p) => (total * p) / somme);
  const entiers = bruts.map(Math.floor);
  let reste = total - entiers.reduce((s, n) => s + n, 0);
  const ordre = bruts.map((b, i) => ({ i, r: b - Math.floor(b) })).sort((x, y) => y.r - x.r);
  for (const { i } of ordre) {
    if (reste <= 0) break;
    entiers[i] += 1;
    reste -= 1;
  }
  return entiers;
}

/** Un classement : les nombres partagés selon les poids, du plus grand au plus petit. */
function classer(total: number, lignes: Array<{ nom: string; detail?: string; poids: number }>): Part[] {
  const valeurs = repartir(
    total,
    lignes.map((l) => l.poids),
  );
  const plusGrand = Math.max(...valeurs, 1);
  return lignes
    .map((l, i) => ({
      nom: l.nom,
      detail: l.detail,
      valeur: valeurs[i],
      part: total > 0 ? valeurs[i] / total : 0,
      mesure: valeurs[i] / plusGrand,
    }))
    .sort((x, y) => y.valeur - x.valeur);
}

/** La page d'une rubrique du menu, par son adresse : son vrai nom, tel que le site l'écrit. */
const rubrique = (href: string) => NAVIGATION.find((r) => r.href === href)?.libelle ?? href;

/** Les pages du classement : de vraies pages du site. Les poids, eux, sont inventés. */
const PAGES = [
  { nom: "Accueil", detail: "/", poids: 27 },
  { nom: rubrique("/terrains/"), detail: "/terrains/", poids: 18 },
  ...PROGRAMMES.map((p, i) => ({ nom: p.nom, detail: p.href, poids: [13, 9, 12][i] ?? 6 })),
  { nom: rubrique("/foncier/"), detail: "/foncier/", poids: 8 },
  { nom: rubrique("/diaspora/"), detail: "/diaspora/", poids: 7 },
  { nom: rubrique("/contact/"), detail: "/contact/", poids: 6 },
];

/** D'où viennent les visites : des canaux plausibles pour un site partagé sur les réseaux. Poids inventés. */
const PROVENANCES = [
  { nom: "Facebook", poids: 36 },
  { nom: "WhatsApp, liens partagés", poids: 21 },
  { nom: "Recherche Google", poids: 17 },
  { nom: "Accès direct", poids: 12 },
  { nom: "TikTok", poids: 9 },
  { nom: "YouTube", poids: 3 },
  { nom: "Instagram", poids: 2 },
];

/** Sur quoi le site est lu. Poids inventés. */
const APPAREILS = [
  { nom: "Téléphone", poids: 82 },
  { nom: "Ordinateur", poids: 15 },
  { nom: "Tablette", poids: 3 },
];

/** Les compteurs d'une période, tirés de sa série : tout s'accorde, d'un bloc à l'autre. */
function periode(jours: number): PeriodeTrafic {
  const serie = SERIE.slice(-jours);
  const visites = serie.reduce((s, j) => s + j.visites, 0);
  const pagesVues = Math.round(visites * 2.6);
  return {
    cle: String(jours),
    jours,
    libelle: `${jours} jours`,
    debut: serie[0].date,
    fin: serie[serie.length - 1].date,
    serie,
    visites,
    visiteurs: Math.round(visites * 0.74),
    pagesVues,
    clicsWhatsApp: Math.round(visites * 0.058),
    moyenne: Math.round(visites / jours),
    sommet: serie.reduce((haut, j) => (j.visites > haut.visites ? j : haut)),
    pages: classer(pagesVues, PAGES),
    provenances: classer(visites, PROVENANCES),
    appareils: classer(visites, APPAREILS),
  };
}

/** Les trois périodes du tableau de bord. La deuxième s'affiche à l'arrivée. */
export const PERIODES_TRAFIC: PeriodeTrafic[] = [7, 30, 90].map(periode);
export const PERIODE_PAR_DEFAUT = "30";
