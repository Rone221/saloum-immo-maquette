// Demandes de contact de la maquette (direction v4, section 7). Rien ne part sur le
// réseau : la maquette n'a ni serveur ni base de données.
// Une demande envoyée depuis le formulaire de la page Contact est gardée dans le
// navigateur (localStorage). L'admin de démonstration la relit depuis ce même
// navigateur, à côté de ses demandes d'exemple, et peut les effacer. Le jour où un
// service existera, seules les trois fonctions de ce fichier changeront.

/** Les trois choix du champ « Vous cherchez », ceux des trois messages WhatsApp. */
export type SujetDemande = "terrain" | "amenagement" | "etranger";

export type Demande = {
  id: string;
  /** Date d'envoi, ISO complète : celle de l'horloge du visiteur. */
  date: string;
  nom: string;
  /** Téléphone ou WhatsApp, tel que saisi. */
  telephone: string;
  sujet: SujetDemande;
  message: string;
};

/** Libellés des trois choix, dans l'ordre du formulaire. */
export const SUJETS: Record<SujetDemande, string> = {
  terrain: "Acheter un terrain",
  amenagement: "Faire aménager mon terrain",
  etranger: "Acheter depuis l’étranger",
};

export const CLE_DEMANDES = "saloum-immo:demandes";

/**
 * Le signal envoyé dans l'onglet quand les demandes gardées sont effacées. L'événement
 * « storage » du navigateur ne prévient que les autres onglets : qui affiche les
 * demandes dans celui-ci écoute aussi ce signal.
 */
export const SIGNAL_DEMANDES = "saloum-immo:demandes-changees";

/** Les demandes gardées dans ce navigateur, la plus récente d'abord. Jamais d'erreur. */
export function lireDemandes(): Demande[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(CLE_DEMANDES);
    const liste: unknown = brut ? JSON.parse(brut) : [];
    return Array.isArray(liste) ? (liste as Demande[]) : [];
  } catch {
    return [];
  }
}

/** Garde une demande dans ce navigateur et la rend, datée. Sans stockage, elle est rendue quand même. */
export function ajouterDemande(saisie: Omit<Demande, "id" | "date">): Demande {
  const date = new Date().toISOString();
  const demande: Demande = { ...saisie, id: `d-${date}`, date };
  try {
    window.localStorage.setItem(CLE_DEMANDES, JSON.stringify([demande, ...lireDemandes()].slice(0, 50)));
  } catch {
    // Stockage refusé (navigation privée) : le récépissé s'affiche, la liste restera vide.
  }
  return demande;
}

/**
 * Efface les demandes gardées dans ce navigateur, toutes, et prévient l'onglet
 * (SIGNAL_DEMANDES). Rien d'autre n'est touché. Jamais d'erreur.
 */
export function viderDemandes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CLE_DEMANDES);
  } catch {
    // Stockage refusé (navigation privée) : rien n'y était gardé.
  }
  window.dispatchEvent(new Event(SIGNAL_DEMANDES));
}
