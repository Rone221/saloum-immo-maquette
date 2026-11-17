// Services publiés, étapes du chantier (page Aménager), gestes de l'accueil, noms de la
// coupe et parcours de la diaspora.
//
// Les huit services suivent la liste du site 2026 (contenu-maquette §4), mot pour mot
// dans `publie`, avec la phrase de l'équipe dans `phrase` (revue 3, analyse, point 12).
// La page Aménager ne les liste plus : les étapes disent les services 1, 3 et 4, et une
// phrase (pages/amenager.ts, SUITE_MAISON) dit les autres. Les étapes décrivent ce que
// Saloum Immo publie de son travail (contenu-maquette §4, « lecture utile ») : aucun
// fait daté sous une photo d'étape (allegement.md, 2.8).

import { MESSAGES } from "./messages";
import type { PhotoId } from "./photos";

export type Service = {
  /** Le service tel que publié, mot pour mot (liste du site 2026). */
  publie: string;
  /** Le même service, dit par l'équipe : « nous » et un verbe, sans rien ajouter. */
  phrase: string;
};

/** Dans l'ordre publié : 1 à 4 touchent au terrain, 5 à 8 à la maison. */
export const SERVICES: Service[] = [
  {
    publie: "Obtention de titres fonciers et régularisation administrative",
    // « Nous faisons les démarches » : un titre foncier ne se promet pas (foncier.ts :
    // une vérification proposée, pas une garantie).
    phrase: "Nous faisons les démarches pour obtenir les titres fonciers et régulariser les dossiers administratifs.",
  },
  // Pas « nous achetons des terrains » : aucune source ne dit que Saloum Immo rachète au
  // public ; le site 2026 parle d'accompagner le client (« achat, vente »).
  { publie: "Vente et acquisition de terrains", phrase: "Nous vendons des terrains, et nous vous aidons à en acheter." },
  { publie: "Terrassement et viabilisation de terrains", phrase: "Nous terrassons et viabilisons les terrains." },
  // SEN'EAU : contenu-maquette §4, lecture utile (« adduction d'eau avec SEN'EAU »).
  { publie: "Adduction d’eau et raccordements", phrase: "Nous amenons l’eau avec SEN’EAU, et nous faisons les raccordements." },
  { publie: "Conception de plans architecturaux et modélisation 3D", phrase: "Nous dessinons les plans et nous les modélisons en 3D." },
  { publie: "Construction de maisons clés en main", phrase: "Nous construisons votre maison, clés en main." },
  { publie: "Suivi et gestion de chantiers", phrase: "Nous suivons et gérons votre chantier." },
  {
    publie: "Conseil et accompagnement personnalisé en immobilier",
    phrase: "Nous vous conseillons et vous accompagnons dans votre projet immobilier.",
  },
];

// ------------------------------------------------------------- Les étapes

/**
 * Une photo d'étape, page Aménager (planche des étapes : components/amenager-etapes.tsx).
 * `portrait` : cadre 3:4, le format des photos WhatsApp (810 px de large), la moitié de
 * la colonne des étapes : 300 px dessinés au plus ; `paysage` : cadre 3:2, toute la
 * colonne, 616 px au plus ; `bande` : cadre 2:1, même largeur, pour une voie qui
 * traverse la photo.
 */
export type PhotoEtape = {
  id: PhotoId;
  format: "portrait" | "paysage" | "bande";
  /** Cadrage (object-position), quand celui de la fiche ne convient pas au cadre. */
  position?: string;
  /**
   * Gros plan dans le cadre : la photo dessinée `echelle` fois plus grande, autour du
   * point `origine` (transform-origin). Seulement pour un grand fichier : la largeur
   * dessinée reste sous la largeur du fichier, écran haute densité compris.
   */
  plan?: { echelle: number; origine: string };
};

export type Etape = {
  /** Le nom de l'étape : le titre de sa ligne, et le nom écrit dans le cartouche de la coupe. */
  nom: string;
  /** Ce que fait l'équipe : « nous », au présent (analyse, point 49). */
  texte: string;
  photos: PhotoEtape[];
};

/**
 * Les étapes du chantier, dans l'ordre de la coupe : la planche des étapes de la page
 * Aménager (direction v4, pièce 9, en grand). La première pose le terrassement sur la
 * coupe, la cinquième l'électricité. Une ou deux photos par étape, autres que celles de
 * la planche de l'accueil, sauf la borne et la tranchée, seules images de leur geste,
 * cadrées autrement : 2528 en entier (4:5 sur l'accueil), 2355 en paysage (portrait sur
 * l'accueil). 2542 est aussi sur l'accueil (propriétaires, toute la largeur de la
 * photo) : ici resserrée sur le camion et la voie. Ces trois photos sont donc sur deux
 * pages : aucune autre ne doit les prendre. 2355 n'est jamais dans la section des
 * 58 parcelles. Aucun fait daté dans une étape (allegement.md, 2.8).
 */
