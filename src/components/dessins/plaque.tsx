import { cx } from "@/lib/base";

/**
 * Plaque « Sortie 10 » (3.5) : le rappel d'un panneau routier, pas un bouton.
 * Fond trait, liseré intérieur blanc. Ne se clique pas.
 */
export function Plaque({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex min-h-7.5 flex-none items-center rounded-1 bg-trait px-2.75 font-sans text-2 leading-tight font-semibold whitespace-nowrap text-white stretch-sub",
        "outline-[1.5px] -outline-offset-4 outline-white outline-solid",
        className,
      )}
    >
      {children}
    </span>
  );
}
