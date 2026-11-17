import { cx } from "@/lib/base";

/**
 * La borne (direction v4, pièce 4) : un carré blanc de 28 px, un filet d'encre, le
 * numéro en latérite dans l'Archivo étroit gras. Comme leurs bornes de béton peintes
 * en rouge (photo 2528). Elle ouvre chaque section, dans l'ordre de la page : 01, 02,
 * 03. C'est la seule numérotation du site avec les lots publiés.
 * La face reste blanche sur toutes les surfaces : sur le plan comme sur le terrain.
 */
export function Borne({ numero, className }: { numero: string; className?: string }) {
  return (
    <span
      className={cx(
        "etroit inline-flex size-7 flex-none items-center justify-center rounded-1 border border-encre bg-blanc text-menu leading-none font-bold text-laterite tabular-nums",
        className,
      )}
    >
      {numero}
    </span>
  );
}

/**
 * La plaque de borne (pièce 12) : le numéro d'un lot publié, sur un rectangle blanc.
 * Toujours précédée du mot « Lot » ou posée sous une colonne « Lot » : le numéro seul
 * ne dit pas ce qu'il compte. Jamais un numéro qui n'est pas dans src/content.
 */
export function Plaque({ numero, className }: { numero: string; className?: string }) {
  return (
    <span
      className={cx(
        "etroit inline-flex h-7 min-w-9 flex-none items-center justify-center rounded-1 border border-encre bg-blanc px-2 text-body leading-none font-bold text-laterite tabular-nums",
        className,
      )}
    >
      {numero}
    </span>
  );
}
