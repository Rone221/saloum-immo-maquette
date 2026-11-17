// Textes propres à la page Aménager (direction v4, recherche/revue-4/direction-v4.md,
// section 6, « Aménager »). Les étapes du chantier et les huit services sont dans
// content/services.ts ; les chantiers datés, dans content/registre.ts.
// Chaque fait porte sa source. Les titres de section disent un fait, sans source à
// citer. Les noms de section, les libellés de bouton et les clés de champ sont de la
// microcopie. Les quantités des en-têtes de section se comptent ici, dans le contenu :
// aucune n'est écrite de tête.

import { dateLongue } from "@/lib/format";
import { MESSAGES } from "../messages";
import { PHOTOS, type PhotoId } from "../photos";
import { TRAVAUX } from "../registre";
import { ETAPES, SERVICES } from "../services";
import { f, fv } from "../types";

// ------------------------------------------------------------ L'ouverture

export const OUVERTURE = {
  /** Le nom de la rubrique, dans l'en-tête de section. */
  nom: "Aménager",
  titre: "Aménager votre terrain",
  /** Le mot coté du titre : sans jambage, la cote passe juste sous la ligne. */
  mot: "terrain",
  /**
   * Pas la liste des travaux : la coupe, juste dessous, les nomme déjà (analyse,
   * point 7). Le fait que porte toute la page : nos terrains, et ceux des propriétaires.
   */
  chapeau: f(
    "Nous aménageons les terrains que nous vendons, et ceux des propriétaires.",
    "contenu-maquette §4 (lecture utile ; offre aux propriétaires publiée le 18 mai 2026)",
    { date: "2026-05-18" },
  ),
  /**
   * Le bouton de l'ouverture mène à la phrase à trous, plus bas sur la page : le
   * propriétaire n'a pas à lire toute la méthode pour décrire son terrain. Le libellé
   * du bouton WhatsApp des propriétaires (messages.ts), sans « sur WhatsApp » : celui-ci
   * ne sort pas de la page.
   */
  bouton: "Décrire mon terrain",
  /** Les gestes du chantier (ETAPES), puis le titre foncier, dernière ligne de la planche. */
  quantite: `${ETAPES.length} gestes, puis le papier`,
};

/** Les mois des chantiers datés, du premier au dernier (AAAA-MM : l'ordre des lettres est celui du temps). */
const MOIS_CHANTIERS = TRAVAUX.map((t) => t.mois).sort();

/**
 * Le cartouche de l'ouverture : ce que la page montre, en trois cases, comme le
 * cartouche d'une planche dit ce qu'elle porte. Rien de neuf, tout se compte ou se lit
 * dans le contenu : les noms des étapes (ETAPES), le papier (ETAPE_TITRE : les
 * démarches, pas le titre promis), les chantiers datés (TRAVAUX), du premier au dernier.
 */
export const CARTOUCHE = {
  /** Nom du tableau, lu par les lecteurs d'écran. */
  nom: "La page, en trois lignes",
  cases: [
    {
      cle: "Travaux",
      valeur: f(
        ETAPES.map((e, i) => (i ? e.nom.toLocaleLowerCase("fr") : e.nom)).join(", "),
        "content/services.ts, ETAPES (contenu-maquette §4, lecture utile)",
      ),
    },
    {
      cle: "Papier",
      valeur: f("Les démarches pour le titre foncier", "content/services.ts, ETAPE_TITRE (contenu-maquette §4, service 1)"),
    },
    {
      cle: "Chantiers datés",
      // « 4, de septembre 2024 à novembre 2025 » : le nombre, puis les deux bouts du registre.
      valeur: f(
        `${TRAVAUX.length}, de ${dateLongue(MOIS_CHANTIERS[0])} à ${dateLongue(MOIS_CHANTIERS[MOIS_CHANTIERS.length - 1])}`,
        "content/registre.ts, TRAVAUX (contenu-maquette §5 et §7)",
      ),
    },
  ],
};

// ----------------------------------------------------------- Les sections

/** Titres de section : un fait, sept mots au plus, jamais une étiquette (analyse, point 47). */
export const TITRES = {
  /** Les cinq gestes du chantier, puis le titre foncier en dernière ligne. */
  etapes: "Le chantier d’abord, le papier ensuite",
  travaux: "Nos chantiers datés, avec leurs sources",
  /** Les services que les étapes ne disent pas : la maison, la vente, le conseil. */
  services: "Après le terrain, la maison",
};

