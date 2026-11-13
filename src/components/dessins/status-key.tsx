import { STATUT_FONCIER_MOT, type StatutFoncier } from "@/content/types";
import { cx } from "@/lib/base";
import { Swatch } from "./swatch";

/**
 * Clé des hachures (3.7) : « Statut foncier, dans nos dessins », puis chaque
 * échantillon avec son mot. En tête de la rubrique Terrains et de toute page
 * qui dessine des lots. La page Terrains ajoute « non-publie ».
 */
export function StatusKey({
  etats = ["delib", "bail", "tf"],
  marge = "mt-4.5",
  className,
}: {
  etats?: StatutFoncier[];
  /** Marge au-dessus (remplace celle par défaut). */
  marge?: string;
  className?: string;
}) {
  return (
    <div className={cx("border-t border-rule pt-3.5", marge, className)}>
      <p className="font-mono text-1 leading-label font-medium text-ink-2">Statut foncier, dans nos dessins</p>
      <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 tab:mt-2.5 tab:gap-x-5 tab:gap-y-2.5">
        {etats.map((s) => (
          <li key={s} className="inline-flex items-center gap-2 text-2 font-semibold text-ink tab:gap-2.5">
            <Swatch statut={s} taille="cle" />
            {STATUT_FONCIER_MOT[s]}
          </li>
        ))}
      </ul>
    </div>
  );
}
