import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Une cote de plan, dans ses habits v4 : la distance publiée entre un programme et un
 * repère de la route, écrite sur un trait avec ses deux butées, dans la couleur
 * d'accent de la surface (latérite sur clair, latérite vive sur le plan).
 * Trait plein pour une distance mesurée (3 km, 10 min). Pointillé pour une distance
 * qui n'est pas chiffrée (« quelques minutes ») : la convention du plan pour ce qui
 * n'est pas sûr. Jamais une valeur qui n'est pas dans src/content.
 *
 * Le trait est fait de deux segments, de part et d'autre de la mesure : rien à masquer
 * derrière le texte, la cote se pose sur n'importe quel fond.
 */
export function Cote({
  de,
  vers,
  mesure,
  chiffree = true,
  className,
}: {
  /** Le point de départ, à gauche : le lieu du programme. Absent : le programme, sous-entendu. */
  de?: string;
  /** Le repère, à droite : « sortie du péage », « Lac Rose ». */
  vers: string;
  /** La distance publiée, telle quelle : « 3 km », « 10 min ». */
  mesure: string;
  chiffree?: boolean;
  className?: string;
}) {
  const segment = cx("h-[1.5px] min-w-4 flex-1", chiffree ? "bg-current" : "pointille");
  return (
    <p className={cx("flex items-center gap-3 text-small", className)}>
      {de ? <span className="font-semibold whitespace-nowrap text-fort">{typo(de)}</span> : null}
      <span className="flex min-w-24 flex-1 items-center text-accent">
        <span aria-hidden="true" className="h-3 w-[1.5px] flex-none bg-current" />
        <span aria-hidden="true" className={segment} />
        <span className="mesure px-2 text-body leading-none whitespace-nowrap">{typo(mesure)}</span>
        <span aria-hidden="true" className={segment} />
        <span aria-hidden="true" className="h-3 w-[1.5px] flex-none bg-current" />
      </span>
      <span className="sr-only">{typo("jusqu’à")}</span>
      <span className="whitespace-nowrap text-doux">{typo(vers)}</span>
    </p>
  );
}
