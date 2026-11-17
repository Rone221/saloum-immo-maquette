"use client";

import { TextLink } from "@/components/text-link";
import { DEMANDES, TABLEAU } from "@/content/demo/textes";
import { SUJETS } from "@/lib/demandes";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { useDemandes } from "./demandes-contexte";
import { jourEtHeure } from "./outils";
import { Carre, TeteBloc } from "./pieces";

/** Combien de demandes le tableau de bord montre. Le registre a les autres. */
const COMBIEN = 4;

/**
 * Les dernières demandes, sur le tableau de bord : la date en marge, le nom, l'objet,
 * l'état avec son carré. Les mêmes que dans le registre (elles sortent du même
 * contexte) : une demande envoyée depuis la fiche de la page Contact, dans ce
 * navigateur, arrive en tête ; une demande marquée traitée l'est ici aussi.
 */
export function DemandesRecentes({ numero, className }: { numero: string; className?: string }) {
  const t = TABLEAU.demandes;
  const { demandes, nouvelles } = useDemandes();
  const quantite = nouvelles === 0 ? t.aucune : `${nouvelles} ${nouvelles > 1 ? t.nouvelles : t.nouvelle}`;

  return (
    <section aria-labelledby="b-demandes" className={cx("admin-bloc", className)}>
      <TeteBloc numero={numero} nom={t.nom} quantite={quantite} id="b-demandes" />
      <ol className="recentes">
        {demandes.slice(0, COMBIEN).map((d) => {
          const { jour, heure } = jourEtHeure(d.date);
          return (
            <li key={d.id} className="recente">
              <p className="recente-date">
                <span className="mesure text-fort">{typo(jour)}</span>
                <span className="text-small text-doux">{heure}</span>
              </p>
              <div className="min-w-0">
                <p className="font-semibold text-fort [overflow-wrap:anywhere]">{d.origine === "exemple" ? typo(d.nom) : d.nom}</p>
                <p className="text-small text-doux">{typo(SUJETS[d.sujet])}</p>
                {d.origine === "navigateur" ? <p className="etiquette mt-1.5 text-accent">{typo(DEMANDES.origines.navigateur)}</p> : null}
              </div>
              <p className="admin-etat etiquette" data-etat={d.etat}>
                <Carre plein={d.etat === "nouvelle"} />
                <span>{typo(DEMANDES.etats[d.etat])}</span>
              </p>
            </li>
          );
        })}
      </ol>
      {/* Pas de note ici : le bandeau dit ce qui est inventé, le registre des demandes le redit. */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6">
        <TextLink href="/admin/demandes/">{t.toutes}</TextLink>
      </div>
    </section>
  );
}
