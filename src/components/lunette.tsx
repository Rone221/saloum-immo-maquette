"use client";

import "./ouverture-plan.css";
import { useEffect, useRef } from "react";

/** Un point de la photo, en pixels de l'original. */
export type Point = [number, number];

/**
 * Un tronçon de voie, mesuré sur l'original. `de` et `a` sont sur l'axe relevé ;
 * `gauche` et `droite` donnent l'écart de l'axe à chaque bordure, en pixels, au départ
 * puis à l'arrivée (à main gauche et à main droite quand on va de `de` vers `a`).
 * Entre les deux, la bordure est droite. `nu` : pas de bordure le long de ce tronçon
 * (une pointe, une aire de retournement, une fin contre un mur).
 */
export type Troncon = {
  de: Point;
  a: Point;
  gauche: [number, number];
  droite: [number, number];
  nu?: boolean;
};

/** Un rectangle de la photo : gauche, haut, droite, bas, en pixels de l'original. */
export type Zone = [number, number, number, number];

/** Ce que la lunette sait nommer. Hors des voies, rien. */
type Vise = "axe" | "voie" | "bordure" | null;

/** Le disque fait 176 px, et grossit deux fois. */
const RAYON = 88;
const GROSSISSEMENT = 2;
/** Près d'un texte, le disque rétrécit plutôt que de le couvrir. Sous ce rayon, il se ferme. */
const RAYON_MIN = 36;
/** De l'air entre le disque et un texte, et la place du nom sous le disque. */
const MARGE = 6;
const PLACE_DU_NOM = 40;
/** Une ligne fine (l'en-tête de planche) : la lunette passe dessus, mais ne s'y ouvre pas. */
const MARGE_LIGNE = 10;
/**
 * Tolérances de visée, en pixels de l'original : de part et d'autre du trait de l'axe,
 * et de part et d'autre de la ligne d'une bordure (elle fait 3 à 4 px de large).
 */
const TOL_AXE = 4;
const TOL_BORDURE = 5;
/** Par défaut, aucune zone muette. Hors du composant : la même liste à chaque rendu. */
const AUCUNE: Zone[] = [];

/**
 * La lunette (direction v4, pièce 3) : un disque qui grossit la photo deux fois sous
 * le pointeur et, dessous, le nom de ce qu'on vise : « Axe de voie », « Voie en
 * latérite », « Bordure béton ». Le nom est calculé avec les axes relevés et les
 * bordures mesurées sur l'original (`troncons`). Hors des voies, elle ne dit rien.
 * Aucun chiffre, aucune coordonnée.
 *
 * À poser dans le bloc de la photo (une <section> en position relative, découpée). Elle
 * y trouve la photo (`image`) et ce qu'elle ne doit pas couvrir : les blocs qui portent
 * data-sans-lunette. Près d'eux, le disque rétrécit, puis se ferme : elle ne s'ouvre
 * jamais sur un texte ni sur un cartouche. data-sans-lunette="ligne" : une ligne fine,
 * que le disque peut frôler.
 *
 * Au pointeur fin seulement : rien au doigt, rien au clavier, rien sans script. Elle
 * n'apprend rien que la page ne dise déjà (la légende et le cartouche de la photo) :
 * elle est cachée aux lecteurs d'écran. La grande variante de la photo n'est chargée
 * qu'au premier mouvement. Le script écrit une fois par image ; la feuille de style
 * dessine (components/ouverture-plan.css, « La lunette »).
 */
