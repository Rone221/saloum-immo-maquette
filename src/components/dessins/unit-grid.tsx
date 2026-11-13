import type { Fait } from "@/content/types";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Trame des parcelles (3.9) : une case par parcelle publiée, 13 colonnes,
 * quadrillage léger du titre foncier. On ne dessine une trame que si le nombre
 * de parcelles est publié (jamais pour Lac Town).
 */
export function UnitGrid({
  nombre,
  surface,
  legende,
  statutPhrase = "toutes en titre foncier individuel",
  explication = "Une case par parcelle. Quadrillage : titre foncier individuel.",
  className,
}: {
  nombre: number;
  /** Surface d'une parcelle, en m². */
  surface: number;
  /** « 78 × 150 m² » */
  legende: Fait;
  statutPhrase?: string;
  explication?: string;
  className?: string;
}) {
  return (
    <figure className={cx("m-0", className)}>
      <div
        role="img"
        aria-label={`${nombre} cases, une par parcelle de ${surface} mètres carrés, ${statutPhrase}`}
        className="grid grid-cols-13 gap-0.75 tab:gap-1"
      >
        {Array.from({ length: nombre }, (_, i) => (
          <span key={i} className="aspect-square border border-trait hatch-tf-light [--p:6px]" />
        ))}
      </div>
      <figcaption className="mt-3.5 flex flex-col gap-1.5 tab:flex-row tab:items-baseline tab:gap-4.5">
        <strong className="flex-none text-5 leading-tight font-bold text-trait stretch-title">{typo(legende.texte)}</strong>
        <span className="text-2 leading-caption text-ink-2">{typo(explication)}</span>
      </figcaption>
    </figure>
  );
}
