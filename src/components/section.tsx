import type { ReactNode } from "react";
import { cx } from "@/lib/base";

export type Surface = "paper" | "paper-2" | "trait" | "laterite";

/** Fond de section et variable --bg (lue par les étiquettes de cote). */
const SURFACES: Record<Surface, string> = {
  paper: "bg-paper [--bg:var(--color-paper)]",
  "paper-2": "bg-paper-2 [--bg:var(--color-paper-2)]",
  trait: "bg-trait text-white [--bg:var(--color-trait)] [&_:focus-visible]:outline-white",
  laterite: "bg-laterite text-white [--bg:var(--color-laterite)] [&_:focus-visible]:outline-white",
};

/** Rythmes verticaux (2.4), mobile puis à partir de 761 px. */
const RYTHMES = {
  /** 56 / 64, puis 112 / 120 */
  section: "pt-14 pb-16 tab:pt-28 tab:pb-30",
  /** Contact : 56 / 64, puis 104 / 112 */
  contact: "pt-14 pb-16 tab:pt-26 tab:pb-28",
  /** Registre : 56 / 64, puis 96 / 104 */
  registre: "pt-14 pb-16 tab:pt-24 tab:pb-26",
  /** Ouverture dans le dessin (02 sur l'accueil) : 32 / 64, puis 72 / 120 */
  dessin: "pt-8 pb-16 tab:pt-18 tab:pb-30",
  /** Bande de contact des pages intérieures : 56 / 64 */
  bande: "pt-14 pb-16",
  aucun: "",
};

/**
 * Section (3.4) : <section aria-labelledby>, fond et rythme. Le contenu est
 * posé dans `wrap` (1 360 px plus les gouttières), sauf `wrap={false}`.
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
  labelledBy: string;
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
