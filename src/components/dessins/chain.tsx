import type { CSSProperties } from "react";
import { FRISE, FRISE_AXE, type EtapeFrise } from "@/content/site";
import { typo } from "@/lib/format";

/**
 * Frise en chaînage (3.17) : une colonne par année de 2003 à 2026, une ligne par
 * étape. Durée connue : barre pleine ; date ponctuelle : carré ; durée imprécise :
 * pointillés ; début connu, fin imprécise : plein puis pointillés ; Saloum Immo :
 * barre trait de 2022 à 2026 et repère orange au départ.
 * Mobile : liste à deux colonnes (année, intitulé), années imprécises soulignées.
 */
export function Chain({
  etapes = FRISE,
  axe = FRISE_AXE,
  label = "Parcours de Babacar Ndiaye",
}: {
  etapes?: EtapeFrise[];
  axe?: { annee: string; colonne: number }[];
  label?: string;
}) {
  const derniere = Math.max(...axe.map((a) => a.colonne));
  return (
    <div className="chain">
      <ol className="chain-rows" aria-label={label}>
        {etapes.map((e, i) => (
          <li
            key={e.intitule.texte}
            data-trace={e.trace}
            data-imprecise={e.imprecise ? "" : undefined}
            style={{ "--a": e.debut, "--b": e.fin, "--r": i + 1 } as CSSProperties}
          >
            <span className="ch-lab">
              <span className="ch-y">{e.annee.texte}</span>
              <span className="ch-t">{typo(e.intitule.texte)}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="chain-axis" aria-hidden="true">
        {axe.map((a) => (
          <span
            key={a.annee}
            className={a.colonne === derniere ? "end" : undefined}
            style={{ "--a": a.colonne } as CSSProperties}
          >
            {a.annee}
          </span>
        ))}
      </div>
      <p className="chain-note">
        <span className="dots-x" aria-hidden="true" />
        {typo("Pointillés : dates non précisées")}
      </p>
    </div>
  );
}
