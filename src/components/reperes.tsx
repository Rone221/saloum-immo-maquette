import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Petits repères graphiques de la direction « Relevé » (revue 2). Pas de
 * bibliothèque d'icônes : des formes de plan de géomètre.
 */

/** La borne : un carré orange, comme celles plantées aux angles d'un lot. */
export function Borne({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx("inline-block size-2 flex-none bg-borne", className)} />;
}

/** Flèche qui avance au survol de la carte ou du lien parent (classe `group`). */
export function Fleche({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx("inline-block transition-transform duration-300 ease-out group-hover:translate-x-1", className)}
    >
      →
    </span>
  );
}

/**
 * Statut foncier en badge, posé sur une photo : carré bleu plein pour un titre
 * foncier, carré vide quand le statut est à demander. Le texte reste celui de la
 * fiche, sans le point final.
 */
export function BadgeStatut({
  foncier,
  texte,
  className,
}: {
  foncier: "titre" | "a-demander";
  texte: string;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 bg-paper px-2.5 py-1.5 text-small leading-none font-semibold text-ink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx("size-2.5 flex-none", foncier === "titre" ? "bg-trait" : "border-[1.5px] border-ink-2")}
      />
      {typo(texte.replace(/\.$/, ""))}
    </span>
  );
}

/** Repères en puces : surfaces, nombre de parcelles, travaux faits. */
export function Puces({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cx("flex flex-wrap gap-2", className)}>
      {items.map((t) => (
        <li key={t} className="border border-rule px-2.5 py-1 text-small font-medium tabular-nums text-ink">
          {typo(t)}
        </li>
      ))}
    </ul>
  );
}
