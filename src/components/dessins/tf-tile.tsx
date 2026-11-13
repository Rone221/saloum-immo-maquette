import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Tuile « Titre » (3.12), étape 6 de la planche : bloc 4:3 au quadrillage léger
 * du titre foncier, « TF » en grand, et l'étiquette du titre mère.
 */
export function TfTile({
  titre,
  reference,
  className,
}: {
  /** « Titre mère, Sakina City » */
  titre: string;
  /** « TF 15026/R » */
  reference: string;
  className?: string;
}) {
  return (
    <div className={cx("tf-tile hatch-tf-light", className)}>
      <p className="tf-big" aria-hidden="true">
        TF
      </p>
      <p className="tf-ref">
        <span className="tf-ref-k">{typo(titre)}</span>
        <span className="tf-ref-v">{reference}</span>
      </p>
    </div>
  );
}
