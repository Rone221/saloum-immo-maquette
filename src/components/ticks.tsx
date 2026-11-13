import type { ReactNode } from "react";
import type { Fait } from "@/content/types";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { TexteFait } from "./texte";

/**
 * Titre de colonne (3.15) : text-5 en 85 %, filet encre de 1,5 px dessous.
 * Repris par les listes posées en colonne à côté des Ticks (vidéos, programmes).
 */
export const TITRE_COLONNE = "border-b-[1.5px] border-ink pb-3 text-5 leading-snug font-650 stretch-sub";

/**
 * Liste à puces carrées (3.15) : un carré de 10 px au contour trait, dessiné en
 * CSS (pas une coche). Titre de colonne en text-5 avec un filet encre dessous.
 */
export function Ticks({
  titre,
  titreId,
  lignes,
  niveau = 3,
  children,
  className,
}: {
  titre: string;
  /** id du titre, pour nommer la section qui l'entoure (<Section labelledBy>). */
  titreId?: string;
  lignes: Fait[];
  niveau?: 2 | 3;
  /** Sous la liste : un lien vidéo par exemple. */
  children?: ReactNode;
  className?: string;
}) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <div className={className}>
      <Titre id={titreId} className={TITRE_COLONNE}>
        {typo(titre)}
      </Titre>
      <ul>
        {lignes.map((l) => (
          <li
            key={l.texte}
            className={cx(
              "relative border-b border-rule py-2.5 pl-7 text-3 leading-body tab:py-3.25",
              "before:absolute before:top-4.25 before:left-0.5 before:size-2.5 before:border-[1.5px] before:border-trait tab:before:top-5.25",
            )}
          >
            <TexteFait fait={l} />
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
