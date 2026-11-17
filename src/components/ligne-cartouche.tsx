import type { ReactNode } from "react";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Une ligne de cartouche, la même sur toutes les pages, dans ses habits v4 : la clé à
 * gauche, en étiquette (12 px, capitales, voix large) ; la valeur à droite, au corps
 * du texte. Une mesure ou une référence se compose dans la voix large par l'appelant
 * (TF 15026/R, 78, 33 805 87 18). À poser dans un <dl>, sous un trait fort
 * (border-t border-fort). Pour un cartouche encadré, en cases : components/cartouche.tsx.
 *
 * Mêmes verticales partout : une clé de 8,5 rem, 11 dès 761 px. Une clé tient en deux
 * mots : au-delà, elle passe à la ligne. `date` : la clé est une date de
 * registre, dans la voix des mesures, en casse normale.
 * Les filets et la clé suivent la surface (clair, plan, latérite).
 */
export function LigneCartouche({
  cle,
  date = false,
  serree = false,
  empilee = false,
  className,
  children,
}: {
  cle: string;
  date?: boolean;
  /** La valeur est un lien de 44 px de haut : moins de marge, pour garder le pas des lignes. */
  serree?: boolean;
  /**
   * Sous 761 px, la clé passe au-dessus de la valeur : pour une mesure en grand qui ne se
   * coupe pas (« 6 à 10 millions FCFA »), trop large pour la colonne de droite à 390 px.
   */
  empilee?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "grid border-b border-ligne",
        empilee
          ? "gap-y-1 tab:grid-cols-[11rem_minmax(0,1fr)] tab:items-baseline tab:gap-x-6"
          : "grid-cols-[8.5rem_minmax(0,1fr)] items-baseline gap-x-4 tab:grid-cols-[11rem_minmax(0,1fr)] tab:gap-x-6",
        serree ? "py-1" : "py-3.5",
        className,
      )}
    >
      {/* Un mot trop long pour sa colonne (une clé d'un seul mot, un numéro insécable sur
          un écran de 320 px) se coupe plutôt que de pousser la page. */}
      <dt className={date ? "mesure" : "etiquette text-doux [overflow-wrap:anywhere]"}>{typo(cle)}</dt>
      <dd className="m-0 [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}
