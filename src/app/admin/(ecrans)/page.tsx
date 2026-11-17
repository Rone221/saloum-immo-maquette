// Tableau de bord de l'espace client de démonstration (direction v4, section 7).
// Six blocs, bornés de 01 à 06, deux de front au bureau, le large et l'étroit en
// quinconce :
// 01. Le trafic sur une période : quatre compteurs en cartouche, puis les visites par
//     jour, dessinées comme un profil en long (trait de terrain, hachures du sol
//     dessous, moyenne en trait mixte).
// 02. Les pages les plus vues. 03. La provenance. 04. Les appareils. Trois
//     classements, une cote sous chaque ligne.
// 05. Les dernières demandes : les mêmes que dans le registre.
// 06. Les raccourcis vers les rubriques de contenus, en cartouche.
//
// Les chiffres de trafic et les demandes d'exemple sont inventés (content/demo), et dits
// comme tels : par le bandeau, puis une fois sous le profil des visites. Les noms des
// pages et les rubriques sont ceux du site.

import type { Metadata } from "next";
import { DemandesRecentes } from "@/components/admin/demandes-recentes";
import { TeteBloc, TeteEcran } from "@/components/admin/pieces";
import { rubriquesAdmin } from "@/components/admin/rubriques";
import { TableauTrafic } from "@/components/admin/trafic";
import { Fleche, Lien } from "@/components/text-link";
import { adresseRubrique, TABLEAU } from "@/content/demo/textes";
import { PERIODE_PAR_DEFAUT, PERIODES_TRAFIC } from "@/content/demo/trafic";
import { T3 } from "@/lib/classes";
import { typo } from "@/lib/format";

export const metadata: Metadata = { title: TABLEAU.titre };

export default function TableauDeBord() {
  const rubriques = rubriquesAdmin();
  return (
    <div className="admin-page">
      <TeteEcran titre={TABLEAU.titre} />

      {/* 01 à 04 : la période, et tout ce qu'elle règle. Puis, dans la même grille, les
          deux blocs qui n'en dépendent pas. */}
      <TableauTrafic periodes={PERIODES_TRAFIC} parDefaut={PERIODE_PAR_DEFAUT}>
        {/* 05 */}
        <DemandesRecentes numero="05" className="admin-large" />

        {/* 06 : une case par rubrique, son nom en Besley, ce qu'elle contient dessous. La
            sixième case mène à l'écran des contenus. */}
        <section aria-labelledby="b-contenus" className="admin-bloc">
          <TeteBloc numero="06" nom={TABLEAU.contenus.nom} quantite={`${rubriques.length} ${TABLEAU.contenus.quantite}`} id="b-contenus" />
          <ul className="raccourcis">
            {rubriques.map((r) => (
              <li key={r.cle}>
                <Lien href={adresseRubrique(r.cle)} className="raccourci group">
                  <span className="min-w-0 flex-1">
                    <span className={`${T3} block`}>{typo(r.nom)}</span>
                    <span className="mt-1.5 block text-small text-doux">{r.contenu}</span>
                  </span>
                  <Fleche />
                </Lien>
              </li>
            ))}
            <li>
              <Lien href="/admin/contenus/" className="raccourci raccourci-tous group">
                <span className="min-w-0 flex-1 font-semibold underline decoration-1 underline-offset-4">
                  {typo(TABLEAU.contenus.tous)}
                </span>
                <Fleche />
              </Lien>
            </li>
          </ul>
        </section>
      </TableauTrafic>
    </div>
  );
}
