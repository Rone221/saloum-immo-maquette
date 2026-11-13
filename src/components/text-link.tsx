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
 * Lien texte : bleu, 600, souligné. 44 px de haut au moins, hors du fil d'un
 * paragraphe. Un lien texte par bloc au plus (allegement.md, 2.9).
 */
export function TextLink({
  href,
  children,
  className,
  tone = "trait",
  ...reste
}: LienProps & { tone?: "trait" | "inv" }) {
  return (
    <Lien
      href={href}
      className={cx(
        "inline-flex min-h-11 items-center font-semibold underline decoration-1 underline-offset-4 hover:decoration-2",
        tone === "trait" ? "text-trait" : "text-white",
        className,
      )}
      {...reste}
    >
      {typeof children === "string" ? typo(children) : children}
    </Lien>
  );
}

/** Lien dans le fil d'une phrase : bleu, souligné. */
export function InlineLink({ href, children, className, ...reste }: LienProps) {
  return (
    <Lien
      href={href}
      className={cx("font-semibold text-trait underline decoration-1 underline-offset-4 hover:decoration-2", className)}
      {...reste}
    >
      {typeof children === "string" ? typo(children) : children}
    </Lien>
  );
}
