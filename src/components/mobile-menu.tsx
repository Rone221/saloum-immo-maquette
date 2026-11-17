"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
// coordonnees.ts et pas site.ts : ce composant part au navigateur, les sources et
// les statuts des faits restent côté serveur.
import { NAVIGATION, NUMERO_MOBILE } from "@/content/coordonnees";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { ariaCourant, etatRubrique, rangRubrique, useChemin } from "./nav-links";

const BUREAU = "(min-width: 1101px)";

/**
 * Menu plein écran sous 1 101 px (direction v4, pièce 2) : les six rubriques
 * numérotées 01 à 06, le numéro en étiquette et le nom en Besley ; en bas, le numéro
 * de téléphone, puis WhatsApp et Appeler côte à côte.
 * Ouvert : la page derrière ne défile plus, `main` et le pied de page sont inertes,
 * le focus reste entre le bouton et le panneau. Fermeture sur un lien, sur Échap
 * (le focus revient au bouton), au passage au-delà de 1 100 px, au changement de page.
 * Ouvert sur une ouverture sombre, l'en-tête reprend son calque (globals.css).
 *
 * `libelles` : les libellés des deux boutons, passés par l'en-tête (content/messages.ts
 * reste côté serveur).
 */
export function MobileMenu({ libelles }: { libelles: { whatsapp: string; appel: string } }) {
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
          // Bordure et texte dans la valeur forte de l'en-tête : encre, blanc en surimpression.
          "etiquette inline-flex h-11 w-20 cursor-pointer items-center justify-center border-[1.5px] border-fort transition-surface",
          ouvert ? "bg-fort text-calque" : "text-fort",
        )}
      >
        {ouvert ? "Fermer" : "Menu"}
      </button>

      <nav id="nav" ref={panneau} aria-label="Menu" data-open={ouvert} className="menu-panel">
        <ol className="m-0 list-none p-0">
          {NAVIGATION.map((r, i) => {
            const etat = etatRubrique(chemin, r);
            return (
              <li key={r.href} className="border-b border-filet">
                <Link
                  href={r.href}
                  onClick={() => fermer(false)}
                  aria-current={ariaCourant(etat)}
                  className="flex min-h-15 w-full items-baseline gap-4 py-3.5"
                >
                  <span aria-hidden="true" className="etiquette w-6 flex-none text-laterite">
                    {rangRubrique(i)}
                  </span>
                  <span className={cx("titre text-[1.625rem] leading-[1.15]", etat && "text-laterite")}>{r.libelle}</span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-auto pt-8">
          <a
            href={NUMERO_MOBILE.href}
            onClick={() => fermer(false)}
            className="mesure inline-flex min-h-11 items-center text-[1.375rem] leading-none"
          >
            {typo(NUMERO_MOBILE.long)}
          </a>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={waHref()}
              onClick={() => fermer(false)}
              className="inline-flex min-h-13 items-center justify-center border-[1.5px] border-laterite bg-laterite px-4 font-semibold text-blanc transition-surface hover:border-encre hover:bg-encre"
            >
              {libelles.whatsapp}
            </a>
            <a
              href={NUMERO_MOBILE.href}
              onClick={() => fermer(false)}
              aria-label={typo(`${libelles.appel}, ${NUMERO_MOBILE.long}`)}
              className="inline-flex min-h-13 items-center justify-center border-[1.5px] border-encre px-4 font-semibold text-encre transition-surface hover:bg-encre hover:text-calque"
            >
              {libelles.appel}
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
