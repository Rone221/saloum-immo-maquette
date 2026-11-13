import type { ReactNode } from "react";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Ouverture classique (3.4) : filet haut 2 px, numéro en mono (col. 1), titre
 * (col. 2 à 7), intro alignée en bas (col. 8 à 12). Sur mobile, numéro et titre
 * sur une ligne, intro dessous. Ne revient pas deux fois de suite sur une page.
 */
export function SectionHead({
  numero,
  titre,
  titreId,
  sousTitre,
  intro,
  children,
  niveau = 2,
  className,
}: {
  /** « 01 » à « 06 ». Absent : pas de numéro (mentions légales, 404). */
  numero?: string;
  titre: string;
  titreId: string;
  /**
   * Juste sous le titre, dans sa colonne, en text-4 ink-2 : le second nom d'une
   * fiche (« Les lots présentés en vidéo sous le nom Paradise City. », 7.3).
   */
  sousTitre?: ReactNode;
  /** Une phrase ou plusieurs paragraphes, en text-3 ink-2. */
  intro?: ReactNode;
  /** Sous l'intro, dans la même colonne : la clé des hachures par exemple. */
  children?: ReactNode;
  /** 1 : titre de page (PageHead), en text-7. */
  niveau?: 1 | 2;
  className?: string;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";
  const colonneTitre = cx(
    numero ? "col-start-2" : "col-span-full tab:col-[2/span_11]",
    "tab:col-[2/span_11] desk:col-[2/span_6]",
  );
  const titreEl = (
    <Titre
      id={titreId}
      className={cx(
        !sousTitre && colonneTitre,
        "font-bold stretch-title",
        niveau === 1 ? "text-7 leading-title tracking-title" : "text-6 leading-title tracking-tight",
      )}
    >
      {typo(titre)}
    </Titre>
  );
  return (
    <header
      className={cx(
        "mb-9 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 gap-y-4 border-t-2 border-ink pt-4 tab:mb-18 tab:grid-cols-12 tab:gap-x-6 tab:pt-5",
        className,
      )}
    >
      {numero ? (
        <span className="col-start-1 pt-2.5 font-mono text-1 leading-tight font-medium tab:pt-3.5">{numero}</span>
      ) : null}
      {sousTitre ? (
        <div className={colonneTitre}>
          {titreEl}
          <p className="mt-3 text-4 leading-caption text-ink-2 tab:mt-4">
            {typeof sousTitre === "string" ? typo(sousTitre) : sousTitre}
          </p>
        </div>
      ) : (
        titreEl
      )}
      {intro || children ? (
        <div className="col-span-full self-end tab:col-[2/span_11] desk:col-[8/span_5]">
          {typeof intro === "string" ? <p className="text-3 leading-body text-ink-2">{typo(intro)}</p> : intro}
          {children}
        </div>
      ) : null}
    </header>
  );
}
