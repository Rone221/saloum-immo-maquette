import type { CSSProperties } from "react";
import type { Lot } from "@/content/programmes";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Planche des lots (3.9) : chaque lot publié dessiné carré, à sa surface, à
 * l'échelle (côté = √surface × --m), sur un quadrillage de 5 m. Pas de borne
 * orange, pas de lot « vendu », pas d'autre forme que le carré tant qu'on n'a
 * pas le plan de bornage.
 */
export function LotPlate({
  lots,
  titre,
  avertissement,
  className,
}: {
  lots: Lot[];
  /** « Lots publiés en 2026, à l'échelle » */
  titre: string;
  /** « Certains lots ont pu partir depuis. Demandez ceux qui restent. » */
  avertissement?: string;
  className?: string;
}) {
  return (
    <figure className={cx("plate plate-grid", className)}>
      <div className="plate-head">
        <p className="plate-t">{typo(titre)}</p>
        <div className="scalebar" aria-hidden="true">
          <span className="sb-bar" />
          <span className="sb-l">0</span>
          <span className="sb-m">5</span>
          <span className="sb-r">10 m</span>
        </div>
      </div>
      <ul className="lots">
        {lots.map((l) => (
          <li
            key={l.numero}
            className={cx("lot hatch-tf-light", l.note && "lot-a-note")}
            style={{ "--s": Math.sqrt(l.surface).toFixed(2) } as CSSProperties}
          >
            <span className="lot-tag">
              <span className="lot-k">Lot</span>
              <span className="lot-n">{l.numero}</span>
              <span className="lot-m">{typo(`${l.surface} m²`)}</span>
            </span>
            {l.note ? <span className="lot-note">{typo(l.note)}</span> : null}
          </li>
        ))}
      </ul>
      <figcaption className="plate-cap">
        <span>Chaque lot est dessiné carré, à sa surface publiée. Sa forme réelle figure sur le plan de bornage.</span>
        {avertissement ? <strong>{typo(avertissement)}</strong> : null}
      </figcaption>
    </figure>
  );
}
