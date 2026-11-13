// Services publiés, étapes de l'aménagement, repères de la coupe, offre aux
// propriétaires et cheminement de la diaspora.
//
// Les huit services sont verbatim (liste du site 2026, contenu-maquette §4).
// Pour 05 et 06, aucun détail n'est publié : pas de visuel, pas de promesse.
//
// À valider avec le client :
// - lieux des photos d'étapes (2542, 2355, 2516) ;
// - « Un notaire agréé suit chaque étape » : publié le 15.10.2025 (TikTok),
//   présenté comme un accompagnement, pas comme une garantie.

import { f, type Fait } from "./types";
import type { PhotoId } from "./photos";
import { MESSAGES } from "./messages";
import { TIKTOK, type CleVideo } from "./videos";

export type Service = {
  numero: string;
  libelle: string;
  /** Ancre de l'étape correspondante, sur la page Aménager. */
  etape?: string;
  /** Ligne sous le libellé, en version pleine largeur. */
  note?: string;
};

export const SERVICES: Service[] = [
  { numero: "01", libelle: "Obtention de titres fonciers et régularisation administrative" },
  { numero: "02", libelle: "Vente et acquisition de terrains" },
  { numero: "03", libelle: "Terrassement et viabilisation de terrains", etape: "#etape-1" },
  { numero: "04", libelle: "Adduction d’eau et raccordements", etape: "#etape-4" },
  {
    numero: "05",
    libelle: "Conception de plans architecturaux et modélisation 3D",
    note: "Parlez-nous de votre projet sur WhatsApp.",
  },
  { numero: "06", libelle: "Construction de maisons clés en main", note: "Parlez-nous de votre projet sur WhatsApp." },
  { numero: "07", libelle: "Suivi et gestion de chantiers" },
  {
    numero: "08",
    libelle: "Conseil et accompagnement personnalisé en immobilier",
    note: "Conseil gratuit pour acheter, vendre ou louer.",
  },
];

export const SOURCE_SERVICES = "contenu-maquette §4, liste du site 2026, verbatim";

/** Offre d'aménagement pour les propriétaires (lien vers la publication). */
export const OFFRE_PROPRIETAIRES: Fait = f("Offre publiée le 18 mai 2026.", "TikTok, 18.05.2026 ; contenu-maquette §4", {
  date: "2026-05-18",
  lien: TIKTOK.offreProprietaires,
});

// ------------------------------------------------------------- Les étapes

export type Etape = {
  numero: number;
  /** Ancre sur la page Aménager : « etape-1 ». */
  id: string;
  titre: string;
  /** Photo de la version courte (accueil). Absente pour l'étape Titre. */
  photo?: PhotoId;
  /** Photos de la version longue (page Aménager), deux au plus. */
  photosLongue?: PhotoId[];
  /** Étape 6 : la tuile TF remplace la photo. */
  tuile?: { titre: string; reference: Fait; texte: Fait };
  /**
   * Version longue : un fait publié sous l'étape, le plus souvent une ligne du
   * registre. Ce n'est pas une légende : la photo et la ligne ne parlent pas
   * forcément du même chantier. Absent : rien sous l'étape (étape 4).
   */
  ligneDatee?: Fait;
  /**
   * D'où vient la ligne, en étiquette mono au-dessus d'elle : elle se lit ainsi
   * comme une référence, pas comme une troisième légende de photo.
   */
  origine?: "Au registre" | "Fiche Sakina City" | "Service publié";
};

export const ETAPES: Etape[] = [
  {
    numero: 1,
    id: "etape-1",
    titre: "Débroussaillage et terrassement",
    photo: "2493",
    photosLongue: ["2493", "2495"],
    ligneDatee: f("Terrassement lancé sur 3 hectares à Kounoune, septembre 2024.", "Registre, YouTube 07.09.2024", {
      date: "2024-09",
    }),
    origine: "Au registre",
  },
  {
    numero: 2,
    id: "etape-2",
    titre: "Tracé et bornage",
    // 2502 et pas 2528 : en 4:3, 2528 perdait la tête du membre de l'équipe (à 50 % 60 %)
    // ou la borne numérotée. 2502 et pas 2505 : en 4:3 à 50 % 35 %, 2505 coupe le haut
    // des casques et le récepteur GPS que sa légende annonce (4.1, sujet entier). Les
    // deux sont du même instant : une seule photo pour cette étape.
    photo: "2502",
    photosLongue: ["2502"],
    ligneDatee: f("342 parcelles tracées sur 9 hectares, octobre 2024.", "Registre, article du site 19.10.2024", {
      date: "2024-10",
    }),
    origine: "Au registre",
  },
  {
    numero: 3,
    id: "etape-3",
    titre: "Voie en latérite",
    photo: "2542",
    // 2529 et pas 2501 : calée sur les bordures, 2501 coupait les deux ouvriers au cou.
    // Et sa légende, « Bordures béton préfabriquées. », posée juste au-dessus de la ligne
    // « … avec bordures béton à Sakina City », faisait lire la photo comme prise là-bas.
    photosLongue: ["2542", "2529"],
    ligneDatee: f("Voies en latérite avec bordures béton à Sakina City.", "contenu-maquette §5"),
    origine: "Fiche Sakina City",
  },
  {
    numero: 4,
    id: "etape-4",
    titre: "Adduction d’eau",
    photo: "2355",
    photosLongue: ["2355", "2327-haut"],
    // Pas de ligne sous cette étape. Pas celle des 58 parcelles : 2355 et 2327 montrent
    // des agents SEN'EAU dont le chantier n'est pas publié, et posée sous elles, la
    // visite de contrôle de SEN'EAU se lisait comme leur légende (4.3, 2355 : « Jamais
    // accolée au chiffre de 58 parcelles »). Elle reste au registre, en bas de la page
    // Aménager. Pas non plus le service publié « Adduction d'eau et raccordements » : le
    // service 04, juste en dessous, renvoie à cette étape (7.4), le lecteur serait
    // revenu au même libellé.
  },
  {
    numero: 5,
    id: "etape-5",
    titre: "Électricité",
    photo: "2516",
    photosLongue: ["2516", "2519"],
    ligneDatee: f(
      "53 parcelles électrifiées, 17 poteaux, câble basse tension, octobre 2025.",
      "Registre, TikTok 02.10.2025",
      { date: "2025-10" },
    ),
    origine: "Au registre",
  },
  {
    numero: 6,
    id: "etape-6",
    titre: "Titre",
    // Pas de paraphrase du service (« de la délibération au titre foncier ») tant que le
    // client ne l'a pas validée : le libellé publié, verbatim (ligneDatee). L'accueil
    // l'affiche sous la tuile, à la suite de son texte ; la page Aménager en ligne d'origine.
    tuile: {
      titre: "Titre mère, Sakina City",
      reference: f("TF 15026/R", "contenu-maquette §5"),
      texte: f("Titre foncier individuel à Sakina City et à Sicap Keur Massar.", "contenu-maquette §5"),
    },
    ligneDatee: f("Obtention de titres fonciers et régularisation administrative.", SOURCE_SERVICES),
    origine: "Service publié",
  },
];

