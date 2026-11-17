import type { ReactNode } from "react";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Où le cartouche est posé.
 * clair : sur le sable ou le calque. Cases en calque, filets clairs.
 * plan : sur une surface plan. Le plan à 60 %, filets clairs à 28 %.
 * photo : sur une photo. Le plan à 60 % avec un flou, filets clairs. Le texte y est
 *   clair quelle que soit la section autour.
 */
export type SurCartouche = "clair" | "plan" | "photo";

const HABITS: Record<SurCartouche, string> = {
  clair: "bg-calque sur-calque",
  plan: "bg-plan/60 sur-plan",
  photo: "voile-plan sur-plan",
};

/**
 * Le cartouche (direction v4, pièce 7) : la grille à filets d'un plan. Une clé en
 * étiquette, une valeur en texte ou en `mesure`. Un <dl> : y poser des CaseCartouche
 * (la clé au-dessus de la valeur, ou à sa gauche avec `enLigne`).
 *
 * Les colonnes se règlent par `className` : « tab:grid-cols-2 desk:grid-cols-4 ». Une
 * case s'étend avec « desk:col-span-2 ». Les filets ne se doublent jamais : chaque case
 * trace son bord droit et son bord bas, le cadre coupe ceux du tour.
 *
 * Aucune fausse donnée, même en décor : ni coordonnées, ni échelle, ni cachet.
 */
export function Cartouche({
  sur = "clair",
  className,
  children,
  "aria-label": ariaLabel,
}: {
  sur?: SurCartouche;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    // overflow-clip, pas hidden : une boîte en overflow hidden devient le repère du
    // défilement pour ce qui s'anime au défilement dedans (se-tire, apparait, le mot
    // coté), et le trait reste à mi-course.
    <dl aria-label={ariaLabel} className={cx("m-0 grid overflow-clip border border-ligne", HABITS[sur], className)}>
      {children}
    </dl>
  );
}

/**
 * Une case de cartouche : la clé en étiquette, la valeur dessous. `enLigne` : la clé
 * à gauche (6,5 rem), la valeur à droite, pour un cartouche étroit en une colonne.
 * `empilee`, avec `enLigne` : sous 761 px, la clé repasse au-dessus de la valeur, pour
 * une mesure en grand qui ne tient pas à côté de sa clé à 390 px (un numéro de téléphone).
 * Une mesure ou une référence se compose dans la voix large par l'appelant :
 * <span className="mesure">TF 15026/R</span>.
 */
export function CaseCartouche({
  cle,
  enLigne = false,
  empilee = false,
  className,
  children,
}: {
  cle: string;
  enLigne?: boolean;
  empilee?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cote = enLigne && !empilee;
  return (
    <div
      className={cx(
        "-mr-px -mb-px border-r border-b border-ligne px-4 py-3.5 desk:px-5 desk:py-4",
        cote && "grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-4",
        enLigne && empilee && "tab:grid tab:grid-cols-[6.5rem_minmax(0,1fr)] tab:items-baseline tab:gap-x-4",
        className,
      )}
    >
      <dt className="etiquette text-doux">{typo(cle)}</dt>
      <dd className={cx("m-0", !enLigne && "mt-1.5", enLigne && empilee && "max-tab:mt-1.5")}>{children}</dd>
    </div>
  );
}
