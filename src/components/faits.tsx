import type { ReactNode } from "react";
import { cx } from "@/lib/base";

export type LigneFaits = { libelle: string; valeur: ReactNode };

/**
 * Tableau de faits (allegement.md, 2.5 et 2.6) : six lignes au plus. La clé en
 * 14 px gris, casse normale ; la valeur en texte courant. Un filet fin entre les
 * lignes, et nulle part ailleurs. Chiffres tabulaires.
 * Une valeur inconnue s'écrit « À demander. » : jamais de case vide.
 */
export function Faits({ lignes, className }: { lignes: LigneFaits[]; className?: string }) {
  return (
    <dl className={cx("tabular-nums", className)}>
      {lignes.map((l, i) => (
        <div
          key={l.libelle}
          className={cx(
            "grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-4 py-3.5 first:pt-0 last:pb-0 tab:grid-cols-[8.5rem_minmax(0,1fr)] tab:gap-x-6 desk:py-4",
            i > 0 && "border-t border-ligne",
          )}
        >
          <dt className="text-small text-doux">{l.libelle}</dt>
          <dd>{l.valeur}</dd>
        </div>
      ))}
    </dl>
  );
}
