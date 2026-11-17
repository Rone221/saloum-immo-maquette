// Textes propres à la page Acheter depuis l'étranger (direction v4, « Du plan au
// terrain » : recherche/revue-4/direction-v4.md, section 6). Chaque fait porte sa
// source ; les titres et les étiquettes sans fait n'en ont pas besoin.
//
// Ne jamais écrire « EXCLUSIF DIASPORA ». Ne rien promettre qui n'est pas publié : ni
// paiement à distance, ni échéancier, ni procuration, ni visite vidéo en direct.
// Personne n'est nommé. Le notaire est un accompagnement, pas une garantie.
// Quand l'équipe agit, la phrase le dit : « nous filmons », « nous vous faisons visiter ».

import { NOTAIRE } from "../foncier";
import { MESSAGES, type Message } from "../messages";
import type { PhotoId } from "../photos";
import { PARCOURS_DIASPORA } from "../services";
import { f, type Fait } from "../types";
import type { CleVideo } from "../videos";

const LEGENDE_DG = "Légende de l’interview du DG, Instagram, 08.06.2026";

/**
 * L'en-tête de l'ouverture. `nom` : la rubrique, comme au menu (content/coordonnees.ts).
 * `mot` : le mot coté du titre (DIASPORA.titre, content/services.ts), tel qu'il y est
 * écrit. L'article reste avec son nom : seul, « l' » pourrait finir une ligne.
 */
export const EN_TETE = {
  nom: "Depuis l’étranger",
  mot: "l’étranger",
};

/**
 * Ouverture : le risque, avec les mots que l'acheteur a en tête (analyse, point 51),
 * puis la vérification. L'accueil dit « nous vérifions avec vous » : ici, la même
 * vérification, dite à l'acheteur.
 */
export const OUVERTURE = {
  risque: f(
    "De loin, une arnaque ne se voit pas.",
    "contenu-maquette §4 (la diaspora achète à distance et a peur de l’arnaque foncière)",
  ),
  verification: f(
    "Avant de payer, faites vérifier avec nous le véritable propriétaire, le NICAD de la parcelle, et qu’il n’y a pas de vente multiple.",
    `${LEGENDE_DG} ; YouTube Rrfi4zPWsbY ; contenu-maquette §6`,
  ),
};

/**
 * Nom du tracé des étapes, sous le chapeau, pour les lecteurs d'écran : quatre bornes
 * sur un axe, chacune mène à sa section. Le tracé n'affiche pas de titre.
 */
export const ARIA_ETAPES = "Du premier message à la visite";

/** La pièce de chaque étape : c'est elle qui donne sa forme à la section. */
export type Piece = "message" | "videos" | "papiers" | "visites";

/**
 * Où se fait une étape. Sous 1 101 px, le tracé de l'ouverture l'écrit au bout de chaque
 * ligne. Au bureau, où les quatre étapes tiennent sur un axe, il est lu dans chaque
 * lien. Les mots sont ceux de deux titres du site : « De loin, faites tout vérifier
 * avant de payer » (accueil) et « Visitez sur place ».
 */
export type Lieu = "loin" | "place";

export const LIEUX: Record<Lieu, string> = {
  loin: "De loin",
  place: "Sur place",
};

export type EtapeDiaspora = {
  piece: Piece;
  lieu: Lieu;
  /**
   * Le nom de la section, en étiquette dans son en-tête et en Besley dans le tracé de
   * l'ouverture : un verbe, l'étape en un mot.
   */
  nom: string;
  /** Les titres de l'accueil (services.ts) : les deux listes disent la même chose. */
  titre: string;
  /** Le mot coté du titre, tel qu'il y est écrit. Sans jambage, sauf sur la dernière ligne. */
  mot: string;
  /** Le mot a un jambage et ferme le titre : la cote passe dessous. */
  basse?: boolean;
  /** Une phrase par fait, chacune avec sa source. */
  texte: Fait[];
};

export const ETAPES: EtapeDiaspora[] = [
  {
    piece: "message",
    lieu: "loin",
    nom: "Écrire",
    titre: PARCOURS_DIASPORA[0].titre,
    mot: "Écrivez",
    // Pas « Le conseil est gratuit » ici : sous une ouverture qui dit « faites vérifier
    // avec nous », il se lisait « la vérification est gratuite », ce que rien ne publie.
    texte: [f("Sur WhatsApp ou par appel, au même numéro.", "contenu-maquette §3")],
  },
  {
    piece: "videos",
    lieu: "loin",
    nom: "Regarder",
    titre: PARCOURS_DIASPORA[1].titre,
    mot: "vidéo",
    texte: [
      f(
        "Nous filmons les terrains en vente au drone et en visite commentée.",
        "contenu-maquette §6 (photos et vidéos de visites) et §9 (vidéos publiées)",
      ),
    ],
  },
  {
    piece: "papiers",
    // Les documents se vérifient de loin aussi : « Tout commence à distance, sur WhatsApp,
    // avec des vidéos et des documents » (services.ts, DIASPORA).
    lieu: "loin",
    nom: "Faire vérifier",
    titre: PARCOURS_DIASPORA[2].titre,
    mot: "vérifier",
    texte: [
      f(
        "Nous vérifions avec vous l’authenticité des documents fonciers et la situation juridique de la parcelle.",
        LEGENDE_DG,
      ),
      NOTAIRE,
    ],
  },
  {
    piece: "visites",
    lieu: "place",
    nom: "Visiter",
    titre: PARCOURS_DIASPORA[3].titre,
    mot: "place",
    basse: true,
    texte: [
      f(
        "Quand vous êtes au Sénégal, nous vous faisons visiter le terrain, sur rendez-vous.",
        "contenu-maquette §6 (visites de terrain accompagnées)",
      ),
    ],
  },
];

