// Messages WhatsApp pré-rédigés. Ce sont des textes de microcopie, pas des faits.
// Le message part dans le lien wa.me. Son texte ne s'affiche que sur la page
// Contact (allegement.md, 2.9) : le texte affiché et le paramètre « text= » du
// lien viennent de la même chaîne, jamais de deux sources.

export type Message = {
  texte: string;
  /** true : message à compléter ; les trous s'écrivent « … », jamais entre crochets. */
  gabarit?: boolean;
};

export const MESSAGES = {
  lacTown: { texte: "Bonjour, je voudrais les prix et les lots disponibles à Lac Town." },
  sakinaCity: { texte: "Bonjour, je voudrais le prix d’une parcelle à Sakina City." },
  sicapKeurMassar: { texte: "Bonjour, quels lots restent disponibles à Sicap Keur Massar, et à quel prix ?" },
  recasementAibd: { texte: "Bonjour, l’offre Recasement AIBD est-elle encore disponible ?" },
  proprietaire: {
    texte: "Bonjour, j’ai un terrain à …, d’environ … m². Je voudrais le faire aménager.",
    gabarit: true,
  },
  diaspora: { texte: "Bonjour, je vis à l’étranger. Je voudrais voir en vidéo les terrains disponibles." },
  question: { texte: "Bonjour, j’ai une question sur vos terrains." },
  /** Page Comprendre le foncier : son appel final parle d'un doute sur un papier, pas d'un terrain à vendre. */
  documents: { texte: "Bonjour, je voudrais faire vérifier les documents d’un terrain." },
  bayakh: { texte: "Bonjour, je voudrais des informations sur le site de Bayakh." },
  niague: { texte: "Bonjour, je voudrais des informations sur le projet de Niague." },
} satisfies Record<string, Message>;

/**
 * Un libellé par intention, le même partout (allegement.md, 2.9).
 * Le mot « WhatsApp » est toujours écrit : aucun logo.
 */
export const LIBELLES = {
  programme: "Prix et lots libres sur WhatsApp",
  /** Pied d'une carte de programme, où la place manque. Nom accessible : `programmeCourt`, puis le nom. */
  programmeCourt: "Prix sur WhatsApp",
  recasementAibd: "Disponibilité sur WhatsApp",
  proprietaire: "Décrire mon terrain sur WhatsApp",
  diaspora: "Commencer sur WhatsApp",
  autreSite: "Demander",
  question: "Écrire sur WhatsApp",
  appel: "Appeler",
} as const;
