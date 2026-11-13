"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
// coordonnees.ts et pas site.ts : ce composant part au navigateur, les sources et
// les statuts des faits restent côté serveur.
import { NAVIGATION } from "@/content/coordonnees";
import { cx } from "@/lib/base";
import { waHref } from "@/lib/whatsapp";
import { ariaCourant, etatRubrique, useChemin } from "./nav-links";

const BUREAU = "(min-width: 1101px)";

/**
 * Menu plein écran sous 1 101 px : les six rubriques et le bouton WhatsApp.
 * Ouvert : la page derrière ne défile plus, `main` et le pied de page sont inertes,
 * le focus reste entre le bouton et le panneau. Fermeture sur un lien, sur Échap
 * (le focus revient au bouton), au passage au-delà de 1 100 px, au changement de page.
 */
export function MobileMenu() {
  const [ouvert, setOuvert] = useState(false);
  const bouton = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLElement>(null);
  const chemin = useChemin();

  const fermer = useCallback((rendreFocus: boolean) => {
    setOuvert(false);
    if (rendreFocus) bouton.current?.focus();
  }, []);

  // Défilement bloqué, page derrière inerte, focus sur le premier lien.
  useEffect(() => {
    const html = document.documentElement;
    const derriere = [document.getElementById("contenu"), document.getElementById("pied")].filter(
      (el): el is HTMLElement => el !== null,
    );
    html.classList.toggle("menu-open", ouvert);
    derriere.forEach((el) => (el.inert = ouvert));
    if (ouvert) panneau.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      html.classList.remove("menu-open");
      derriere.forEach((el) => (el.inert = false));
    };
  }, [ouvert]);

  // Échap, et fermeture au passage en navigation de bureau.
  useEffect(() => {
    if (!ouvert) return;
    const touche = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") fermer(true);
    };
    const mq = window.matchMedia(BUREAU);
    const largeur = (e: MediaQueryListEvent) => {
      if (e.matches) fermer(false);
    };
    document.addEventListener("keydown", touche);
    mq.addEventListener("change", largeur);
    return () => {
      document.removeEventListener("keydown", touche);
      mq.removeEventListener("change", largeur);
    };
  }, [ouvert, fermer]);

  // Changement de page : on referme (le lien cliqué ferme déjà, ceci couvre le retour arrière).
  const cheminOuvert = useRef(chemin);
  useEffect(() => {
    if (cheminOuvert.current !== chemin) {
      cheminOuvert.current = chemin;
      setOuvert(false);
    }
  }, [chemin]);

  // Focus piégé : Tab tourne entre le bouton et les liens du panneau.
  const pieger = (e: KeyboardEvent) => {
    if (!ouvert || e.key !== "Tab" || !panneau.current || !bouton.current) return;
    const liens = Array.from(panneau.current.querySelectorAll<HTMLElement>("a[href]"));
    const cycle = [bouton.current, ...liens];
    const i = cycle.indexOf(document.activeElement as HTMLElement);
    const suivant = e.shiftKey ? (i <= 0 ? cycle.length - 1 : i - 1) : i === cycle.length - 1 ? 0 : i + 1;
    e.preventDefault();
    cycle[suivant].focus();
  };

  return (
    <div className="desk:hidden" onKeyDown={pieger}>
      <button
        ref={bouton}
        type="button"
        aria-expanded={ouvert}
        aria-controls="nav"
        onClick={() => setOuvert((o) => !o)}
        className={cx(
          // Largeur fixe, celle de « Fermer » : le bouton ne bouge pas à l'ouverture.
          "inline-flex h-11 w-18 cursor-pointer items-center justify-center rounded-1 border-[1.5px] border-ink font-semibold tab:h-12",
          ouvert ? "bg-ink text-white" : "bg-paper text-ink",
        )}
      >
        {ouvert ? "Fermer" : "Menu"}
      </button>

      <nav id="nav" ref={panneau} aria-label="Menu" data-open={ouvert} className="menu-panel">
        <ul>
          {NAVIGATION.map((r) => {
            const etat = etatRubrique(chemin, r);
            return (
              <li key={r.href}>
                <Link
                  href={r.href}
                  onClick={() => fermer(false)}
                  aria-current={ariaCourant(etat)}
                  className={cx(
                    "flex min-h-14 w-full items-center text-h3 leading-snug font-semibold",
                    etat && "text-trait underline decoration-[1.5px] underline-offset-6",
                  )}
                >
                  {r.libelle}
                </Link>
              </li>
            );
          })}
        </ul>
        <a
          href={waHref()}
          onClick={() => fermer(false)}
          className="mt-auto flex min-h-13 items-center justify-center rounded-1 bg-trait px-6 font-semibold text-white transition-surface hover:bg-ink"
        >
          Écrire sur WhatsApp
        </a>
      </nav>
    </div>
  );
}
