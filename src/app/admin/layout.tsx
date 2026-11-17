// L'espace client de démonstration (direction v4, section 7 :
// recherche/revue-4/direction-v4.md). UNE MAQUETTE : aucun serveur, aucune base, aucune
// requête. Elle montre l'interface, rien de plus. Quatre écrans :
//   /admin/connexion/   l'écran de connexion (rien à saisir, un bouton pour entrer) ;
//   /admin/             le tableau de bord : trafic, dernières demandes, contenus ;
//   /admin/demandes/    le registre des demandes de la fiche de la page Contact ;
//   /admin/contenus/    les rubriques de contenus, et pour chacune ses fiches en champs.
// Les trois derniers partagent leur cadre (navigation, bandeau) : (ecrans)/layout.tsx.
//
// L'espace client a son propre habillage : ni l'en-tête public, ni le pied, ni la voie
// de lecture. Le layout racine les monte pour toutes les pages ; la voie se retire
// seule de /admin/, l'en-tête et le pied sont retirés ici par la feuille de style
// (admin.css : body:has(.admin)), en attendant que le layout racine les saute.
//
// Jamais indexé, quoi que décide un jour le site public.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ESPACE } from "@/content/demo/textes";
import "@/components/admin/admin.css";

export const metadata: Metadata = {
  title: {
    default: "Espace client (démonstration)",
    template: "%s · Espace client (démonstration) · Saloum Immo",
  },
  description: "Maquette de l’espace client de Saloum Immo. Données de démonstration : rien n’est enregistré.",
  robots: { index: false, follow: false },
};

export default function EspaceClient({ children }: { children: ReactNode }) {
  return (
    // .admin : le repère de la feuille de style, pour retirer l'en-tête et le pied du site.
    <div className="admin">
      {/* Le lien d'évitement du site est retiré avec son en-tête : celui-ci mène à l'écran. */}
      <a href="#ecran" className="skip">
        {ESPACE.evitement}
      </a>
      {children}
    </div>
  );
}
