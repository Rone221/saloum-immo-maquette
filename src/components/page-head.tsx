import type { ComponentProps } from "react";
import { SectionHead } from "./section-head";
import { TextLink } from "./text-link";

/**
 * En-tête de page intérieure (3.4) : la grille de SectionHead, titre H1 en text-7.
 * Le numéro est celui de la rubrique dans le menu (01 à 06). `retour` pose au-dessus
 * un lien de retour (« Terrains » sur les fiches).
 *
 * Usage : <Section labelledBy="t-page"><PageHead numero="01" titre="Terrains disponibles"
 *   titreId="t-page" intro="…"><StatusKey etats={[…]} /></PageHead>…</Section>
 */
export function PageHead({
  retour,
  ...props
}: Omit<ComponentProps<typeof SectionHead>, "niveau"> & { retour?: { href: string; libelle: string } }) {
  return (
    <>
      {retour ? (
        <TextLink href={retour.href} className="mb-3">
          {retour.libelle}
        </TextLink>
      ) : null}
      <SectionHead {...props} niveau={1} />
    </>
  );
}
