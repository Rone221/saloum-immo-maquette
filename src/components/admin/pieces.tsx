import type { ReactNode } from "react";
import { Borne } from "@/components/borne";
import { Lien } from "@/components/text-link";
import { ESPACE } from "@/content/demo/textes";
import { cx } from "@/lib/base";
import { NOM } from "@/lib/classes";
import { typo } from "@/lib/format";

// Les pièces communes aux écrans de l'espace client de démonstration (direction v4,
// section 7). La même langue que le site, en plus sobre : rien ne bouge ici. Ni
// apparition, ni trait qui se tire : on vient travailler. Leur mise en forme est dans
// admin.css.

/**
 * Le carré d'état, le même que dans l'index des terrains : plein, dans la couleur
 * d'accent, ce qui appelle un geste (une demande nouvelle, un champ modifié) ; en
 * contour, ce qui est au repos, ou ce qui n'est pas réel (une donnée de démonstration).
 * Un signe pour l'œil : le mot à côté dit tout, lui seul est lu.
 */
export function Carre({ plein = false, className }: { plein?: boolean; className?: string }) {
  return <span aria-hidden="true" data-plein={plein ? "" : undefined} className={cx("admin-carre", className)} />;
}

/**
 * Le bandeau « Données de démonstration » : sur chaque écran, collé en haut, toujours
 * visible. Discret : une ligne, sur un trait en pointillé (ce qui n'est pas sûr, sur
 * un plan). Le détail et la fin de phrase ne s'affichent que là où la place existe.
 * C'est lui qui prévient ; une ligne le redit une fois par écran, pas sous chaque bloc
 * (NoteDemo).
 */
export function Bandeau({ className }: { className?: string }) {
  return (
    <p className={cx("admin-bandeau", className)}>
      <Carre />
      <strong className="etiquette text-fort">{typo(ESPACE.bandeau.titre)}</strong>
      <span className="admin-bandeau-detail text-small text-doux">{typo(ESPACE.bandeau.detail)}</span>
      <span className="admin-bandeau-fin etiquette text-doux">{typo(ESPACE.bandeau.fin)}</span>
    </p>
  );
}

/**
 * L'en-tête d'un écran : son titre en Besley, à la taille d'un nom de programme (28 à
 * 40 px : un outil, pas une affiche), son chapeau, et à droite ce qui règle l'écran
 * (une période, un filtre). `ariane` : la rubrique parente, en étiquette.
 */
export function TeteEcran({
  titre,
  chapeau,
  ariane,
  children,
}: {
  titre: string;
  chapeau?: ReactNode;
  ariane?: { href: string; libelle: string };
  /** À droite du titre au bureau, dessous sur téléphone. */
  children?: ReactNode;
}) {
  return (
    <header className="admin-tete">
      <div className="min-w-0">
        {ariane ? (
          <nav aria-label="Fil d’Ariane" className="etiquette mb-1 text-doux">
            <Lien
              href={ariane.href}
              className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-surface hover:text-accent"
            >
              {typo(ariane.libelle)}
            </Lien>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span aria-current="page">{typo(titre)}</span>
          </nav>
        ) : null}
        <h1 id="t-ecran" className={NOM}>
          {typo(titre)}
        </h1>
        {chapeau ? <p className="mt-3 max-w-[44rem]">{typeof chapeau === "string" ? typo(chapeau) : chapeau}</p> : null}
      </div>
      {children ? <div className="admin-tete-reglage">{children}</div> : null}
    </header>
  );
}

/**
 * L'en-tête d'un bloc : la borne numérotée, le nom du bloc en étiquette, la limite en
 * trait mixte, la quantité vraie à droite. C'est l'en-tête de section du site
 * (components/en-tete-section.tsx), immobile : la limite est déjà tirée. Ici le nom
 * est le titre du bloc (h2) : un écran de travail n'a pas de titre en Besley par bloc.
 *
 * La quantité passe sous la ligne quand le bloc est étroit, pas quand l'écran l'est :
 * deux blocs de front au bureau sont plus étroits qu'un téléphone couché (admin.css,
 * « L'en-tête d'un bloc »).
 */
export function TeteBloc({
  numero,
  nom,
  quantite,
  id,
  className,
}: {
  /** « 01 », « 02 » : dans l'ordre de l'écran. */
  numero: string;
  nom: string;
  /** La quantité, comptée dans ce que le bloc affiche. */
  quantite?: string;
  /** L'id du titre, pour nommer la section (aria-labelledby). */
  id: string;
  className?: string;
}) {
  return (
    <div className={cx("tete-bloc", className)}>
      <div className="tete-bloc-rang">
        <Borne numero={numero} />
        <div className="tete-bloc-ligne">
          <h2 id={id} className="etiquette">
            {typo(nom)}
          </h2>
          <span aria-hidden="true" className="trait-mixte h-px min-w-4 flex-1 text-(--r-axe)" />
          <span aria-hidden="true" className="size-[7px] flex-none border border-encre bg-blanc" />
        </div>
        {quantite ? <p className="tete-bloc-quantite etiquette">{typo(quantite)}</p> : null}
      </div>
    </div>
  );
}

/**
 * La ligne qui redit ce qui est inventé, en clair, là où on le lit : une sous le profil
 * des visites, une sous le registre des demandes. Pas davantage : le bandeau le dit
 * déjà sur chaque écran. Le carré en contour est le sien.
 */
export function NoteDemo({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cx("admin-note text-small text-doux", className)}>
      <Carre />
      <span>{typo(children)}</span>
    </p>
  );
}