// --------------------------------------------------------------- La coupe

/** Repères numérotés 1 à 5 de la coupe : ils renvoient aux photos des étapes. */
export const REPERES_COUPE = [
  { numero: 1, libelle: "Terrassement" },
  { numero: 2, libelle: "Borne" },
  { numero: 3, libelle: "Voie en latérite" },
  { numero: 4, libelle: "Eau" },
  { numero: 5, libelle: "Poteau, câble BT" },
];

// ---------------------------------------------------- Cheminement diaspora

export type Station = {
  numero: number;
  titre: string;
  /**
   * Texte de la station. {whatsapp} et {appel} sont remplacés par les liens
   * vers le numéro : « WhatsApp au +221 77 400 75 75 » (le nom du lien dit qu'il
   * ouvre WhatsApp, pas un appel), puis « appelez ce numéro ».
   */
  texte: string;
  /** Phrase ajoutée sur la page Diaspora seulement (la liste des vidéos y suit). */
  suiteDiaspora?: string;
  fait?: Fait;
};

/**
 * Ouverture « appel et vidéo » (3.4) de la diaspora : section 04 de l'accueil et
 * page Diaspora. Titre, chapeau et bouton sont de la microcopie (6.3), la vidéo est
 * le reel du 27.10.2026 (droit à l'image de la collaboratrice à valider).
 */
export const APPEL_DIASPORA = {
  titre: "Acheter depuis l’étranger",
  chapeau:
    "Vous vivez loin et vous ne voulez pas acheter à l’aveugle. Tout commence à distance, sur WhatsApp, avec des vidéos et des documents.",
  bouton: "Commencer sur WhatsApp",
  message: MESSAGES.diaspora.texte,
  video: "reelLotsSKM" as CleVideo,
  photo: "ig-DfAoxMkAbKR" as PhotoId,
  /**
   * Le logo « SI Saloum Immo » incrusté en haut à gauche de l'image (x 21 à 119 sur
   * 899) sort du cadre : agrandie 1,2 fois depuis le coin haut droit, l'image ne
   * montre plus que x 150 à 899. Le haut reste : le casque n'est pas coupé (4.1).
   */
  zoom: { echelle: 1.2, origine: "right top" },
};

export const PARCOURS_DIASPORA: Station[] = [
  {
    numero: 1,
    titre: "Écrivez-nous",
    texte: "Sur {whatsapp}, depuis n’importe quel pays. Ou {appel}.",
  },
  {
    numero: 2,
    titre: "Regardez le terrain en vidéo",
    // « Les terrains en vente », pas « nos programmes » : Sicap Keur Massar (Paradise City)
    // n'est jamais présenté comme notre programme (8).
    texte: "Les terrains en vente sont filmés au drone et en visite commentée.",
    suiteDiaspora: "Six vidéos ci-dessous.",
  },
  {
    numero: 3,
    titre: "Faites vérifier les documents",
    texte: "Titre, propriétaire, situation juridique : vérifiez-les avec nous. Un notaire agréé suit chaque étape.",
    fait: f("Un notaire agréé suit chaque étape.", "TikTok, 15.10.2025 ; contenu-maquette §6", { date: "2025-10-15" }),
  },
  {
    numero: 4,
    titre: "Visitez sur place",
    texte: "Quand vous êtes au Sénégal, la visite se fait avec notre équipe, sur rendez-vous.",
    fait: f("Visites de terrain accompagnées.", "contenu-maquette §6"),
  },
];
