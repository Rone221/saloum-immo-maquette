import type { ReactNode } from "react";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T1 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { EnTeteSection } from "./en-tete-section";
import { TitreCote } from "./mot-cote";
import { Lien } from "./text-link";

/**
 * L'ouverture d'une page intérieure (direction v4, pièce 5) : l'en-tête de section
 * (borne 01), le h1 en Besley avec son mot coté, le chapeau. À poser dans
 * <Section rythme="ouverture" croisillons> : le sable à croisillons est la surface de
 * toutes les ouvertures de page. La photo ou la pièce propre à la page vient après,
 * en enfants ou à la suite.
 *
 *   <Section labelledBy="t-page" rythme="ouverture" croisillons>
 *     <EnTete nom="Terrains" quantite={`${PROGRAMMES.length} programmes`}
 *             titre={TITRE} mot="terrains" chapeau={CHAPEAU_PAGE} />
 *   </Section>
 *
 * Sans `nom`, pas d'en-tête de section (page de service : mentions légales, 404).
 * Titre de dix mots au plus, chapeau de trente mots au plus.
 */
export function EnTete({
  titre,
  titreId = "t-page",
  mot,
  basse,
  chapeau,
  numero = "01",
  nom,
  quantite,
  ariane,
  children,
  className,
}: {
  titre: string;
  titreId?: string;
  /** Le mot coté du titre : un mot de `titre`, tel qu'il y est écrit. */
  mot?: string;
  /** La cote sous les jambages (voir MotCote). */
  basse?: boolean;
  chapeau?: ReactNode;
  /** La borne de l'ouverture : « 01 », sauf exception. */
  numero?: string;
  /** Le nom de la rubrique, en étiquette : « Terrains ». */
  nom?: string;
  /** La quantité vraie, à droite de la limite : « 3 programmes ». */
  quantite?: string;
  /** Lien vers la rubrique parente : « Terrains ». */
  ariane?: { href: string; libelle: string };
  /** Sous le chapeau : statut, bouton, lien. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={className}>
      {nom ? <EnTeteSection numero={numero} nom={nom} quantite={quantite} arrivee /> : null}
      <div className={cx("max-w-[54rem]", nom && SOUS_BORNE)}>
        {ariane ? (
          <nav aria-label="Fil d’Ariane" className="mb-2 text-small text-doux">
            <Lien
              href={ariane.href}
              className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-surface hover:text-accent"
            >
              {ariane.libelle}
            </Lien>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span aria-current="page">{titre.replace(/\.$/, "")}</span>
          </nav>
        ) : null}
        <h1 id={titreId} className={T1}>
          {mot ? <TitreCote texte={titre} mot={mot} basse={basse} arrivee /> : typo(titre)}
        </h1>
        {chapeau ? (
          <p className={cx(CHAPEAU, "mt-5 max-w-[36rem] desk:mt-7")}>{typeof chapeau === "string" ? typo(chapeau) : chapeau}</p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
