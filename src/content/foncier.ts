// Comprendre le foncier : les trois documents, la liste « Avant d'acheter,
// vérifiez avec nous » et l'avertissement. Ces blocs vivent sur la page Foncier
// seulement (allegement.md, 2.2) ; l'accueil n'en garde que les trois niveaux.
//
// Sources : carrousel publié par Saloum Immo sur Instagram le 8 juillet 2026 (signé
// « Saloum Immo Consulting », nom absent de contenu-maquette.md : il ne s'affiche pas)
// pour les définitions et les niveaux ; légende de l'interview du DG (8 juin 2026) pour
// la liste ; TikTok du 15 octobre 2025 pour le notaire.
// C'est une vérification proposée, pas une garantie : ne jamais écrire
// « nous garantissons » ni « sans risque ».

import { f, type Fait } from "./types";

/** Titre sans point final (règle des titres, src/lib/classes.ts). */
export const TITRE_FONCIER = "Le bon papier avant le bon prix";

export const INTRO_FONCIER =
  "Avant de payer, sachez quel document vous achetez. Voici ce que nous faisons, et ce que vous pouvez vérifier avec nous.";

export const NOTAIRE = f("Un notaire agréé accompagne chaque étape.", "TikTok, 15.10.2025 ; contenu-maquette §6", {
  date: "2025-10-15",
});

const LEGENDE_DG = "Légende de l’interview du DG, Instagram, 08.06.2026";

export const AVANT_D_ACHETER = {
  titre: "Avant d’acheter, vérifiez avec nous",
  lignes: [
    f("L’authenticité des documents fonciers.", LEGENDE_DG),
    f("Le véritable propriétaire du terrain.", LEGENDE_DG),
    f("La situation juridique de la parcelle.", LEGENDE_DG),
    f("Qu’il n’y a pas de vente multiple.", LEGENDE_DG),
    f("Le NICAD, numéro d’identification cadastral de la parcelle.", "YouTube Rrfi4zPWsbY ; contenu-maquette §6"),
  ],
  /** Les trois phrases sous la liste. */
  suite: [
    NOTAIRE,
    f("Vous visitez le terrain avec notre équipe, sur rendez-vous.", "contenu-maquette §6 (visites accompagnées)"),
    f("Le conseil est gratuit, pour acheter, vendre ou louer.", "Site 2025 ; contenu-maquette §6"),
  ],
};

export type Document = {
  cle: "delib" | "bail" | "tf";
  nom: string;
  definition: Fait;
  aSavoir: Fait;
  /** Niveau de sécurité publié, en mots. Jamais d'étoiles ni de note sur 5. */
  niveau: Fait;
  /** Suit « Chez Saloum Immo : », affiché tel quel (casse comprise). */
  chezNous: Fait;
};

const SOURCE_CARROUSEL = "Carrousel Instagram DaiftQ_iBJd, 08.07.2026 (signé Saloum Immo Consulting)";
const PUBLIE = { date: "2026-07-08" };

export const DOCUMENTS: Document[] = [
  {
    cle: "delib",
    nom: "Délibération",
    definition: f("Une décision d’une collectivité territoriale qui attribue un terrain.", SOURCE_CARROUSEL, PUBLIE),
    aSavoir: f(
      "Elle permet d’occuper le terrain sous conditions. C’est une première étape, pas un titre foncier.",
      SOURCE_CARROUSEL,
      PUBLIE,
    ),
    niveau: f("Protection limitée", SOURCE_CARROUSEL, PUBLIE),
    chezNous: f("obtention de titres fonciers et régularisation administrative.", "contenu-maquette §4, service 01, verbatim"),
  },
  {
    cle: "bail",
    nom: "Bail",
    definition: f(
      "Un droit accordé par l’État pour occuper et exploiter un terrain, pendant une durée déterminée.",
      SOURCE_CARROUSEL,
      PUBLIE,
    ),
    aSavoir: f(
      "Il peut être renouvelé selon les conditions en vigueur. Le terrain reste dans le domaine de l’État.",
      SOURCE_CARROUSEL,
      PUBLIE,
    ),
    niveau: f("Moyen à élevé", SOURCE_CARROUSEL, PUBLIE),
    chezNous: f("Recasement AIBD, offre d’avril 2025.", "contenu-maquette §5", { date: "2025-04" }),
  },
  {
    cle: "tf",
    nom: "Titre foncier",
    definition: f("Le terrain est immatriculé. Vous êtes reconnu propriétaire.", SOURCE_CARROUSEL, PUBLIE),
    aSavoir: f(
      "Les risques de litige sont fortement réduits. Il facilite la vente, la donation et le prêt bancaire.",
      SOURCE_CARROUSEL,
      PUBLIE,
    ),
    niveau: f("Très élevé", SOURCE_CARROUSEL, PUBLIE),
    chezNous: f("Sakina City et Sicap Keur Massar, titres individuels.", "contenu-maquette §5"),
  },
];

/** Seule occurrence du site : page Foncier, en gras. */
export const AVERTISSEMENT_STATUT =
  "Pour tout autre terrain, chez nous ou ailleurs, demandez le statut exact avant de verser quoi que ce soit : délibération, bail ou titre foncier.";

/** Sous les trois documents, page Foncier. */
export const SOURCE_DEFINITIONS = f(
  "Définitions et niveaux publiés par Saloum Immo sur Instagram le 8 juillet 2026.",
  SOURCE_CARROUSEL,
  PUBLIE,
);

/** Sous les trois niveaux, accueil. */
export const SOURCE_NIVEAUX = f("Niveaux publiés par Saloum Immo le 8 juillet 2026.", SOURCE_CARROUSEL, PUBLIE);