/**
 * Écrire : le message prêt de la diaspora (messages.ts), écrit en grand au-dessus du
 * bouton qui l'envoie. Le texte affiché et celui du lien sont la même chaîne. La liste
 * est celle des messages affichés : l'en-tête de la section les compte.
 */
export const MESSAGES_PRETS: Message[] = [MESSAGES.diaspora];

/**
 * Écrire : sous le bouton, le numéro, pour qui préfère appeler. Le numéro lui-même est
 * dans site.ts (MOBILE), au format international : sa clé dit pourquoi.
 */
export const CLE_NUMERO = f(
  "Depuis n’importe quel pays",
  "content/services.ts, PARCOURS_DIASPORA (« Sur WhatsApp, depuis n’importe quel pays. ») ; contenu-maquette §3",
);

/**
 * Trois vidéos au plus sur la page. Une image seulement quand on en a une tirée de la
 * vidéo : la collaboratrice, sur un lot. L'image du NICAD sert déjà sur l'accueil et sur
 * Foncier (deux pages au plus) : ici, la vidéo du NICAD est un lien texte.
 * `terrain` et `visite` : l'étape Regarder. `nicad` : l'étape Faire vérifier.
 */
export const VIDEOS_DIASPORA = {
  terrain: { cle: "reelLotsSKM", couverture: "ig-DfAoxMkAbKR" },
  visite: "visiteLacTown",
  nicad: "nicad",
} satisfies {
  terrain: { cle: CleVideo; couverture: PhotoId };
  visite: CleVideo;
  nicad: CleVideo;
};

/**
 * Regarder : la légende de l'image de la collaboratrice, à gauche. Celle de sa fiche
 * (« Une collaboratrice présente un lot, sur place ») tient sur quatre lignes sous une
 * image de 350 px. Celle-ci en garde le geste, en deux lignes : qui parle, le titre de
 * la vidéo le dit juste à côté.
 */
export const LEGENDE_COLLABORATRICE = f(
  "Présentation d’un lot",
  "content/photos.ts, fiche de la photo ig-DfAoxMkAbKR (légende)",
);

/**
 * Faire vérifier : les trois papiers, en corps croissants, chacun sur son trait. Sous
 * chaque nom, son niveau publié (content/foncier.ts), avec cette clé.
 */
export const CLE_NIVEAU = "Niveau de sécurité";

/** Nom de la figure des trois papiers, lu par les lecteurs d'écran. */
export const ARIA_PAPIERS = "Les trois documents, du moins au plus protégé";

/** Sous les trois papiers, dans l'ordre publié des niveaux. */
export const NOTE_PAPIERS = f(
  "Du moins au plus protégé. Demandez lequel vous achetez.",
  "Carrousel Instagram DaiftQ_iBJd, 08.07.2026 (niveaux publiés) ; content/foncier.ts",
);

/** Visiter : des visites avec l'équipe, en petit (des visages de visiteurs). */
export const VISITES: PhotoId[] = ["2388", "2491", "2509"];

/**
 * Une seule légende sous les trois photos : sous des tirages de 170 px de large, trois
 * légendes à deux colonnes ne tiendraient pas. Ce qu'on voit, sans lieu ni nom ; les
 * fiches des photos disent « Visite d'un terrain » et « Visite sur place ».
 */
export const LEGENDE_VISITES = f(
  "Visites de terrain",
  "contenu-maquette §6 (visites de terrain accompagnées) et §8 (2388, 2491, 2509 : visites) ; content/photos.ts",
);

/**
 * L'appel final (direction v4, pièce 15) : la page s'ouvre sur « De loin, une arnaque ne
 * se voit pas », elle se ferme sur ce qu'on peut faire de loin. Aucune promesse : tout
 * commence à distance, sur WhatsApp (services.ts, DIASPORA). Le bouton est celui de la
 * diaspora (messages.ts). `mot` : sans jambage, il n'est pas sur la dernière ligne.
 */
export const APPEL = {
  nom: "Nous écrire",
  phrase: "De loin, commencez par un message.",
  mot: "commencez",
};