/** Le mot coté de chaque titre, tel qu'il y est écrit. Sans jambage : le cas simple. */
export const MOTS = {
  etapes: "chantier",
  travaux: "sources",
  services: "maison",
};

/** Les photos des étapes, dans l'ordre de la planche. */
const PHOTOS_ETAPES: PhotoId[] = ETAPES.flatMap((e) => e.photos.map((p) => p.id));

/**
 * Les services publiés que les étapes disent déjà (contenu-maquette §4, numéros de la
 * liste) : 1, le papier ; 3, terrassement et viabilisation ; 4, l'eau. Les autres sont
 * dits par SUITE_MAISON.
 */
const DITS_PAR_LES_ETAPES = [1, 3, 4];
const AUTRES_SERVICES = SERVICES.filter((_, i) => !DITS_PAR_LES_ETAPES.includes(i + 1));

/** Les trous du message prêt des propriétaires : ce que la phrase à trous demande. */
const TROU = "…";
const MORCEAUX = MESSAGES.proprietaire.texte.split(TROU);

/**
 * Les en-têtes de section : le nom, puis la quantité vraie, comptée dans le contenu.
 * Les bornes (02 à 07) sont posées par la page, dans l'ordre.
 */
export const SECTIONS = {
  etapes: {
    nom: "Les étapes",
    /**
     * Sous une photo d'étape, on ne lit que ce qu'elle montre : la nature des images
     * est dite ici, une fois pour toutes, parce qu'elle est la même pour toutes. Elle
     * est lue dans la fiche de chaque photo (champ `nature`). Si une photo d'une autre
     * nature entrait dans la planche, l'en-tête ne dirait plus que leur nombre.
     */
    quantite: PHOTOS_ETAPES.every((id) => PHOTOS[id].nature === "chantier")
      ? `${PHOTOS_ETAPES.length} photos de chantier`
      : `${PHOTOS_ETAPES.length} photos`,
  },
  vue: {
    nom: "La vue d’ensemble",
    /**
     * Pas une quantité : ce qu'est l'image, comme à droite de l'en-tête de l'ouverture
     * d'accueil. C'est ce qui justifie les repères de cadrage : ils ne se posent que sur
     * une vue verticale (direction v4, section 5).
     */
    nature: f("Vue verticale", "direction-v4 §5 (2538 et 2540 : vues verticales) ; content/photos.ts, fiche 2540"),
  },
  travaux: {
    nom: "Les sources",
    quantite: `${TRAVAUX.length} chantiers datés`,
  },
  proprietaires: {
    nom: "Propriétaires",
    /** Le lieu et la surface : autant que de trous dans le message prêt. */
    quantite: `${MORCEAUX.length - 1} choses à nous dire`,
  },
  services: {
    nom: "La suite",
    quantite: `${AUTRES_SERVICES.length} autres services`,
  },
};

// -------------------------------------------------------- La vue d'ensemble

/**
 * 2540 : un lotissement aménagé, vu d'en haut. Même lotissement que 2538 (accueil
 * seulement) : jamais de nom de lieu ni de programme. Sa légende est celle de sa fiche.
 */
export const VUE = {
  photo: "2540" as PhotoId,
  /** Cadrée sur les voies : la route goudronnée reste à gauche, hors du centre. */
  position: "58% 42%",
};

// ------------------------------------------------------------ Les sources

/**
 * Sous le tableau des sources : pourquoi une ligne n'a pas de lien. Ce qu'on ne peut pas
 * montrer se dit (direction v4, section 1, règle 2).
 */
export const SOURCES = {
  note: fv(
    "L’article du 19 octobre 2024 n’a pas d’adresse stable : il est cité sans lien.",
    "content/registre.ts (article publié par Saloum Immo le 19.10.2024, sans adresse stable)",
    { date: "2024-10-19" },
  ),
};

// -------------------------------------------------------- Les propriétaires

/**
 * La phrase à trous (direction v4, section 6) : le message prêt des propriétaires
 * (messages.ts), dont les deux trous deviennent deux champs. Rien n'est réécrit : la
 * phrase affichée est un morceau du message, et le bouton envoie le message entier.
 */
