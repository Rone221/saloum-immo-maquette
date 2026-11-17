// Comprendre le foncier : les trois documents, la liste « Avant d'acheter,
// vérifiez avec nous » et l'avertissement. Ces blocs vivent sur la page Foncier
// seulement (allegement.md, 2.2) ; l'accueil n'en garde que les trois documents, avec
// leur niveau et leur définition, dans la même échelle (components/echelle-papiers.tsx).
//
// Sources : carrousel publié par Saloum Immo sur Instagram le 8 juillet 2026
// pour les définitions et les niveaux ; légende de l'interview du DG (8 juin 2026) pour
// la liste ; TikTok du 15 octobre 2025 pour le notaire.
// C'est une vérification proposée, pas une garantie : ne jamais écrire
// « nous garantissons » ni « sans risque ».

import { f, type Fait } from "./types";

/** Titre sans point final (règle des titres, src/lib/classes.ts). */
export const TITRE_FONCIER = "Le bon papier avant le bon prix";

/** Chapeau de la page Foncier, qui porte aussi la liste à vérifier. */
export const INTRO_FONCIER =
  "Avant de payer, sachez quel document vous achetez. Voici ce que nous faisons, et ce que vous pouvez vérifier avec nous.";

/** Chapeau de la section foncier de l'accueil : elle ne montre que les trois documents. */
export const INTRO_FONCIER_ACCUEIL =
  "Avant de payer, sachez quel document vous achetez. Les trois, du moins au plus protégé.";

// « de l'achat » : la source parle de l'achat. Sans ces mots, posée près des étapes du
// chantier (ouverture de l'accueil) ou des étapes de la diaspora, la phrase mettrait un
// notaire au débroussaillage.
export const NOTAIRE = f("Un notaire agréé accompagne chaque étape de l’achat.", "TikTok, 15.10.2025 ; contenu-maquette §6", {
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

const SOURCE_CARROUSEL = "Carrousel Instagram DaiftQ_iBJd, 08.07.2026";
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

/**
 * Seule occurrence du site : page Foncier, en grand, sur l'aplat de latérite. La phrase
 * nomme les trois documents en minuscules, tels que DOCUMENTS les nomme : la page les y
 * repère pour poser chacun sur le trait de son document (app/foncier/page.tsx,
 * Avertissement). Un nom changé d'un côté seulement, et la phrase sort sans ses traits.
 */
export const AVERTISSEMENT_STATUT =
  "Pour tout autre terrain, chez nous ou ailleurs, demandez le statut exact avant de verser quoi que ce soit : délibération, bail ou titre foncier.";

/** Sous les trois documents : page Foncier et accueil, qui montrent tous deux les définitions. */
export const SOURCE_DEFINITIONS = f(
  "Définitions et niveaux publiés par Saloum Immo sur Instagram le 8 juillet 2026.",
  SOURCE_CARROUSEL,
  PUBLIE,
);

/**
 * Trois preuves sous l'ouverture de l'accueil (revue 2). Rien de neuf : des faits
 * déjà publiés, dits en deux temps. Ce sont des repères, pas des garanties.
 */
export const PREUVES: { titre: string; texte: Fait }[] = [
  { titre: "Titres fonciers individuels", texte: f("À Sakina City et à Sicap Keur Massar.", "contenu-maquette §5") },
  {
    titre: "Un notaire agréé",
    texte: f("Il accompagne chaque étape de l’achat.", "TikTok, 15.10.2025 ; contenu-maquette §6", { date: "2025-10-15" }),
  },
  { titre: "Visite avec notre équipe", texte: f("Sur place, sur rendez-vous.", "contenu-maquette §6 (visites accompagnées)") },
];
