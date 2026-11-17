// Les contenus de l'espace client de démonstration (direction v4, section 7) : la liste
// des rubriques. Un tableau, une ligne par rubrique : son nom
// en Besley, qui mène à ses fiches ; ce qu'elle contient, compté dans le contenu du
// site ; où elle s'affiche. Rien d'inventé ici : tout vient de src/content.

import type { Metadata } from "next";
import { TeteBloc, TeteEcran } from "@/components/admin/pieces";
import { rubriquesAdmin } from "@/components/admin/rubriques";
import { Fleche, Lien } from "@/components/text-link";
import { adresseRubrique, CONTENUS } from "@/content/demo/textes";
import { NOM } from "@/lib/classes";
import { typo } from "@/lib/format";

export const metadata: Metadata = { title: CONTENUS.titre };

export default function Contenus() {
  const rubriques = rubriquesAdmin();
  const t = CONTENUS;
  return (
    <div className="admin-page">
      <TeteEcran titre={t.titre} chapeau={t.chapeau} />

      <section aria-labelledby="b-rubriques" className="admin-bloc">
        <TeteBloc numero="01" nom={t.sommaire} quantite={`${rubriques.length} ${t.quantite}`} id="b-rubriques" />
        {/* Un vrai tableau, dont les lignes changent de forme avec la largeur : les rôles
            lui gardent sa nature. La ligne entière mène à la rubrique (le lien du nom
            s'étend sur elle). */}
        <table role="table" className="rubriques">
          <caption className="sr-only">{typo(t.legende)}</caption>
          <thead role="rowgroup">
            <tr role="row" className="rubriques-tete">
              <th role="columnheader" scope="col" className="etiquette text-doux">
                {typo(t.colonnes.rubrique)}
              </th>
              <th role="columnheader" scope="col" className="etiquette text-doux">
                {typo(t.colonnes.contenu)}
              </th>
              <th role="columnheader" scope="col" className="etiquette text-doux">
                {typo(t.colonnes.pages)}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {rubriques.map((r) => (
              <tr role="row" key={r.cle} className="rubrique group">
                <th role="rowheader" scope="row">
                  <Lien href={adresseRubrique(r.cle)} className={`${NOM} rubrique-lien`}>
                    <span>{typo(r.nom)}</span>
                    {/* La flèche se range au bout de la ligne (admin.css). */}
                    <span aria-hidden="true" className="rubrique-fleche">
                      <Fleche />
                    </span>
                  </Lien>
                </th>
                <td role="cell" data-cle={typo(t.colonnes.contenu)}>
                  {r.contenu}
                </td>
                <td role="cell" data-cle={typo(t.colonnes.pages)} className="text-doux">
                  {r.pages}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
