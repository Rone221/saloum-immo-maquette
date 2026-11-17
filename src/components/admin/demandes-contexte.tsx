"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { DemandeExemple, EtatDemande } from "@/content/demo/demandes";
// lib/demandes.ts : la seule lecture des demandes gardées dans le navigateur, et le seul
// geste qui les efface. Rien ne part sur le réseau, ici non plus.
import { CLE_DEMANDES, lireDemandes, SIGNAL_DEMANDES, SUJETS, viderDemandes, type Demande } from "@/lib/demandes";

/** Une demande du registre : d'où elle vient, et son état. */
export type DemandeAdmin = Demande & { origine: "exemple" | "navigateur"; etat: EtatDemande };

type Registre = {
  /** Les demandes d'exemple et celles de ce navigateur, la plus récente d'abord. */
  demandes: DemandeAdmin[];
  /** Combien sont nouvelles. */
  nouvelles: number;
  /** Le script tourne : les gestes (marquer, filtrer) peuvent s'allumer. */
  vivant: boolean;
  changerEtat: (id: string, etat: EtatDemande) => void;
  /** Efface les demandes de ce navigateur. Celles d'exemple restent. */
  effacerNavigateur: () => void;
};

const Contexte = createContext<Registre | null>(null);

/**
 * Le registre suit ce que le navigateur garde. Deux signaux : « storage », quand un
 * autre onglet écrit (une fiche envoyée depuis la page Contact) ; celui de
 * lib/demandes.ts, quand cet onglet-ci efface (le navigateur ne le prévient pas de ses
 * propres écritures).
 */
const abonnerStockage = (rappel: () => void) => {
  window.addEventListener("storage", rappel);
  window.addEventListener(SIGNAL_DEMANDES, rappel);
  return () => {
    window.removeEventListener("storage", rappel);
    window.removeEventListener(SIGNAL_DEMANDES, rappel);
  };
};
/**
 * Ce que le navigateur garde, tel quel : une chaîne, la même tant que rien ne change.
 * Elle sert de signal. La lecture elle-même reste celle de lib/demandes.ts.
 */
const lireBrut = () => {
  try {
    return window.localStorage.getItem(CLE_DEMANDES) ?? "";
  } catch {
    // Stockage refusé (navigation privée) : seules les demandes d'exemple s'affichent.
    return "";
  }
};
const sansStockage = () => "";
const sansAbonnement = () => () => {};

/** Ce navigateur peut garder d'anciennes demandes, ou autre chose sous la même clé : on ne garde que les fiches entières. */
function entiere(d: Demande | null | undefined): d is Demande {
  return (
    !!d &&
    typeof d.id === "string" &&
    typeof d.date === "string" &&
    !Number.isNaN(new Date(d.date).getTime()) &&
    typeof d.nom === "string" &&
    typeof d.telephone === "string" &&
    typeof d.message === "string" &&
    d.sujet in SUJETS
  );
}

/**
 * Le registre des demandes de l'espace client, pour tous ses écrans : la navigation
 * (le nombre de nouvelles), le tableau de bord (les dernières), l'écran des demandes.
 *
 * Deux sources : les demandes d'exemple (content/demo/demandes.ts), et celles que le
 * visiteur a envoyées depuis la fiche de la page Contact, dans ce même navigateur.
 * L'état « traitée » n'est gardé nulle part : il vit ici, en mémoire, tant que
 * l'espace client reste ouvert. Recharger la page le remet à zéro. C'est voulu : la
 * maquette n'enregistre rien.
 */
export function FournisseurDemandes({ exemples, children }: { exemples: DemandeExemple[]; children: ReactNode }) {
  const brut = useSyncExternalStore(abonnerStockage, lireBrut, sansStockage);
  const vivant = useSyncExternalStore(
    sansAbonnement,
    () => true,
    () => false,
  );
  const [etats, setEtats] = useState<Record<string, EtatDemande>>({});

  const demandes = useMemo<DemandeAdmin[]>(() => {
    // `brut` dit quand relire : vide, il n'y a rien à lire.
    const duNavigateur = brut ? lireDemandes().filter(entiere) : [];
    return [
      ...duNavigateur.map((d): DemandeAdmin => ({ ...d, origine: "navigateur", etat: etats[d.id] ?? "nouvelle" })),
      ...exemples.map((d): DemandeAdmin => ({ ...d, origine: "exemple", etat: etats[d.id] ?? d.etat })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [brut, exemples, etats]);

  const changerEtat = useCallback((id: string, etat: EtatDemande) => setEtats((avant) => ({ ...avant, [id]: etat })), []);

  const registre = useMemo<Registre>(
    () => ({
      demandes,
      nouvelles: demandes.filter((d) => d.etat === "nouvelle").length,
      vivant,
      changerEtat,
      // Le signal de lib/demandes.ts fait relire le stockage : la liste se refait seule.
      effacerNavigateur: viderDemandes,
    }),
    [demandes, vivant, changerEtat],
  );

  return <Contexte.Provider value={registre}>{children}</Contexte.Provider>;
}

export function useDemandes(): Registre {
  const registre = useContext(Contexte);
  if (!registre) throw new Error("useDemandes : hors de FournisseurDemandes.");
  return registre;
}
