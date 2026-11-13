import type { ReactNode } from "react";
import { LIBELLES } from "@/content/messages";
import { MOBILE } from "@/content/site";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { Lien } from "./text-link";

/**
 * plein : l'action principale, un par section au plus, trois par page.
 * contour : action secondaire (WhatsApp des programmes, messages prêts).
 * inverse et ligne : sur le bleu du pied de contact.
 *
 * Largeur sous 761 px : toute la colonne (350 px à 390). Deux boutons côte à côte
 * (pied, Contact) passent `bloc={false}` et partagent la ligne (classe `grow`).
 */
export type Variante = "plein" | "contour" | "inverse" | "ligne";

const BASE =
  "inline-flex min-h-13 items-center justify-center rounded-1 border-[1.5px] px-6 py-2.5 text-center font-semibold leading-snug transition-surface";

const VARIANTES: Record<Variante, string> = {
  plein: "border-trait bg-trait text-white hover:border-ink hover:bg-ink",
  contour: "border-trait text-trait hover:bg-trait hover:text-white",
  inverse: "border-white bg-white text-trait hover:border-ink hover:bg-ink hover:text-white",
  ligne: "border-white text-white hover:bg-white hover:text-trait",
};

export function Bouton({
  href,
  children,
  variante = "plein",
  bloc = true,
  ariaLabel,
  className,
}: {
  href: string;
  children: ReactNode;
  variante?: Variante;
  /** Toute la largeur sous 761 px (par défaut). */
  bloc?: boolean;
  /** Nom accessible : commence toujours par le libellé visible. */
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Lien
      href={href}
      aria-label={ariaLabel}
      className={cx(BASE, VARIANTES[variante], bloc && "w-full tab:w-auto", className)}
    >
      {typeof children === "string" ? typo(children) : children}
    </Lien>
  );
}

/**
 * Bouton WhatsApp. Le message part dans le lien wa.me ; son texte ne s'affiche
 * que sur la page Contact (allegement.md, 2.9). Le mot « WhatsApp » est toujours
 * écrit dans le libellé, sans logo.
 */
export function BoutonWhatsApp({
  label,
  message,
  ...reste
}: {
  label: string;
  message?: string;
  variante?: Variante;
  bloc?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Bouton href={waHref(message ? typo(message) : undefined)} {...reste}>
      {label}
    </Bouton>
  );
}

/** « Appeler » : lien tel: vers le mobile. */
export function BoutonAppel({
  variante = "contour",
  bloc,
  className,
}: {
  variante?: Variante;
  bloc?: boolean;
  className?: string;
}) {
  return (
    <Bouton
      href={MOBILE.href}
      variante={variante}
      bloc={bloc}
      ariaLabel={`${LIBELLES.appel}, ${MOBILE.long}`}
      className={className}
    >
      {LIBELLES.appel}
    </Bouton>
  );
}
