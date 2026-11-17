"use client";

import { useEffect } from "react";

/**
 * L'aimant : la part de l'écart au centre du bouton, en x puis en y. Léger : 12 px au
 * plus sur un bouton de 260 px de large, 4 px en hauteur.
 */
const AIMANT_X = 0.1;
const AIMANT_Y = 0.16;
/** La bascule d'une grande photo : 2° au bord, pas plus. */
const BASCULE = 2;

/**
 * Les deux gestes liés au pointeur (direction v4, pièces 13 et 14), pour tout le site :
 * l'aimant du bouton principal ([data-aimant], posé par components/boutons.tsx) et la
 * bascule d'une grande photo ([data-bascule], posé par CadrePhoto).
 *
 * Un seul écouteur, sur le document : les boutons et les photos restent des composants
 * serveur, et une page chargée plus tard est prise en charge sans rien faire. Le script
 * écrit des variables CSS, une fois par image ; la feuille de style fait le mouvement
 * (globals.css : transition-bouton, bascule).
 *
 * Rien au doigt, rien en mouvement réduit : le bouton et la photo restent à leur place.
 */
export function Gestes() {
  useEffect(() => {
    const fin = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fin.matches || calme.matches) return;

    let cible: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let image = 0;

    const lacher = (el: HTMLElement) => {
      el.style.removeProperty("--aimant-x");
      el.style.removeProperty("--aimant-y");
      el.style.removeProperty("--bascule-x");
      el.style.removeProperty("--bascule-y");
      el.removeAttribute("data-penche");
    };

    const ecrire = () => {
      image = 0;
      if (!cible) return;
      const r = cible.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      if (cible.hasAttribute("data-aimant")) {
        cible.style.setProperty("--aimant-x", `${(dx * AIMANT_X).toFixed(1)}px`);
        cible.style.setProperty("--aimant-y", `${(dy * AIMANT_Y).toFixed(1)}px`);
      } else {
        // De -1 à 1 d'un bord à l'autre : la photo penche vers le pointeur.
        const nx = Math.max(-1, Math.min(1, dx / (r.width / 2)));
        const ny = Math.max(-1, Math.min(1, dy / (r.height / 2)));
        cible.style.setProperty("--bascule-y", `${(nx * BASCULE).toFixed(2)}deg`);
        cible.style.setProperty("--bascule-x", `${(-ny * BASCULE).toFixed(2)}deg`);
        cible.setAttribute("data-penche", "");
      }
    };

    const bouger = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const vise = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-aimant], [data-bascule]") : null;
      if (vise !== cible) {
        if (cible) lacher(cible);
        cible = vise;
      }
      if (!cible) return;
      x = e.clientX;
      y = e.clientY;
      if (!image) image = requestAnimationFrame(ecrire);
    };

    /** Le pointeur quitte la fenêtre : tout revient en place. */
    const sortir = () => {
      if (cible) lacher(cible);
      cible = null;
    };

    document.addEventListener("pointermove", bouger, { passive: true });
    document.documentElement.addEventListener("pointerleave", sortir);
    return () => {
      document.removeEventListener("pointermove", bouger);
      document.documentElement.removeEventListener("pointerleave", sortir);
      if (image) cancelAnimationFrame(image);
      sortir();
    };
  }, []);

  return null;
}
