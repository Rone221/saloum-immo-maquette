import Link from "next/link";
import type { ReactNode } from "react";
import { EMAIL, type Telephone } from "@/content/site";
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
 * Lien d'action (`lnk`) : vidéo, fiche, page. Trait, 600, souligné décalé de 5 px,
 * 44 px de haut au moins. Survol : soulignement de 2 px.
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
        "inline-flex min-h-11 items-center font-semibold underline decoration-1 underline-offset-5 hover:decoration-2",
        tone === "trait" ? "text-trait" : "text-white",
        className,
      )}
      {...reste}
    >
      {typeof children === "string" ? typo(children) : children}
    </Lien>
  );
}

/** Lien dans le fil d'un paragraphe (`inl`) : trait, souligné, décalage 4 px. */
export function InlineLink({ href, children, className, ...reste }: LienProps) {
  return (
    <Lien href={href} className={cx("text-trait underline underline-offset-4 hover:decoration-2", className)} {...reste}>
      {typeof children === "string" ? typo(children) : children}
    </Lien>
  );
}

/**
 * Numéro de téléphone en clair, toujours lien tel:. Espaces insécables.
 * `format` : « 77 400 75 75 » (court) ou « +221 77 400 75 75 » (long).
 */
export function Tel({
  numero,
  format = "court",
  className,
  children,
}: {
  numero: Telephone;
  format?: "court" | "long";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a href={numero.href} className={className}>
      {children ?? typo(format === "court" ? numero.court : numero.long)}
    </a>
  );
}

/** Adresse e-mail en clair, lien mailto:. */
export function Mail({ className }: { className?: string }) {
  return (
    <a href={EMAIL.href} className={className}>
      {EMAIL.adresse}
    </a>
  );
}
