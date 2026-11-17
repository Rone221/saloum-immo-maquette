import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

type LienProps = {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page";
  /** Un repère pour le script des gestes (data-aimant) ou pour une feuille de style. */
  [donnee: `data-${string}`]: string | undefined;
};

/** Lien interne par next/link (sous-chemin géré), sinon <a>. Même onglet partout. */
export function Lien({ href, children, ...reste }: LienProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...reste}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...reste}>
      {children}
    </a>
  );
}

/**
 * La flèche des boutons et des liens : elle avance de 4 px au survol, dans la courbe
 * du site. Le parent porte la classe `group`.
 */
export function Fleche({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={cx("size-[1.125rem] flex-none transition-transform duration-400 ease-pose group-hover:translate-x-1", className)}
    >
      <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/**
 * Lien texte, hors du fil d'un paragraphe : souligné, dans la couleur du texte, 600,
 * avec sa flèche. Au survol : la couleur d'accent de la surface (latérite sur clair,
 * latérite vive sur le plan). 44 px de haut au moins. Un lien texte par bloc au plus.
 */
export function TextLink({ href, children, className, fleche = true, ...reste }: LienProps & { fleche?: boolean }) {
  return (
    <Lien
      href={href}
      className={cx(
        "group inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-1 underline-offset-4 transition-surface hover:text-accent hover:decoration-2",
        className,
      )}
      {...reste}
    >
      {typeof children === "string" ? typo(children) : children}
      {fleche ? <Fleche /> : null}
    </Lien>
  );
}

/** Lien dans le fil d'une phrase : souligné, la couleur d'accent au survol. */
export function InlineLink({ href, children, className, ...reste }: LienProps) {
  return (
    <Lien
      href={href}
      className={cx("font-medium underline decoration-1 underline-offset-4 transition-surface hover:text-accent hover:decoration-2", className)}
      {...reste}
    >
      {typeof children === "string" ? typo(children) : children}
    </Lien>
  );
}
