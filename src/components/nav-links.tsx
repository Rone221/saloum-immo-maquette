"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NAVIGATION, type Rubrique } from "@/content/coordonnees";
import { cx } from "@/lib/base";

/** Chemin courant, toujours terminé par « / » (trailingSlash). */
export function useChemin(): string {
  const p = usePathname() || "/";
  return p.endsWith("/") ? p : `${p}/`;
}

/**
 * État d'un lien de rubrique : « page » si c'est la page même, « rubrique » si la
 * page est dedans (une fiche dans Terrains), sinon rien.
 */
export function etatRubrique(chemin: string, r: Rubrique): "page" | "rubrique" | null {
  if (chemin === r.href) return "page";
  if (chemin.startsWith(r.href)) return "rubrique";
  return null;
}

/** aria-current d'un lien de rubrique : « page » sur la page même, « true » dans la rubrique. */
export function ariaCourant(etat: ReturnType<typeof etatRubrique>) {
  return etat === "page" ? "page" : etat === "rubrique" ? "true" : undefined;
}

/**
 * Navigation en ligne de l'en-tête (≥ 1 101 px). Six liens, ordre fixe, sans numéro.
 * Page courante : bleue, le trait dessous tracé en permanence. Survol : le trait se trace.
 */
export function NavLinks() {
  const chemin = useChemin();
  return (
    <ul className="flex gap-5 wide:gap-7">
      {NAVIGATION.map((r) => {
        const etat = etatRubrique(chemin, r);
        return (
          <li key={r.href}>
            <Link
              href={r.href}
              aria-current={ariaCourant(etat)}
              className={cx(
                // Le trait se trace de gauche à droite au survol ; il reste tracé sur la page courante.
                "relative inline-flex min-h-11 items-center font-medium whitespace-nowrap transition-colors duration-200 hover:text-trait",
                "after:absolute after:inset-x-0 after:bottom-1.5 after:h-[2px] after:origin-left after:bg-trait after:transition-transform after:duration-300 after:ease-out",
                etat ? "text-trait after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              {r.libelle}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Les six rubriques du pied de page, page courante en bleu. */
export function LiensRubriques({ className }: { className?: string }) {
  const chemin = useChemin();
  return (
    <>
      {NAVIGATION.map((r) => {
        const etat = etatRubrique(chemin, r);
        return (
          <li key={r.href}>
            <Link href={r.href} aria-current={ariaCourant(etat)} className={cx(className, etat && "text-trait")}>
              {r.libelle}
            </Link>
          </li>
        );
      })}
    </>
  );
}

/** Rend ses enfants partout sauf sur la page Contact (le bloc bleu du pied y est l'ouverture). */
export function SaufSurContact({ children }: { children: ReactNode }) {
  const chemin = useChemin();
  return chemin === "/contact/" ? null : <>{children}</>;
}
