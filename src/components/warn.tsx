import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Phrase d'honnêteté (3.15) : bord gauche 3 px trait, text-4 en 85 %, 52 em au
 * plus. Une par page au plus.
 */
export function Warn({
  children,
  marge = "mt-7",
  className,
}: {
  children: string;
  /** Marge au-dessus (remplace celle par défaut). */
  marge?: string;
  className?: string;
}) {
  return (
    <p
      className={cx(
        marge,
        "max-w-[52em] border-l-[3px] border-trait py-3.5 pl-4 text-4 leading-label font-semibold stretch-sub tab:py-4.5 tab:pl-5.5",
        className,
      )}
    >
      {typo(children)}
    </p>
  );
}