export const ETAPES: Etape[] = [
  {
    nom: "Terrassement",
    texte: "Nous débroussaillons le terrain, puis nous le terrassons aux engins.",
    photos: [{ id: "2495", format: "portrait", position: "50% 60%" }],
  },
  {
    nom: "Bornage",
    texte: "Nous relevons les parcelles au GPS. Puis nous posons les bornes et nous les numérotons à la peinture.",
    photos: [
      { id: "2502", format: "portrait" },
      { id: "2528", format: "portrait" },
    ],
  },
  {
    nom: "Voies et bordures",
    texte: "Nous ouvrons les voies en latérite et nous posons les bordures béton qui les tiennent.",
    // La voie tracée, la latérite livrée, les piquets, sans le sol nu du premier plan : en
    // bande, resserrée sur le camion. 2 560 px de large, dessinée à 924 px au plus (1 848
    // en haute densité).
    photos: [{ id: "2542", format: "bande", position: "center top", plan: { echelle: 1.5, origine: "43% 30%" } }],
  },
  {
    nom: "Eau",
    texte: "Nous creusons les tranchées et nous posons les canalisations, avec SEN’EAU.",
    // Le dos de l'agent SEN'EAU, le gilet de l'équipe et la tranchée, sans le ciel.
    photos: [{ id: "2355", format: "paysage", position: "50% 46%" }],
  },
  {
    nom: "Électricité",
    texte: "Nous levons les poteaux béton, puis nous tirons le câble basse tension.",
    photos: [
      { id: "2517", format: "portrait" },
      { id: "2519", format: "portrait" },
    ],
  },
];

/**
 * Revue 3 : la planche des gestes de l'accueil, sous la coupe, dans l'ordre du
 * chantier. L'équipe est le sujet (« nous »), au présent. Une image par geste, que
 * seul Saloum Immo a : sa chargeuse dans la latérite (film de présentation), sa borne
 * numérotée, ses bordures, la tranchée avec SEN'EAU, la pose d'un poteau.
 */
export type Geste = { nom: string; texte: string; photo: PhotoId };

export const GESTES: Geste[] = [
  { nom: "Terrassement", texte: "Nous débroussaillons, puis nous terrassons aux engins.", photo: "ig-DbLzsuzO_wN-27s" },
  { nom: "Bornage", texte: "Nous relevons les parcelles au GPS, puis nous posons les bornes.", photo: "2528" },
  { nom: "Voies et bordures", texte: "Nous ouvrons les voies en latérite et posons les bordures béton.", photo: "2501" },
  { nom: "Eau", texte: "Nous posons les canalisations, avec SEN’EAU.", photo: "2355" },
  { nom: "Électricité", texte: "Nous levons les poteaux béton et tirons le câble basse tension.", photo: "2516" },
];

/**
 * Dernière ligne du registre des étapes, sans photo : le papier (service 1, dit avec un
 * verbe). Aucun dessin à la place d'une image : la ligne mène à la page Foncier.
 */
export const ETAPE_TITRE = {
  nom: "Titre foncier",
  // Les démarches, pas le titre promis : Lac Town a un statut « à demander », l'offre AIBD
  // est un bail.
  texte: "Pour finir, le papier : nous faisons les démarches pour obtenir le titre foncier et régulariser le dossier administratif.",
};

/** Ce que montre la coupe, écrit sur le dessin. */
export const NOMS_COUPE = {
  terrassement: "Terrassement",
  borne: "Borne",
  voie: "Voie en latérite",
  eau: "Eau",
  electricite: "Poteau et câble",
};

/**
 * Bandeau des propriétaires, à l'accueil. Le chapeau de la page Aménager est dans
 * content/pages/amenager.ts.
 */
export const AMENAGER_PROPRIETAIRES =
  "Nous aménageons aussi les terrains des propriétaires : terrassement, voies en latérite, eau, électricité, bornage.";

export const QUESTION_PROPRIETAIRES = "Vous avez un terrain ou des hectares ?";

// ---------------------------------------------------- Parcours diaspora

export const DIASPORA = {
  titre: "Acheter depuis l’étranger",
  chapeau:
    "Vous vivez loin et vous ne voulez pas acheter à l’aveugle. Tout commence à distance, sur WhatsApp, avec des vidéos et des documents.",
  /** Accueil : la version courte. */
  accueil: "Tout commence sur WhatsApp, avec des vidéos et des documents.",
  message: MESSAGES.diaspora.texte,
  photo: "ig-DfAoxMkAbKR" as PhotoId,
};

export type Station = {
  titre: string;
  /**
   * {whatsapp} devient un lien vers WhatsApp, avec le numéro ; {appel:…} un lien
   * tel: vers le même numéro, sur le texte donné.
   */
  texte: string;
  /** Version courte, sans lien, pour les cartes de l'accueil (revue 2). Mêmes faits. */
  court: string;
};

export const PARCOURS_DIASPORA: Station[] = [
  {
    titre: "Écrivez-nous",
    texte: "Sur {whatsapp}, depuis n’importe quel pays. Ou {appel:appelez ce numéro}.",
    court: "Sur WhatsApp, depuis n’importe quel pays.",
  },
  // « Les terrains en vente », pas « nos programmes » : Sicap Keur Massar (Paradise City)
  // n'est jamais présenté comme notre programme.
  {
    titre: "Regardez le terrain en vidéo",
    // Pas « trois vidéos ci-dessous » : une seule des vidéos de la page Diaspora montre un terrain.
    texte: "Les terrains en vente sont filmés au drone et en visite commentée.",
    court: "Les terrains en vente sont filmés au drone et en visite commentée.",
  },
  {
    titre: "Faites vérifier les documents",
    texte: "Titre, propriétaire, situation juridique : vérifiez-les avec nous.",
    court: "Titre, propriétaire, situation juridique : vérifiez-les avec nous.",
  },
  {
    titre: "Visitez sur place",
    texte: "Quand vous êtes au Sénégal, la visite se fait avec notre équipe, sur rendez-vous.",
    court: "Au Sénégal, avec notre équipe, sur rendez-vous.",
  },
];