export type PhraseATrous = {
  /** Le message entier, coupé à ses deux trous : ce qui part sur WhatsApp. */
  avant: string;
  entre: string;
  apres: string;
  /** Ce qui se lit avant le premier champ : le message sans sa salutation. */
  amorce: string;
  /** La ponctuation collée au premier champ, puis les mots avant le second. */
  colle: string;
  liaison: string;
  /** L'unité écrite après le second champ. */
  unite: string;
  /** La clé écrite sous chaque champ. */
  champs: { lieu: string; surface: string };
};

/** « j’ai un terrain à » devient « J’ai un terrain à ». */
const majuscule = (texte: string) => texte.charAt(0).toLocaleUpperCase("fr") + texte.slice(1);

function decouper(): PhraseATrous | null {
  // Deux trous, ni plus ni moins : sinon la page ne garde que le bouton habituel.
  if (MORCEAUX.length !== 3) return null;
  const [avant, entre, apres] = MORCEAUX;
  // À l'écran, la phrase commence après la salutation (« Bonjour, »)…
  const amorce = majuscule(avant.replace(/^[^,]*,\s*/, "").trim());
  // … la virgule reste collée au premier champ…
  const colle = entre.match(/^\s*[,;:]/)?.[0].trim() ?? "";
  const liaison = entre.replace(/^\s*[,;:]/, "").trim();
  // … et elle s'arrête à son premier point : l'unité, sans la phrase de politesse.
  const point = apres.indexOf(".");
  const unite = (point < 0 ? apres : apres.slice(0, point)).trim();
  return { avant, entre, apres, amorce, colle, liaison, unite, champs: { lieu: "Lieu", surface: "Surface" } };
}

/**
 * Le bloc des propriétaires. La question est QUESTION_PROPRIETAIRES (content/services.ts) ;
 * la phrase dit ce qu'il faut envoyer, comme le message prêt.
 */
export const PROPRIETAIRES = {
  texte: f(
    "Dites-nous où se trouve le terrain et sa surface, en mètres carrés ou en hectares.",
    "contenu-maquette §4 (offre aux propriétaires publiée le 18 mai 2026) ; message prêt du propriétaire (messages.ts)",
    { date: "2026-05-18" },
  ),
  /** Absente si le message prêt changeait de forme : le bouton habituel reste seul. */
  phrase: decouper(),
  /** Le nom du formulaire, pour les lecteurs d'écran : celui du bouton de l'ouverture. */
  nomFormulaire: OUVERTURE.bouton,
};

// ----------------------------------------------------------------- La suite

/**
 * Les services 2, 5, 6, 7 et 8 (contenu-maquette §4), en deux phrases plutôt qu'en
 * grille de huit : les services 1, 3 et 4 sont déjà les étapes du chantier (revue 3,
 * regard : la liste redisait les étapes, et ses huit lignes s'ouvraient toutes sur
 * « Nous »). Rien d'ajouté aux services publiés.
 */
export const SUITE_MAISON = f(
  "Nous dessinons les plans et les modélisons en 3D, puis nous construisons votre maison clés en main et suivons le chantier. Nous vendons aussi des terrains, nous vous aidons à en acheter, et nous vous conseillons dans votre projet immobilier.",
  "contenu-maquette §4 (services 2, 5, 6, 7 et 8, verbatim dans content/services.ts)",
);

// -------------------------------------------------------------- L'appel final

/**
 * Avant le pied (direction v4, pièce 15). Le bloc des propriétaires parle à qui a un
 * terrain ; l'appel final parle à l'autre lecteur de la page, celui qui en cherche un.
 * « Déjà aménagé » : les trois programmes en vente sont terrassés et viabilisés, voies
 * ouvertes (contenu-maquette §5 ; content/programmes.ts, « déjà fait »). Aucune promesse.
 * Le bouton est celui de la question (messages.ts) : « une question sur vos terrains ».
 */
export const APPEL = {
  nom: "Nous écrire",
  phrase: "Vous cherchez un terrain déjà aménagé ? Écrivez-nous.",
  mot: "Écrivez-nous",
  /** À côté du bouton WhatsApp : le libellé du bouton de l'ouverture d'accueil. */
  lien: { href: "/terrains/", libelle: "Voir les terrains en vente" },
};
