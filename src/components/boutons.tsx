import type { ReactNode } from "react";
import { LIBELLES } from "@/content/messages";
import { MOBILE } from "@/content/site";
import { cx } from "@/lib/base";
import { BOUTON_CONTOUR, BOUTON_FORME, BOUTON_PLEIN } from "@/lib/classes";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { Fleche, Lien } from "./text-link";

/**
 * Les boutons (direction v4, pièce 13). Angles vifs, 52 px de haut, une flèche qui
 * avance de 4 px au survol.
 *
 * plein : l'action principale, un par section au plus. Latérite et texte blanc sur
 *   clair ; latérite vive et texte encre sur le plan et sur une photo ; blanc sur la
 *   latérite. Les couleurs suivent la surface, rien à passer. Il vient vers la main
 *   (aimant léger, au pointeur fin seulement : components/gestes.tsx).
 * contour : l'action seconde (WhatsApp des programmes, « Appeler »). Encre sur clair,
 *   blanc sur le plan.
 *
 * Sur une photo, le bouton doit être dans un bloc `sur-plan` (l'ouverture d'accueil).
 *
 * Largeur sous 761 px : toute la colonne (350 px à 390). Deux boutons côte à côte
 * passent `bloc={false}` et partagent la ligne (classe `grow`).
 */
export type Variante = "plein" | "contour";

/** normal : 52 px. compact : 44 px, pour l'en-tête du site. */
export type Taille = "normal" | "compact";

const BASE = cx(BOUTON_FORME, "transition-bouton");

const TAILLES: Record<Taille, string> = {
  normal: "min-h-13 px-6 py-2.5",
  compact: "min-h-11 px-4 py-1.5 text-menu",
};

const VARIANTES: Record<Variante, string> = { plein: BOUTON_PLEIN, contour: BOUTON_CONTOUR };

export function Bouton({
  href,
  children,
  variante = "plein",
  taille = "normal",
  bloc = true,
  fleche = true,
  aimant,
  ariaLabel,
  className,
}: {
  href: string;
  children: ReactNode;
  variante?: Variante;
  taille?: Taille;
  /** Toute la largeur sous 761 px (par défaut). */
  bloc?: boolean;
  /** La flèche qui avance (par défaut). */
  fleche?: boolean;
  /** L'aimant : par défaut sur le bouton plein de taille normale, et sur lui seul. */
  aimant?: boolean;
  /** Nom accessible : commence toujours par le libellé visible. */
  ariaLabel?: string;
  className?: string;
}) {
  const attire = aimant ?? (variante === "plein" && taille === "normal");
  return (
    <Lien
      href={href}
      aria-label={ariaLabel}
      data-aimant={attire ? "" : undefined}
      className={cx(BASE, TAILLES[taille], VARIANTES[variante], bloc && "w-full tab:w-auto", className)}
    >
      {typeof children === "string" ? typo(children) : children}
      {fleche ? <Fleche /> : null}
    </Lien>
  );
}

/**
 * Bouton WhatsApp. Le message part dans le lien wa.me ; son texte ne s'affiche
 * que sur la page Contact. Le mot « WhatsApp » est toujours écrit dans le libellé,
 * sans logo.
 */
export function BoutonWhatsApp({
  label,
  message,
  ...reste
}: {
  label: string;
  message?: string;
  variante?: Variante;
  taille?: Taille;
  bloc?: boolean;
  fleche?: boolean;
  aimant?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Bouton href={waHref(message ? typo(message) : undefined)} {...reste}>
      {label}
    </Bouton>
  );
}

/** « Appeler » : lien tel: vers le mobile. Sans flèche : il ne mène pas à une page. */
export function BoutonAppel({
  variante = "contour",
  taille,
  bloc,
  className,
}: {
  variante?: Variante;
  taille?: Taille;
  bloc?: boolean;
  className?: string;
}) {
  return (
    <Bouton
      href={MOBILE.href}
      variante={variante}
      taille={taille}
      bloc={bloc}
      fleche={false}
      ariaLabel={`${LIBELLES.appel}, ${MOBILE.long}`}
      className={className}
    >
      {LIBELLES.appel}
    </Bouton>
  );
}
