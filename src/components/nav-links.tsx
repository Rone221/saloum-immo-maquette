"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
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

/** « 01 » à « 06 » : le rang d'une rubrique, dans le menu mobile et au pied. */
export function rangRubrique(i: number): string {
  return String(i + 1).padStart(2, "0");
}

/** Au-delà de 40 px de défilement, l'en-tête en surimpression se pose (direction v4, pièce 2). */
const SEUIL_POSE = 40;

const abonnerDefilement = (rappel: () => void) => {
  window.addEventListener("scroll", rappel, { passive: true });
  return () => window.removeEventListener("scroll", rappel);
};
const sansAbonnement = () => () => {};

/**
 * Le cadre de l'en-tête du site : la balise <header> et ses deux états (globals.css,
 * « En-tête du site »). Le contenu est rendu côté serveur et passé en enfants.
 *
 * data-vivant : le script tourne. Sur une page à ouverture sombre, l'en-tête passe
 * alors de « posé sur l'ouverture, il part avec elle » à « fixe ».
 * data-pose : on a défilé de plus de 40 px. L'en-tête en surimpression prend son calque.
 *
 * Ce composant ne sait pas si la page s'ouvre sur du sombre : c'est la feuille de style
 * qui le lit dans la page (premier bloc de <main>, data-ouverture="sombre"). Sur les
 * autres pages, les deux attributs ne changent rien à l'affichage.
 */
export function CadreEntete({ children }: { children: ReactNode }) {
  const vivant = useSyncExternalStore(
    sansAbonnement,
    () => true,
    () => false,
  );
  const pose = useSyncExternalStore(
    abonnerDefilement,
    () => window.scrollY > SEUIL_POSE,
    () => false,
  );
  return (
    <header className="entete" data-vivant={vivant ? "" : undefined} data-pose={pose ? "" : undefined}>
      {children}
    </header>
  );
}

/**
 * Navigation en ligne de l'en-tête (≥ 1 101 px). Six liens, ordre fixe, sans numéro,
 * en 15 px, graisse 500. Page courante : un trait plein d'accent dessous, tracé en
 * permanence (plein : ce qui est acquis). Survol : le trait se tire de gauche à droite.
 * La couleur d'accent suit l'état de l'en-tête (latérite, latérite vive en surimpression).
 */
export function NavLinks() {
  const chemin = useChemin();
  return (
    // Écarts mesurés : l'en-tête tient sur une ligne à 1 101 px avec gap-5, le numéro
    // de téléphone n'arrivant qu'à 1 281 px (components/site-header.tsx).
    <ul className="flex gap-5 wide:gap-6">
      {NAVIGATION.map((r) => {
        const etat = etatRubrique(chemin, r);
        return (
          <li key={r.href}>
            <Link
              href={r.href}
              aria-current={ariaCourant(etat)}
              className={cx(
                "relative inline-flex min-h-11 items-center text-menu font-medium whitespace-nowrap",
                "after:absolute after:inset-x-0 after:bottom-1.5 after:h-[2px] after:origin-left after:bg-accent after:transition-transform after:duration-500 after:ease-pose",
                etat ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
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

/**
 * Les six rubriques du pied de page, numérotées 01 à 06 : le numéro en étiquette, dans
 * la couleur d'accent ; la page courante en clair plein, soulignée.
 */
export function LiensRubriques() {
  const chemin = useChemin();
  return (
    <>
      {NAVIGATION.map((r, i) => {
        const etat = etatRubrique(chemin, r);
        return (
          <li key={r.href}>
            <Link
              href={r.href}
              aria-current={ariaCourant(etat)}
              className="group inline-flex min-h-11 items-baseline gap-2.5 py-2.5"
            >
              <span aria-hidden="true" className="etiquette text-accent">
                {rangRubrique(i)}
              </span>
              <span
                className={cx(
                  "decoration-1 underline-offset-4 transition-surface group-hover:text-fort group-hover:underline",
                  etat && "text-fort underline",
                )}
              >
                {r.libelle}
              </span>
            </Link>
          </li>
        );
      })}
    </>
  );
}

/** Rend ses enfants partout sauf sur la page Contact (le numéro du pied y est le titre). */
export function SaufSurContact({ children }: { children: ReactNode }) {
  const chemin = useChemin();
  return chemin === "/contact/" ? null : <>{children}</>;
}

/** Rend ses enfants partout sauf sur l'accueil. */
export function SaufSurAccueil({ children }: { children: ReactNode }) {
  const chemin = useChemin();
  return chemin === "/" ? null : <>{children}</>;
}
