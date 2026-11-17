// Forme commune des données du site (spécification, annexe A).
//
// Un fait affiché vient toujours d'ici, avec sa source et son statut.

export type Statut = "ok" | "a-valider";

export type Fait = {
  /** Ce qui s'affiche. */
  texte: string;
  /** D'où vient le fait : « YouTube Wq8pwLDb4L0 », « contenu-maquette §5 ». */
  source: string;
  /** AAAA-MM-JJ, ou AAAA-MM quand le jour n'est pas connu. */
  date?: string;
  statut: Statut;
  /** Adresse publique et stable de la source, quand elle existe. */
  lien?: string;
};

/** Raccourci d'écriture pour les fichiers de données. */
export function f(texte: string, source: string, autres: Partial<Omit<Fait, "texte" | "source">> = {}): Fait {
  return { texte, source, statut: "ok", ...autres };
}

/** Même chose, pour un fait à valider. */
export function fv(texte: string, source: string, autres: Partial<Omit<Fait, "texte" | "source" | "statut">> = {}): Fait {
  return { texte, source, ...autres, statut: "a-valider" };
}
