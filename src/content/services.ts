// Services publiés, étapes de l'aménagement, noms de la coupe et parcours de la
// diaspora.
//
// Les huit services sont verbatim (liste du site 2026, contenu-maquette §4).
// Les étapes décrivent ce que Saloum Immo publie de son travail (contenu-maquette §4,
// « lecture utile ») : aucun fait daté sous une photo d'étape (allegement.md, 2.8).

import { MESSAGES } from "./messages";
import type { PhotoId } from "./photos";

export const SERVICES: string[] = [
  "Obtention de titres fonciers et régularisation administrative",
  "Vente et acquisition de terrains",
  "Terrassement et viabilisation de terrains",
  "Adduction d’eau et raccordements",
  "Conception de plans architecturaux et modélisation 3D",
  "Construction de maisons clés en main",
  "Suivi et gestion de chantiers",
  "Conseil et accompagnement personnalisé en immobilier",
];

// ------------------------------------------------------------- Les étapes

export type Etape = { titre: string; texte: string; photo: PhotoId };

/** Cinq étapes avec photo, dans l'ordre de la coupe. */
export const ETAPES: Etape[] = [
  {
    titre: "Débroussaillage et terrassement",
    texte: "Le terrain est débroussaillé, puis terrassé à l’engin.",
    photo: "2493",
  },
  {
    titre: "Tracé et bornage",
    texte: "Les parcelles sont relevées au GPS, tracées, puis bornées.",
    photo: "2502",
  },
  {
    titre: "Voies en latérite et bordures",
    texte: "Les voies sont ouvertes et couvertes de latérite. Des bordures béton les tiennent.",
    photo: "2529",
  },
  {
    titre: "Adduction d’eau",
    texte: "Les canalisations d’eau sont posées, avec SEN’EAU.",
    photo: "2355",
  },
  {
    titre: "Électricité",
    texte: "Poteaux béton et câble basse tension.",
    photo: "2516",
  },
];

/** Sixième case, en texte : le service 01, verbatim. */
export const ETAPE_TITRE = {
  titre: "Titre foncier",
  texte: "Obtention de titres fonciers et régularisation administrative.",
};

/** Ce que montre la coupe, écrit sur le dessin. */
export const NOMS_COUPE = {
  terrassement: "Terrassement",
  borne: "Borne",
  voie: "Voie en latérite",
  eau: "Eau",
  electricite: "Poteau et câble",
};

/** Intro de la page Aménager. */
export const INTRO_AMENAGER =
  "Terrassement, voies en latérite, eau avec SEN’EAU, électricité, bornage. Sur les terrains que nous vendons, et sur ceux des propriétaires.";

/** La phrase de la section Aménager de l'accueil. */
export const PHRASE_AMENAGER_ACCUEIL = "Sur nos terrains, le travail commence bien avant la vente.";

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
};

export const PARCOURS_DIASPORA: Station[] = [
  { titre: "Écrivez-nous", texte: "Sur {whatsapp}, depuis n’importe quel pays. Ou {appel:appelez ce numéro}." },
  // « Les terrains en vente », pas « nos programmes » : Sicap Keur Massar (Paradise City)
  // n'est jamais présenté comme notre programme.
  {
    titre: "Regardez le terrain en vidéo",
    texte: "Les terrains en vente sont filmés au drone et en visite commentée. Trois vidéos ci-dessous pour commencer.",
  },
  {
    titre: "Faites vérifier les documents",
    texte: "Titre, propriétaire, situation juridique : vérifiez-les avec nous.",
  },
  {
    titre: "Visitez sur place",
    texte: "Quand vous êtes au Sénégal, la visite se fait avec notre équipe, sur rendez-vous.",
  },
];
