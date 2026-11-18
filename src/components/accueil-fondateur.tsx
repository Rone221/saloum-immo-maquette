import { type PhotoId } from "@/content/photos";
import { AGENCE, FONDATEUR } from "@/content/site";
import { VIDEOS } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { LienVideo } from "./carte-video";
import { EnTeteSection } from "./en-tete-section";
import { LigneCartouche } from "./ligne-cartouche";
import { LegendePhoto, Photo, sizesRecadree } from "./photo";
import { PhraseMesuree } from "./phrase-mesuree";
import { Section, type Surface } from "./section";
import { TextLink } from "./text-link";

/** Le buste, recadré dans l'interview : 540 × 405, jamais agrandi. */
const BUSTE: PhotoId = "ig-DZUeyGKPdj_-buste";

/** La façade de l'agence, coupée au-dessus de la vitrine : 1 080 px de large. */
const ENSEIGNE: PhotoId = "2352-haut";

/**
 * Le gros plan sur l'enseigne : la photo est dessinée 1,45 fois plus grande que son
 * cadre, autour du panneau. 470 px dessinés pour un cadre de 324 : sous la largeur du
 * fichier, écran haute densité compris.
 */
const PLAN_ENSEIGNE = { transform: "scale(1.45)", transformOrigin: "53% 20%" };

/**
 * Deux colonnes au bureau, les mêmes pour le buste et pour l'agence : les images à
 * gauche, dans 324 px (la largeur du buste, qui ne s'agrandit pas), les textes à droite.
 * La colonne des images ne tombe pas sur les douze colonnes de la page : c'est la
 * taille du buste qui commande. L'écart suit la largeur de l'écran, de 64 à 136 px.
 */
const DEUX_COLONNES = "desk:grid-cols-[20.25rem_minmax(0,1fr)] desk:gap-x-[clamp(4rem,8vw,8.5rem)]";
const IMAGE = "m-0 max-w-[20.25rem] desk:col-start-1";
const TEXTE = "desk:col-start-2";

/**
 * Le buste sous 761 px : un cadre carré qui prend la largeur de la colonne, 405 px au
 * plus (l'image y est dessinée à 540 px au plus, sa largeur). Puis le 4:5 de 324 px.
 */
const IMAGE_BUSTE = "m-0 max-w-[25.3125rem] tab:max-w-[20.25rem] desk:col-start-1";
const SIZES_BUSTE = `${sizesRecadree(BUSTE, 4 / 5, "(min-width: 761px) 324px")}, ${sizesRecadree(BUSTE, 1, "90vw")}`;

/**
 * Accueil, Babacar Ndiaye et l'agence. À gauche, les images ; à droite, les textes.
 * 1. Son nom et sa fonction, le buste tiré de son interview, puis son parcours en
 *    registre, les dates en marge dans la voix des mesures. La dernière ligne mène à
 *    l'interview. Le buste tient dans un cadre 4:5 de 324 px de large au plus : l'image
 *    y est dessinée à 540 px, sa largeur. Sur mobile, le nom vient avant le buste, dans
 *    un cadre carré à la largeur de la colonne.
 * 2. L'agence : son enseigne en gros plan, et son adresse en ligne de cartouche. Le
 *    lien mène à la page À propos.
 */
export function AccueilFondateur({
  numero,
  surface = "sable",
  croisillons = false,
  className,
}: {
  /** La borne de la section, à la suite de celles de la page : « 07 ». */
  numero: string;
  surface?: Extract<Surface, "sable" | "calque">;
  /** Sans, par défaut : les croix du plan tombaient sur les filets du registre. */
  croisillons?: boolean;
  className?: string;
}) {
  const interview = VIDEOS.interviewDG;
  return (
    <Section id="fondateur" labelledBy="t-fondateur" surface={surface} croisillons={croisillons} className={className}>
      <EnTeteSection numero={numero} nom="Le fondateur" quantite={`Parcours en ${FONDATEUR.parcours.length} étapes`} />

      {/* Trois cases : le nom, le buste, le registre, dans cet ordre de lecture. Au
          bureau, le buste prend la colonne de gauche sur les deux rangées ; la seconde
          rangée prend la hauteur qui reste. */}
      <div className={cx("grid gap-y-8 desk:grid-rows-[auto_1fr] desk:gap-y-10", DEUX_COLONNES, SOUS_BORNE)}>
        <div className={cx(TEXTE, "desk:row-start-1")}>
          <h2 id="t-fondateur" className={T2}>
            {typo(FONDATEUR.nom.texte)}
          </h2>
          <p className={cx(CHAPEAU, "mt-3")}>{typo(FONDATEUR.role.texte)}</p>
        </div>

        <figure className={cx("apparait self-start desk:row-span-2 desk:row-start-1", IMAGE_BUSTE)}>
          <span className="relative block aspect-square overflow-hidden bg-attente tab:aspect-[4/5]">
            <Photo id={BUSTE} fill sizes={SIZES_BUSTE} className="object-cover" />
            {/* Le buste se clique aussi, à la souris : le lien de l'interview est dans le
                registre. Celui-ci le double, sans rien ajouter au clavier ni à un
                lecteur d'écran. */}
            <a href={interview.href} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />
          </span>
          <LegendePhoto id={BUSTE} className="text-balance" />
        </figure>

        <dl className={cx("apparait m-0 self-start border-t border-fort [--rang:1] desk:row-start-2", TEXTE)}>
          {FONDATEUR.parcours.map((p) => (
            <LigneCartouche key={p.quand} date cle={p.quand}>
              <span className="tab:text-chapeau">
                <PhraseMesuree texte={p.texte.texte} />
              </span>
            </LigneCartouche>
          ))}
          {/* Une vidéo s'écrit comme partout : le titre, puis la plateforme et la durée,
              dans un seul lien (le contour du focus entoure les deux). Sur mobile, la
              clé passe au-dessus du titre. */}
          <LigneCartouche cle="En vidéo" empilee>
            <LienVideo cle="interviewDG" />
          </LigneCartouche>
        </dl>
      </div>

      <div className={cx("mt-12 grid gap-y-6 desk:mt-16", DEUX_COLONNES)}>
        <figure className={cx("apparait", IMAGE)}>
          <span className="relative block aspect-[2/1] overflow-hidden bg-attente">
            <Photo id={ENSEIGNE} fill position="53% top" sizes="470px" className="object-cover" style={PLAN_ENSEIGNE} />
          </span>
          <LegendePhoto id={ENSEIGNE} className="text-balance" />
        </figure>
        <div className={TEXTE}>
          <dl className="m-0 border-t border-fort">
            <LigneCartouche cle="Agence">{typo(AGENCE.texte)}</LigneCartouche>
          </dl>
          <TextLink href="/a-propos/" className="mt-4">
            L’entreprise et l’équipe
          </TextLink>
        </div>
      </div>
    </Section>
  );
}
