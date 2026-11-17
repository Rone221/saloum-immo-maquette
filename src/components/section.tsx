import type { ReactNode } from "react";
import { cx } from "@/lib/base";

/**
 * Les quatre surfaces (direction v4, « Matières »).
 * sable : le fond de page, par défaut.
 * calque : une bande posée sur le plan, entre deux filets. En alternance avec le sable.
 * plan : la planche au bleu. Ouverture d'accueil, méthode, pied. Entre deux bleus,
 *   toujours du clair.
 * laterite : l'aplat du journal de chantier ou d'un calendrier. Une fois par page.
 */
export type Surface = "sable" | "calque" | "plan" | "laterite";

/**
 * Chaque surface pose son fond et ses couleurs de rôle (classes sur-*, globals.css) :
 * les pièces communes s'y habillent seules. Texte clair, les quatre valeurs de clair
 * et focus blanc sur le plan ; tout en blanc sur la latérite.
 */
const SURFACES: Record<Surface, string> = {
  sable: "bg-sable sur-sable",
  calque: "border-y border-filet bg-calque sur-calque",
  plan: "bg-plan sur-plan",
  laterite: "bg-laterite sur-laterite",
};

/** Les croisillons d'un plan de géomètre : encre sur clair, blanc sur le plan. */
const CROISILLONS: Record<Surface, string> = {
  sable: "croisillons",
  calque: "croisillons",
  plan: "croisillons-clairs",
  laterite: "croisillons-clairs",
};

/** Rythme vertical : 80 px sur mobile, 96 sur tablette, 128 au bureau. */
const RYTHMES = {
  section: "py-20 tab:py-24 desk:py-32",
  /** Ouverture d'une page : moins d'air en haut, l'en-tête est juste au-dessus. */
  ouverture: "pt-10 pb-20 tab:pt-14 tab:pb-24 desk:pt-20 desk:pb-32",
  /** Suite d'une section sur le même fond : pas d'air en haut. */
  fin: "pt-0 pb-20 tab:pb-24 desk:pb-32",
};

/**
 * Section : <section aria-labelledby>, surface et rythme. Le contenu est posé dans
 * `wrap` (1 360 px plus les gouttières), sauf `wrap={false}`.
 *
 * Une surface sombre porte data-voie="sombre" : la voie de lecture passe en clair
 * au-dessus d'elle (components/voie-lecture.tsx).
 */
export function Section({
  id,
  labelledBy,
  surface = "sable",
  rythme = "section",
  croisillons = false,
  wrap = true,
  className,
  children,
}: {
  id?: string;
  labelledBy?: string;
  surface?: Surface;
  rythme?: keyof typeof RYTHMES;
  /** Sous une ouverture de page, un tableau, une figure. Jamais sous un long paragraphe. */
  croisillons?: boolean;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const sombre = surface === "plan" || surface === "laterite";
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={surface}
      data-voie={sombre ? "sombre" : undefined}
      className={cx(
        SURFACES[surface],
        croisillons && CROISILLONS[surface],
        // Au bureau, la limite de l'en-tête de section passe entre deux rangées de croix
        // (globals.css, « Matières »). Une page peut décaler autrement : une classe
        // desk:[background-position:…] passe devant.
        croisillons && rythme === "section" && "desk:[--croix-y:32px]",
        // Même chose sur téléphone, en ouverture de page : la limite est à 54 px du haut,
        // la première rangée de croix à 48. Le motif remonte de 24 px.
        croisillons && rythme === "ouverture" && "max-tab:[--croix-y:-24px]",
        RYTHMES[rythme],
        className,
      )}
    >
      {wrap ? <div className="wrap">{children}</div> : children}
    </section>
  );
}
