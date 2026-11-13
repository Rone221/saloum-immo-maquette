"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION, NOMS_DE_PAGE, type Rubrique } from "@/content/coordonnees";
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

/**
 * Navigation en ligne de l'en-tête (≥ 1 101 px). Six liens, ordre fixe.
 * Page courante : trait souligné (1,5 px, décalage 6 px), en permanence.
 */
export function NavLinks() {
  const chemin = useChemin();
  return (
    <ol className="flex gap-4.5 wide:gap-6.5">
      {NAVIGATION.map((r) => {
        const etat = etatRubrique(chemin, r);
        return (
          <li key={r.href}>
            <Link
              href={r.href}
              aria-current={ariaCourant(etat)}
              className={cx(
                "inline-flex min-h-11 items-center text-2 font-medium whitespace-nowrap decoration-[1.5px] underline-offset-6 hover:text-trait hover:underline",
                etat && "text-trait underline",
              )}
            >
              {r.libelle}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** aria-current d'un lien de rubrique : « page » sur la page même, « true » dans la rubrique. */
function ariaCourant(etat: ReturnType<typeof etatRubrique>) {
  return etat === "page" ? "page" : etat === "rubrique" ? "true" : undefined;
}

/** Nom de la page courante, pour la case « Page » du cartouche. */
export function PageCourante() {
  const chemin = useChemin();
  return <>{NOMS_DE_PAGE[chemin] ?? "Page introuvable"}</>;
}

/** Les six rubriques du cartouche, page courante en trait (3.0), comme dans l'en-tête. */
export function LiensRubriques({ className }: { className?: string }) {
  const chemin = useChemin();
  return (
    <>
      {NAVIGATION.map((r) => {
        const etat = etatRubrique(chemin, r);
        return (
          <Link key={r.href} href={r.href} aria-current={ariaCourant(etat)} className={cx(className, etat && "text-trait")}>
            {r.libelle}
          </Link>
        );
      })}
    </>
  );
}

/**
 * « · Mentions légales » dans la case « Page » du cartouche, sauf sur cette page :
 * la case y dit déjà son nom, le lien mènerait à la page elle-même.
 */
export function LienMentions({ className }: { className?: string }) {
  const chemin = useChemin();
  if (chemin === "/mentions-legales/") return null;
  return (
    <>
      {" · "}
      <Link href="/mentions-legales/" className={className}>
        Mentions légales
      </Link>
    </>
  );
}
