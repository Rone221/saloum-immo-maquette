import type { ReactNode } from "react";
import { cx } from "@/lib/base";
import { CHAPEAU, T1 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { Lien } from "./text-link";

/**
 * En-tête d'une page intérieure : fil d'Ariane (fiches), h1 de dix mots au plus,
 * chapeau de trente mots au plus. Ni numéro, ni filet au-dessus du titre.
 */
export function EnTete({
  titre,
  titreId = "t-page",
  chapeau,
  ariane,
  children,
  className,
}: {
  titre: string;
  titreId?: string;
  chapeau?: ReactNode;
  /** Lien vers la rubrique parente : « Terrains ». */
  ariane?: { href: string; libelle: string };
  /** Sous le chapeau : statut, bouton, lien. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("max-w-[54rem]", className)}>
      {ariane ? (
        <nav aria-label="Fil d’Ariane" className="-mt-3 mb-3 text-small text-ink-2">
          <Lien href={ariane.href} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:text-trait">
            {ariane.libelle}
          </Lien>
          <span aria-hidden="true" className="px-2">
            /
          </span>
          <span aria-current="page">{titre.replace(/\.$/, "")}</span>
        </nav>
      ) : null}
      <h1 id={titreId} className={T1}>
        {typo(titre)}
      </h1>
      {chapeau ? (
        <p className={cx(CHAPEAU, "mt-5 max-w-[36em] desk:mt-7")}>{typeof chapeau === "string" ? typo(chapeau) : chapeau}</p>
      ) : null}
      {children}
    </header>
  );
}