export function Lunette({
  grande,
  largeur,
  hauteur,
  axes,
  troncons,
  muets = AUCUNE,
  noms,
  image = "img",
}: {
  /** L'adresse de la plus grande variante de la photo. */
  grande: string;
  /** Les dimensions de l'original : le repère des axes et des tronçons. */
  largeur: number;
  hauteur: number;
  /** Les axes relevés (tracés SVG), redessinés dans le disque. */
  axes: string[];
  troncons: Troncon[];
  /** Là où elle ne nomme rien, bien qu'on soit sur une voie : un véhicule garé dessus. */
  muets?: Zone[];
  noms: { axe: string; voie: string; bordure: string };
  /** Le sélecteur de la photo, dans le bloc. Par défaut, sa première image. */
  image?: string;
}) {
  const racine = useRef<HTMLDivElement>(null);
  const disque = useRef<HTMLDivElement>(null);
  const trace = useRef<SVGSVGElement>(null);
  const nom = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const lunette = racine.current;
    const bloc = lunette?.closest<HTMLElement>("section");
    if (!lunette || !bloc || !disque.current || !trace.current || !nom.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const verre = disque.current;
    const dessin = trace.current;
    const etiquette = nom.current;

    /** Chaque tronçon avec sa longueur et sa direction, calculées une fois. */
    const voies = troncons.map((t) => {
      const longueur = Math.hypot(t.a[0] - t.de[0], t.a[1] - t.de[1]);
      return { ...t, longueur, ux: (t.a[0] - t.de[0]) / longueur, uy: (t.a[1] - t.de[1]) / longueur };
    });

    /** Ce qu'il y a au point (u, v) de l'original. */
    const viser = (u: number, v: number): Vise => {
      if (muets.some(([x0, y0, x1, y1]) => u >= x0 && u <= x1 && v >= y0 && v <= y1)) return null;
      let voie = false;
      let bordure = false;
      for (const t of voies) {
        // Le long de l'axe, puis en travers (positif à main droite).
        const le = (u - t.de[0]) * t.ux + (v - t.de[1]) * t.uy;
        if (le < 0 || le > t.longueur) continue;
        const travers = (v - t.de[1]) * t.ux - (u - t.de[0]) * t.uy;
        if (Math.abs(travers) <= TOL_AXE) return "axe";
        const k = le / t.longueur;
        const droite = t.droite[0] + (t.droite[1] - t.droite[0]) * k;
        const gauche = t.gauche[0] + (t.gauche[1] - t.gauche[0]) * k;
        if (t.nu) {
          if (travers >= -gauche && travers <= droite) voie = true;
        } else if (travers > -gauche + TOL_BORDURE && travers < droite - TOL_BORDURE) {
          voie = true;
        } else if (Math.abs(travers + gauche) <= TOL_BORDURE || Math.abs(travers - droite) <= TOL_BORDURE) {
          bordure = true;
        }
      }
      // Dans un carrefour, la bordure d'une voie s'interrompt : la chaussée de l'autre passe devant.
      return voie ? "voie" : bordure ? "bordure" : null;
    };

    let x = 0;
    let y = 0;
    let trame = 0;
    let ouverte = false;
    let chargee = false;
    let vise: Vise = null;

    const fermer = () => {
      if (!ouverte) return;
      ouverte = false;
      lunette.removeAttribute("data-ouverte");
      bloc.removeAttribute("data-lunette-ouverte");
    };

    /** Au premier mouvement : l'image déjà à l'écran d'abord, puis la grande, une fois décodée. */
    const charger = (photo: HTMLImageElement) => {
      chargee = true;
      const affichee = photo.currentSrc || photo.src;
      verre.style.backgroundImage = `url("${affichee}")`;
      if (affichee.endsWith(grande)) return;
      const g = new Image();
      g.src = grande;
      g.decode().then(
        () => (verre.style.backgroundImage = `url("${grande}")`),
        () => {},
      );
    };

    const ecrire = () => {
      trame = 0;
      const photo = bloc.querySelector<HTMLImageElement>(image);
      if (!photo) return fermer();

      // Le rayon : 88 px, moins près d'un texte ou du cartouche. Jamais dessus.
      let r = RAYON;
      for (const el of bloc.querySelectorAll<HTMLElement>("[data-sans-lunette]")) {
        const b = el.getBoundingClientRect();
        if (!b.width && !b.height) continue;
        const dx = Math.max(b.left - x, 0, x - b.right);
        let dy = Math.max(b.top - y, 0, y - b.bottom);
        if (el.dataset.sansLunette === "ligne") {
          if (dx <= MARGE_LIGNE && dy <= MARGE_LIGNE) r = 0;
          continue;
        }
        // Un texte dessous : il faut aussi la place du nom, sous le disque.
        if (b.top > y) dy = Math.max(0, dy - PLACE_DU_NOM);
        r = Math.min(r, Math.hypot(dx, dy) - MARGE);
      }
      if (r < RAYON_MIN) return fermer();

      // La photo à l'écran. Sa boîte est au ratio de l'original ; sinon (repli de la
      // feuille de style), elle est recadrée au centre : même calcul.
      const p = photo.getBoundingClientRect();
      const echelle = Math.max(p.width / largeur, p.height / hauteur);
      const u = (x - (p.left + (p.width - largeur * echelle) / 2)) / echelle;
      const v = (y - (p.top + (p.height - hauteur * echelle) / 2)) / echelle;
      // Hors de la photo (sous elle, sur mobile large) : rien à grossir.
      if (u < 0 || u > largeur || v < 0 || v > hauteur) return fermer();

      if (!chargee) charger(photo);
      const c = bloc.getBoundingClientRect();
      const g = echelle * GROSSISSEMENT;
      lunette.style.setProperty("--x", `${(x - c.left).toFixed(1)}px`);
      lunette.style.setProperty("--y", `${(y - c.top).toFixed(1)}px`);
      lunette.style.setProperty("--r", `${r.toFixed(1)}px`);
      verre.style.backgroundSize = `${(largeur * g).toFixed(1)}px ${(hauteur * g).toFixed(1)}px`;
      verre.style.backgroundPosition = `${(r - u * g).toFixed(1)}px ${(r - v * g).toFixed(1)}px`;
      // Le tracé, cadré sur le même morceau de photo.
      const demi = r / g;
      dessin.setAttribute("viewBox", `${(u - demi).toFixed(1)} ${(v - demi).toFixed(1)} ${(2 * demi).toFixed(1)} ${(2 * demi).toFixed(1)}`);

      const vu = viser(u, v);
      if (vu !== vise) {
        vise = vu;
        if (vu) etiquette.textContent = noms[vu];
        lunette.toggleAttribute("data-nomme", vu !== null);
      }
      if (!ouverte) {
        ouverte = true;
        lunette.setAttribute("data-ouverte", "");
        bloc.setAttribute("data-lunette-ouverte", "");
      }
    };

    const bouger = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!trame) trame = requestAnimationFrame(ecrire);
    };
    /** Le pointeur sort du bloc, ou la page défile sous lui : la lunette se ferme. */
    const sortir = () => {
      if (trame) cancelAnimationFrame(trame);
      trame = 0;
      fermer();
    };

    bloc.addEventListener("pointermove", bouger, { passive: true });
    bloc.addEventListener("pointerleave", sortir);
    window.addEventListener("scroll", sortir, { passive: true });
    return () => {
      bloc.removeEventListener("pointermove", bouger);
      bloc.removeEventListener("pointerleave", sortir);
      window.removeEventListener("scroll", sortir);
      sortir();
    };
  }, [grande, largeur, hauteur, troncons, muets, noms, image]);

  return (
    <div ref={racine} aria-hidden="true" className="lunette">
      <div ref={disque} className="lunette-disque">
        <svg ref={trace} viewBox={`0 0 ${largeur} ${hauteur}`} className="lunette-trace">
          {axes.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <span className="lunette-reticule" />
      </div>
      <span className="lunette-rappel" />
      <span ref={nom} className="lunette-nom etiquette" />
    </div>
  );
}
