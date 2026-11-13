import type { ReactNode } from "react";
import { cx } from "@/lib/base";

/**
 * Fonds (allegement.md, 2.6) : blanc, un seul gris clair, le bleu pour le pied de
 * contact. Le gris une section sur deux au plus ; deux sections colorées ne se
 * suivent jamais (la dernière section d'une page reste blanche : le pied bleu suit).
 */
export type Surface = "paper" | "paper-2";

const SURFACES: Record<Surface, string> = {
  paper: "bg-paper",
  "paper-2": "bg-paper-2",
};

/** Rythmes verticaux (2.7) : 72 px sur mobile, 96 sur tablette, 128 au bureau. */
const RYTHMES = {
  section: "py-18 tab:py-24 desk:py-32",
  /** Ouverture d'une page : moins d'air en haut, l'en-tête est juste au-dessus. */
  ouverture: "pt-10 pb-18 tab:pt-14 tab:pb-24 desk:pt-20 desk:pb-32",
  /** Dernière ligne d'une page, avant le pied. */
  fin: "pt-0 pb-18 tab:pb-24 desk:pb-32",
};

/**
 * Section : <section aria-labelledby>, fond et rythme. Le contenu est posé dans
 * `wrap` (1 360 px plus les gouttières), sauf `wrap={false}`.
 */
export function Section({
  id,
  labelledBy,
  surface = "paper",
  rythme = "section",
  wrap = true,
  className,
  children,
}: {
  id?: string;
  labelledBy?: string;
  surface?: Surface;
  rythme?: keyof typeof RYTHMES;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(SURFACES[surface], RYTHMES[rythme], className)}>
      {wrap ? <div className="wrap">{children}</div> : children}
    </section>
  );
}
