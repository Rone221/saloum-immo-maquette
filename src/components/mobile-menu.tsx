"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
// coordonnees.ts et pas site.ts : ce composant part au navigateur, les sources et
// les statuts des faits restent côté serveur.
import { ADRESSE_EMAIL as EMAIL, NAVIGATION, NUMERO_FIXE as FIXE, NUMERO_MOBILE as MOBILE } from "@/content/coordonnees";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { etatRubrique, useChemin } from "./nav-links";

const BUREAU = "(min-width: 1101px)";

/**
 * Menu plein écran sous 1 101 px (3.2).
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
          "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-1 border-[1.5px] border-ink px-3 text-2 leading-tight font-semibold tab:h-12 tab:min-w-12 tab:px-3.5",
          ouvert ? "bg-ink text-white" : "bg-paper text-ink",
        )}
      >
        {ouvert ? "Fermer" : "Menu"}
      </button>

      <nav id="nav" ref={panneau} aria-label="Menu" data-open={ouvert} className="menu-panel">
        <ol>
          {NAVIGATION.map((r) => {
            const etat = etatRubrique(chemin, r);
            return (
              <li key={r.href}>
                <Link
                  href={r.href}
                  onClick={() => fermer(false)}
                  aria-current={etat === "page" ? "page" : etat === "rubrique" ? "true" : undefined}
                  className={cx(
                    "flex min-h-14 w-full items-baseline gap-4 border-b border-rule py-3.5 text-5 leading-snug font-650 stretch-sub",
                    etat && "text-trait underline decoration-[1.5px] underline-offset-6",
                  )}
                >
                  <span className="inline-block font-mono text-1 leading-tight font-medium text-trait">{r.numero}</span>
                  {r.libelle}
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="mt-auto flex flex-col pt-7">
          <a
            href={waHref()}
            onClick={() => fermer(false)}
            className="mb-3.5 flex min-h-22 flex-col justify-center gap-1 rounded-1 bg-trait px-5 py-3.5 text-white transition-surface hover:bg-ink"
          >
            <span className="text-4 leading-snug font-bold stretch-sub">Écrire sur WhatsApp</span>
            <span className="font-mono text-2 leading-snug font-medium">{typo(MOBILE.long)}</span>
          </a>
          <a href={MOBILE.href} className="flex min-h-11 items-center gap-3 border-b border-rule font-mono text-2 leading-snug font-medium">
            <span className="w-16 text-1 text-ink-2">Mobile</span>
            {typo(MOBILE.court)}
          </a>
          <a href={FIXE.href} className="flex min-h-11 items-center gap-3 border-b border-rule font-mono text-2 leading-snug font-medium">
            <span className="w-16 text-1 text-ink-2">Fixe</span>
            {typo(FIXE.court)}
          </a>
          <a href={EMAIL.href} className="flex min-h-11 items-center gap-3 border-b border-rule font-mono text-2 leading-snug font-medium">
            <span className="w-16 text-1 text-ink-2">E-mail</span>
            {EMAIL.adresse}
          </a>
        </div>
      </nav>
    </div>
  );
}
