// Textes propres à la page Contact (direction v4, recherche/revue-4/direction-v4.md,
// sections 6 et 7). Le numéro tient le titre ; les trois messages WhatsApp préparés s'y
// affichent en entier, seule page qui le fait (messages.ts) ; puis la fiche de demande,
// en maquette ; l'agence sur rendez-vous ; les réseaux avec leurs chiffres datés. Aucun
// horaire : « Sur rendez-vous » (contenu-maquette §3).
//
// Les faits viennent de site.ts et de contenu-maquette.md §3. Ce fichier n'ajoute que
// les noms des comptes et les nombres de vidéos, relevés le même jour que les abonnés,
// et les textes de l'interface (noms de section, libellés de la fiche, erreurs).

import type { TextesFormulaire } from "../../components/formulaire-demande";
import { LIBELLES, MESSAGES, type Message } from "../messages";
import { MOBILE, RELEVE_RESEAUX } from "../site";
import { f, fv, type Fait } from "../types";

/**
 * L'ouverture : la borne 01, puis le numéro en titre. `avantNumero` n'est que lu : un
 * lecteur d'écran annonce « Contact », puis le numéro, pas un numéro seul.
 */
export const OUVERTURE = {
  nom: "Contact",
  avantNumero: "Contact :",
  /** Le cartouche des autres coordonnées : son nom, lu, et ses deux clés. */
  cartouche: "Autres coordonnées",
  cles: { fixe: "Fixe", email: "E-mail" },
};

/** Sous le numéro : ce qu'on en fait. */
export const USAGE = f("WhatsApp ou appel, au même numéro.", "contenu-maquette §3 (WhatsApp et mobile : +221 77 400 75 75)");

/** Une situation, son message préparé, le libellé de son bouton (un par intention). */
export type Situation = { id: string; qui: string; message: Message; bouton: string };

const SITUATIONS: Situation[] = [
  { id: "terrain", qui: "Vous cherchez un terrain", message: MESSAGES.question, bouton: LIBELLES.question },
  { id: "amenager", qui: "Vous avez un terrain à aménager", message: MESSAGES.proprietaire, bouton: LIBELLES.proprietaire },
  { id: "etranger", qui: "Vous vivez à l’étranger", message: MESSAGES.diaspora, bouton: LIBELLES.diaspora },
];

export const MESSAGES_PRETS = {
  nom: "Sur WhatsApp",
  titre: "Votre premier message, déjà écrit",
  mot: "écrit",
  chapeau: "Le bouton ouvre WhatsApp avec ce texte. Vous le relisez, puis vous l’envoyez.",
  situations: SITUATIONS,
  /** Sous un message à compléter (les « … »). */
  aCompleter: "Remplacez les points par le lieu et la surface avant d’envoyer.",
};

/**
 * La fiche de demande (direction v4, section 7) : une maquette. Rien ne part sur le
 * réseau ; la demande reste dans le navigateur (lib/demandes.ts). Aucune promesse de
 * rappel ni de délai : rien de tel n'est publié. La mention du récépissé est celle de
 * la direction, mot pour mot. Les libellés des trois choix sont dans lib/demandes.ts.
 */
export const FORMULAIRE = {
  nom: "Par écrit",
  titre: "Vous préférez écrire ? Remplissez la fiche.",
  mot: "fiche",
  chapeau: "Votre nom, un numéro, ce que vous cherchez. Le message est facultatif.",
  /** Les champs de la fiche, dans l'ordre : l'en-tête de section les compte. */
  champs: ["nom", "telephone", "sujet", "message"],
  textes: {
    fiche: "Fiche de demande",
    aRemplir: "À remplir",
    nom: "Nom",
    telephone: "Téléphone ou WhatsApp",
    sujet: "Vous cherchez",
    message: "Message",
    facultatif: "facultatif",
    aideMessage: "Le lieu, la surface, vos questions.",
    bouton: "Envoyer la demande",
    sansScript: `Sans JavaScript, la fiche ne peut pas partir. Écrivez-nous sur WhatsApp ou appelez le ${MOBILE.long}.`,
    erreurs: {
      nom: "Écrivez votre nom.",
      telephone: "Écrivez un numéro de téléphone ou de WhatsApp.",
      telephoneCourt: "Ce numéro semble incomplet. Vérifiez-le.",
      sujet: "Choisissez ce que vous cherchez.",
      resumeUn: "1 champ à corriger.",
      resumePlusieurs: "{n} champs à corriger.",
    },
    recepisse: {
      titre: "Récépissé de votre demande",
      gardee: "Gardée dans ce navigateur",
      remplie: "Remplie",
      envoi: "Envoi",
      sansMessage: "Sans message",
      mention: "Maquette : cette demande n’est pas transmise.",
      suite: "Elle reste dans ce navigateur.",
      lienAdmin: "La voir dans l’espace client de démonstration",
      autre: "Remplir une autre fiche",
    },
  } satisfies TextesFormulaire,
};

/**
 * L'agence : le titre dit « sur rendez-vous » (pas d'horaires publiés), l'adresse
 * suit, puis la visite, là où la photo de l'agence la place (analyse.md, point 8).
 * `repere` : le lieu, à droite de l'en-tête de section.
 */
export const AGENCE_PAGE = {
  nom: "L’agence",
  repere: fv("Sicap Keur Massar", "contenu-maquette §3 (adresse à valider)"),
  titre: "L’agence reçoit sur rendez-vous",
  mot: "rendez-vous",
  cles: { adresse: "Adresse", visite: "Visites" },
  adresse: fv("Sicap Keur Massar, Sangalkam, Dakar.", "contenu-maquette §3 (adresse à valider)"),
  visite: f("Sur place, nous visitons les terrains avec vous.", "contenu-maquette §6 (visites de terrain accompagnées)"),
};

/** Un compte : son nom tel qu'il s'affiche sur le réseau, et ses nombres datés. */
export type Compte = {
  /** Le nom du compte : « @saloum_immo », la page « Saloum immo ». */
  nom: string;
  videos?: Fait;
};

/** Par réseau (site.ts, RESEAUX) : le nom du compte et le nombre de vidéos publiées. */
export const COMPTES: Record<string, Compte> = {
  Facebook: { nom: "Saloum immo" },
  TikTok: {
    nom: "@saloum_immo",
    videos: f("270 vidéos", "contenu-maquette §3", { date: RELEVE_RESEAUX }),
  },
  YouTube: {
    nom: "@saloumimobat",
    videos: f("47 vidéos", "contenu-maquette §3", { date: RELEVE_RESEAUX }),
  },
  Instagram: { nom: "@saloum_immo" },
  LinkedIn: { nom: "Saloum Immo" },
};

/**
 * Les réseaux, en relevé daté : un vrai tableau. Les têtes de colonne portent l'unité
 * (abonnés, vidéos), les cases le nombre seul, dans la voix des mesures.
 */
export const RESEAUX_PAGE = {
  nom: "Les réseaux",
  titre: "Suivez nos chantiers en vidéo",
  mot: "vidéo",
  colonnes: { reseau: "Réseau", abonnes: "Abonnés", videos: "Vidéos" },
  /** Légende du tableau, lue par les lecteurs d'écran. */
  legende: "Nos comptes sur les réseaux : abonnés et vidéos publiées. Le nom de chaque réseau mène au compte.",
};
