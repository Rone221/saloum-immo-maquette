import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Borne } from "./borne";

/**
 * L'en-tête de section (direction v4, pièce 4) : une borne numérotée, le nom de la
 * section en étiquette, une limite en trait mixte qui se tire de gauche à droite, une
 * petite borne de fin, puis à droite la quantité vraie (« 3 programmes », « 5 gestes »,
 * « 4 chantiers datés »). Sous 640 px, la quantité passe sous la ligne.
 *
 * Les bornes se suivent sur la page : 01, 02, 03. La quantité se compte dans le
 * contenu (`${PROGRAMMES.length} programmes`), elle ne s'écrit pas de tête.
 *
 * Sur le plan ou la latérite, rien à passer : les couleurs suivent la surface.
 *
 * La voie de lecture trouve les sections par l'attribut data-voie-section posé ici,
 * et y plante un carrefour : son nom au survol, on y va au clic (l'ancre est l'id).
 */
export function EnTeteSection({
  numero,
  nom,
  quantite,
  id,
  arrivee = false,
  className,
}: {
  /** « 01 », « 02 » : deux chiffres, dans l'ordre de la page. */
  numero: string;
  /** Le nom de la section, en deux ou trois mots : « Les terrains ». */
  nom: string;
  /** La quantité vraie, à droite. Absente : la limite va jusqu'au bord. */
  quantite?: string;
  /** L'ancre du carrefour. Par défaut « borne-02 ». */
  id?: string;
  /**
   * Dans le premier écran d'une page : la limite se tire une fois, à l'arrivée. Sinon,
   * elle se tire pendant que l'en-tête entre à l'écran.
   */
  arrivee?: boolean;
  className?: string;
}) {
  return (
    <div
      id={id ?? `borne-${numero}`}
      data-voie-section=""
      data-numero={numero}
      data-nom={typo(nom)}
      className={cx(
        "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2 text-doux min-[640px]:flex",
        className,
      )}
    >
      <Borne numero={numero} />
      <div className="flex min-w-0 items-center gap-x-3.5 min-[640px]:contents">
        <p className="etiquette">{typo(nom)}</p>
        {/* La limite finit sur une borne, comme elle a commencé. Les deux se tirent
            ensemble : la borne de fin arrive au bout du trait, jamais seule avant lui. */}
        <span
          aria-hidden="true"
          className={cx("flex min-w-8 flex-1 items-center gap-x-3.5", arrivee ? "se-tire-arrivee" : "se-tire")}
        >
          <span className="trait-mixte h-px min-w-0 flex-1 text-(--r-axe)" />
          <span className="size-[7px] flex-none border border-encre bg-blanc" />
        </span>
      </div>
      {quantite ? (
        <p className="etiquette col-start-2 justify-self-end min-[640px]:flex-none">{typo(quantite)}</p>
      ) : null}
    </div>
  );
}
