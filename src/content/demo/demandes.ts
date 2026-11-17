// Demandes d'exemple de l'espace client (direction v4, section 7 :
// recherche/revue-4/direction-v4.md).
//
// TOUT EST INVENTÉ, et dit comme tel à l'écran. Personne de réel : des noms neutres
// (« Visiteur d'exemple 1 »), des numéros manifestement fictifs (des zéros). Les
// messages reprennent les textes WhatsApp déjà écrits pour le site (messages.ts) : un
// exemple n'invente aucun fait sur un terrain.
//
// Les vraies demandes de la démonstration sont celles que le visiteur envoie lui-même
// depuis la fiche de la page Contact : elles restent dans son navigateur
// (lib/demandes.ts), et l'espace client les relit de là, à côté de celles-ci.

import type { Demande, SujetDemande } from "@/lib/demandes";
import { MESSAGES } from "../messages";

/** L'état d'une demande dans le registre. */
export type EtatDemande = "nouvelle" | "traitee";

export type DemandeExemple = Demande & { etat: EtatDemande };

/**
 * Une demande d'exemple. La date est écrite sans fuseau (« 2026-11-16T09:42:00 ») :
 * c'est une heure de montre, la même pour qui construit la page et pour qui la lit.
 */
function exemple(
  rang: number,
  date: string,
  telephone: string,
  sujet: SujetDemande,
  message: string,
  etat: EtatDemande,
): DemandeExemple {
  return { id: `exemple-${rang}`, date, nom: `Visiteur d’exemple ${rang}`, telephone, sujet, message, etat };
}

/** Six demandes, de la plus récente à la plus ancienne : trois nouvelles, trois traitées. */
export const DEMANDES_EXEMPLE: DemandeExemple[] = [
  exemple(1, "2026-11-16T18:20:00", "77 000 00 00", "terrain", MESSAGES.lacTown.texte, "nouvelle"),
  exemple(2, "2026-11-16T09:42:00", "78 000 00 00", "etranger", MESSAGES.diaspora.texte, "nouvelle"),
  // Sans message : le champ est facultatif sur la fiche, le registre le montre aussi.
  exemple(3, "2026-11-14T15:05:00", "76 000 00 00", "amenagement", "", "nouvelle"),
  exemple(4, "2026-11-12T11:30:00", "70 000 00 00", "terrain", MESSAGES.sicapKeurMassar.texte, "traitee"),
  exemple(5, "2026-11-09T20:14:00", "75 000 00 00", "terrain", MESSAGES.sakinaCity.texte, "traitee"),
  exemple(6, "2026-11-05T08:51:00", "77 000 00 00", "etranger", MESSAGES.recasementAibd.texte, "traitee"),
];
