"use client";

import Link from "next/link";
import { useChemin } from "@/components/nav-links";
import { adresseRubrique, ECRANS, ESPACE, RUBRIQUES } from "@/content/demo/textes";
import { typo } from "@/lib/format";
import { useDemandes } from "./demandes-contexte";

/**
 * La navigation de l'espace client : trois écrans, et sous « Contenus » ses cinq
 * rubriques. Au bureau, une colonne étroite sur le bleu de plan ; sur téléphone, une
 * barre en haut, les trois écrans en ligne (admin.css).
 *
 * L'écran courant porte une petite borne blanche, comme celles plantées au pied du
 * site : elle dit où l'on est. « Demandes » porte le nombre de demandes nouvelles.
 */
export function NavAdmin() {
  const chemin = useChemin();
  const { nouvelles } = useDemandes();

  return (
    <nav aria-label={ESPACE.navigation} className="admin-nav">
      <ul className="admin-nav-ecrans">
        {ECRANS.map((e) => {
          const ici = e.href === "/admin/" ? chemin === e.href : chemin.startsWith(e.href);
          // « page » sur l'écran même, « true » quand on est dedans (une rubrique de contenus).
          const courant = chemin === e.href ? "page" : ici ? "true" : undefined;
          return (
            <li key={e.href}>
              <Link href={e.href} aria-current={courant} className="admin-nav-lien">
                <span aria-hidden="true" className="admin-nav-borne" />
                <span>{typo(e.libelle)}</span>
                {e.href === "/admin/demandes/" && nouvelles > 0 ? (
                  <span className="admin-nav-compte mesure">
                    {nouvelles}
                    <span className="sr-only"> {ESPACE.nouvelles}</span>
                  </span>
                ) : null}
              </Link>
              {e.href === "/admin/contenus/" ? (
                <ul className="admin-nav-rubriques">
                  {RUBRIQUES.map((r) => {
                    const href = adresseRubrique(r.cle);
                    return (
                      <li key={r.cle}>
                        <Link href={href} aria-current={chemin === href ? "page" : undefined} className="admin-nav-lien admin-nav-rubrique">
                          <span aria-hidden="true" className="admin-nav-borne" />
                          <span>{typo(r.nom)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
