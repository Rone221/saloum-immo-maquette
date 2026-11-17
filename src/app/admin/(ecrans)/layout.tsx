// Le cadre des écrans de travail de l'espace client : le tableau de bord, les demandes,
// les contenus. La connexion n'est pas dans ce groupe : elle n'a ni navigation ni
// registre (le dossier entre parenthèses ne compte pas dans l'adresse).
//
// Au bureau, une colonne étroite sur le bleu de plan : le logo, les trois écrans, les
// cinq rubriques de contenus, puis « Voir le site » et « Quitter la démonstration ».
// Sur téléphone, une barre en haut : le logo et les deux sorties, puis les trois écrans
// en ligne, qui restent collés. Le bandeau « Données de démonstration » coiffe l'écran.
//
// Le registre des demandes enveloppe tout : la navigation (le nombre de nouvelles), le
// tableau de bord et l'écran des demandes lisent les mêmes demandes, et une demande
// marquée traitée le reste d'un écran à l'autre, tant que l'espace client est ouvert.

import Link from "next/link";
import type { ReactNode } from "react";
import { FournisseurDemandes } from "@/components/admin/demandes-contexte";
import { NavAdmin } from "@/components/admin/navigation";
import { Bandeau } from "@/components/admin/pieces";
import { DEMANDES_EXEMPLE } from "@/content/demo/demandes";
import { ESPACE } from "@/content/demo/textes";
import { asset } from "@/lib/base";
import { typo } from "@/lib/format";

export default function CadreEcrans({ children }: { children: ReactNode }) {
  return (
    <FournisseurDemandes exemples={DEMANDES_EXEMPLE}>
      <div className="admin-cadre">
        {/* sur-plan : les couleurs de rôle du bleu de plan, pour tout ce que la barre porte. */}
        <div className="admin-barre sur-plan">
          <div className="admin-marque">
            {/* Le logo officiel, jamais recoloré : sur le plan, il lui faut sa plaque. */}
            <Link href="/admin/" aria-label={ESPACE.accueil} className="admin-plaque">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/2269-logo-horizontal-420.png")} width={420} height={160} alt="" />
            </Link>
            <p className="admin-marque-nom etiquette">{typo(ESPACE.nom)}</p>
          </div>

          <NavAdmin />

          <ul className="admin-sorties">
            <li>
              <Link href="/" className="admin-sortie">
                {typo(ESPACE.voirSite)}
              </Link>
            </li>
            <li>
              <Link href="/admin/connexion/" className="admin-sortie" aria-label={ESPACE.quitter}>
                <span className="admin-sortie-long">{typo(ESPACE.quitter)}</span>
                <span aria-hidden="true" className="admin-sortie-court">
                  {typo(ESPACE.quitterCourt)}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <Bandeau />

        {/* tabIndex : la cible du lien d'évitement prend le focus. */}
        <div id="ecran" tabIndex={-1} className="admin-ecran">
          {children}
        </div>
      </div>
    </FournisseurDemandes>
  );
}
