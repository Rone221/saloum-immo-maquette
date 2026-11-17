"use client";

import { useEffect } from "react";
import { useChemin } from "./nav-links";

/**
 * Ce qui se tire une fois en entrant à l'écran (globals.css, « se-tire » et « Le mot
 * coté » ; foncier.css, les trois statuts de l'avertissement). Les autres traits du
 * site se tirent à l'arrivée sur la page (se-tire-arrivee, data-arrivee).
 */
const TRAITS = ".se-tire, .mot-cote:not([data-arrivee]), .foncier-statut";

/**
 * Les traits qui se tirent (direction v4, « se tire une fois »). Un trait encore sous
 * l'écran à l'arrivée attend, replié (data-trait="attend") ; quand il entre à l'écran,
 * il se tire en entier, en moins d'une seconde (data-trait="tire"). Il ne suit pas le
 * défilement : arrêté n'importe où, aucun trait ne reste à moitié tracé.
 *
 * Un trait déjà à l'écran ou au-dessus à l'arrivée ne bouge pas : il est entier. Sans
 * script, en mouvement réduit et à l'impression, tous les traits sont entiers (la feuille
 * de style ne replie un trait que sous data-trait="attend", à l'écran, en mouvement
 * normal). Un trait caché à l'arrivée (menu fermé, case repliée) n'est pas suivi : il
 * est entier quand il se montre.
 *
 * Monté une fois dans le layout ; il refait sa liste à chaque changement de page.
 */
export function Traits() {
  const chemin = useChemin();

  useEffect(() => {
    if (chemin.startsWith("/admin/")) return;
    if (!window.matchMedia("screen and (prefers-reduced-motion: no-preference)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const suivis: HTMLElement[] = [];
    const observateur = new IntersectionObserver((entrees) => {
      for (const entree of entrees) {
        if (!entree.isIntersecting) continue;
        const trait = entree.target as HTMLElement;
        trait.dataset.trait = "tire";
        observateur.unobserve(trait);
      }
    });

    const bas = window.innerHeight;
    for (const trait of document.querySelectorAll<HTMLElement>(TRAITS)) {
      const boite = trait.getBoundingClientRect();
      if (boite.width === 0 && boite.height === 0) continue;
      if (boite.top < bas) continue;
      trait.dataset.trait = "attend";
      observateur.observe(trait);
      suivis.push(trait);
    }

    return () => {
      observateur.disconnect();
      for (const trait of suivis) delete trait.dataset.trait;
    };
  }, [chemin]);

  return null;
}
