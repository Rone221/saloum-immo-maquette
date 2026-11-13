// Faits propres à la page À propos (spécification 7.7), tirés de contenu-maquette.md.
// Ce fichier ne crée aucun fait nouveau : il met en forme pour la fiche de
// l'entreprise ceux de site.ts, et ajoute les noms de comptes des réseaux
// (contenu-maquette §3) qui n'existaient que dans les adresses.
//
// À valider avec le client :
// - création « Depuis 2022 » (LinkedIn dit 2021) ;
// - siège « Sicap Keur Massar, Sangalkam, Dakar » (plusieurs adresses circulent) ;
// - chiffres des réseaux, relevés le 13.11.2026 (à mettre à jour ou à retirer).

import { CREATION, FACEBOOK_NOM, RAISON_SOCIALE, RESEAUX, SIEGE, SLOGAN, TIKTOK_VIDEOS, VALEURS } from "@/content/site";
import { f, type Fait } from "@/content/types";

// ------------------------------------------------------------- L'entreprise

/** Libellés de la fiche de l'entreprise (7.7), hors de la liste des fiches de programme (3.6). Rendue par components/fiche.tsx. */
export type LibelleEntreprise = "Raison sociale" | "Création" | "Siège" | "Devise" | "Valeurs";

export type LigneEntreprise = { libelle: LibelleEntreprise; valeur: Fait };

/** Une valeur de fiche commence par une capitale et finit par un point (3.6). */
const enValeur = (fait: Fait, texte: string): Fait => ({ ...fait, texte });

export const FICHE_ENTREPRISE: LigneEntreprise[] = [
  { libelle: "Raison sociale", valeur: RAISON_SOCIALE },
  { libelle: "Création", valeur: enValeur(CREATION, "Depuis 2022.") },
  { libelle: "Siège", valeur: enValeur(SIEGE, "Sicap Keur Massar, Sangalkam, Dakar.") },
  { libelle: "Devise", valeur: SLOGAN },
  { libelle: "Valeurs", valeur: enValeur(VALEURS, "La transparence, la qualité et l’engagement.") },
];

// ------------------------------------------------------------- Réalisations

/**
 * Titre du bloc Millennium City. Il dit ce que Saloum Immo y a fait : jamais
 * « notre programme », jamais l'aire de jeux (le lotissement est commercialisé par Senegindia).
 */
export const MILLENNIUM_TITRE = f("Le réseau de canalisation de Millennium City", "contenu-maquette §5 (réalisations)");

// ------------------------------------------------------------------ Réseaux

export type ReseauAPropos = {
  nom: string;
  href: string;
  /** Nom de la page ou identifiant du compte. */
  compte: Fait;
  /** Chiffres relevés le 13.11.2026. Vide : rien n'a été relevé, la case est en pointillés. */
  chiffres: Fait[];
};

const SOURCE_RESEAUX = "contenu-maquette §3";

function reseau(nom: string) {
  const r = RESEAUX.find((x) => x.nom === nom);
  if (!r) throw new Error(`Réseau inconnu : ${nom}`);
  return r;
}

/** Ordre de la spécification (7.7). Les adresses viennent de site.ts. */
export const RESEAUX_A_PROPOS: ReseauAPropos[] = [
  {
    nom: "Facebook",
    href: reseau("Facebook").href,
    compte: enValeur(FACEBOOK_NOM, `« ${FACEBOOK_NOM.texte} »`),
    chiffres: [reseau("Facebook").repere],
  },
  {
    nom: "TikTok",
    href: reseau("TikTok").href,
    compte: f("@saloum_immo", SOURCE_RESEAUX),
    chiffres: [reseau("TikTok").repere, TIKTOK_VIDEOS],
  },
  {
    nom: "YouTube",
    href: reseau("YouTube").href,
    compte: f("@saloumimobat", SOURCE_RESEAUX),
    chiffres: [reseau("YouTube").repere],
  },
  {
    nom: "Instagram",
    href: reseau("Instagram").href,
    compte: reseau("Instagram").repere,
    chiffres: [],
  },
  {
    nom: "LinkedIn",
    href: reseau("LinkedIn").href,
    compte: enValeur(reseau("LinkedIn").repere, `« ${reseau("LinkedIn").repere.texte} »`),
    chiffres: [],
  },
];
