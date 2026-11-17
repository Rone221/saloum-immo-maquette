"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Quand le tirage peut suivre la main : un pointeur fin qui survole, la mise en page
 * de bureau (le tableau en colonnes), et du mouvement permis. Ailleurs (au doigt, au
 * clavier, en mouvement réduit, sans script), la vignette dans la ligne fait le travail.
 */
const TIRAGE_POSSIBLE =
  "(hover: hover) and (pointer: fine) and (min-width: 1101px) and (prefers-reduced-motion: no-preference)";

const abonner = (rappel: () => void) => {
  const mq = window.matchMedia(TIRAGE_POSSIBLE);
  mq.addEventListener("change", rappel);
  return () => mq.removeEventListener("change", rappel);
};
const lire = () => window.matchMedia(TIRAGE_POSSIBLE).matches;
const jamais = () => false;

/** Du pointeur au coin du tirage, en px : il se pose au-dessus et à droite de la main. */
const ECART = 28;
/**
 * De combien le tirage mord sur la ligne survolée, en px : son bord reste sur celui de
 * la ligne, il ne va pas sur ce qu'on y lit.
 */
const PRISE = 12;
/** Du tirage aux bords de l'écran, en px (penché, ses coins dépassent un peu de sa boîte). */
const MARGE = 20;
/** Le retard du tirage sur la main, en ms : il rattrape 63 % de l'écart dans ce temps. */
const RETARD = 110;
/** La durée du fondu de sortie, en ms (index-terrains.css) : après, le tirage est invisible. */
const FONDU = 260;

/**
 * L'aperçu d'un terrain (direction v4, pièce 8) : le tirage de la photo du programme
 * suit le pointeur pendant qu'il survole une ligne de l'index. Penché, avec sa légende.
 *
 * `children` : l'index lui-même, rendu côté serveur. Les lignes qui ont une photo
 * portent data-apercu="<clé>". `tirages` : une <figure data-cle="<clé>"> par photo,
 * rendues côté serveur aussi. Ce composant ne fait qu'écouter et placer : il écrit
 * --tx et --ty (une fois par image), data-montre sur le tirage et data-vue sur la
 * figure de la ligne survolée. La feuille de style fait le reste (index-terrains.css).
 *
 * Ce qu'il garantit :
 * - le tirage ne saute pas en s'effaçant : il garde sa photo et sa place pendant le
 *   fondu, et sa mise à l'échelle est animée comme son opacité ;
 * - d'une ligne à l'autre, les photos se fondent : pas d'image qui change d'un coup ;
 * - il se pose hors de la ligne survolée (au-dessus, sinon au-dessous), jamais sur
 *   ce qu'on y lit ;
 * - le retard se compte en temps, pas en images : le même sur tous les écrans ;
 * - la boucle s'arrête quand le tirage est arrivé.
 *
 * Le tirage est posé dans <body> (portail) : un bloc animé au défilement deviendrait
 * le repère d'un élément fixe, et le tirage partirait avec lui. Il n'existe qu'au
 * pointeur fin, et ses photos ne se chargent qu'à l'approche de l'index.
 */
export function ApercuTerrain({
  tirages,
  className,
  children,
  ...donnees
}: {
  tirages: ReactNode;
  className?: string;
  children: ReactNode;
  [donnee: `data-${string}`]: string | undefined;
}) {
  const racine = useRef<HTMLDivElement>(null);
  const tirage = useRef<HTMLDivElement>(null);
  const possible = useSyncExternalStore(abonner, lire, jamais);
  /** L'index est à moins d'un écran : on monte le tirage, ses photos se chargent. */
  const [proche, setProche] = useState(false);
  const vivant = possible && proche;

  useEffect(() => {
    const zone = racine.current;
    if (!possible || proche || !zone) return;
    const guetteur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) setProche(true);
      },
      { rootMargin: "100% 0px" },
    );
    guetteur.observe(zone);
    return () => guetteur.disconnect();
  }, [possible, proche]);

  useEffect(() => {
    const zone = racine.current;
    const carte = tirage.current;
    if (!vivant || !zone || !carte) return;

    const figures = [...carte.querySelectorAll<HTMLElement>("[data-cle]")];
    /** Le pointeur, la place visée (le coin haut gauche du tirage), la place écrite. */
    const main = { x: 0, y: 0 };
    const vise = { x: 0, y: 0 };
    const pose = { x: 0, y: 0 };
    let largeur = carte.offsetWidth;
    let hauteur = carte.offsetHeight;
    /** Le bas de l'en-tête du site : le tirage ne passe pas dessous. */
    let plafond = 0;
    /** La ligne survolée, et sa clé. */
    let ligne: HTMLElement | null = null;
    let cle: string | null = null;
    let montre = false;
    let sortie = -Infinity;
    let image = 0;
    let avant = 0;
    let verification = 0;

    const ecrire = () => {
      carte.style.setProperty("--tx", `${pose.x.toFixed(1)}px`);
      carte.style.setProperty("--ty", `${pose.y.toFixed(1)}px`);
    };

    /**
     * Où poser le tirage : à droite de la main, et hors de la ligne survolée, pour ne
     * rien couvrir de ce qu'on y lit. Au-dessus d'elle s'il y a la place (son bord bas
     * mord à peine sur le haut de la ligne), sinon au-dessous. D'une ligne à l'autre, il
     * monte ou descend d'une ligne ; le long d'une ligne, il suit la main.
     */
    const viser = () => {
      const droite = window.innerWidth - largeur - MARGE;
      vise.x = Math.max(MARGE, Math.min(main.x + ECART, droite));
      const hautMin = plafond + MARGE;
      const hautMax = window.innerHeight - MARGE - hauteur;
      const boite = ligne?.getBoundingClientRect();
      const dessus = Math.min(main.y - ECART, boite ? boite.top + PRISE : Infinity) - hauteur;
      const dessous = Math.max(main.y + ECART, boite ? boite.bottom - PRISE : -Infinity);
      if (dessus >= hautMin) vise.y = dessus;
      else if (dessous <= hautMax) vise.y = dessous;
      // Ni l'un ni l'autre : le côté où il déborde le moins sur la ligne.
      else vise.y = hautMin - dessus <= dessous - hautMax ? hautMin : Math.max(hautMin, hautMax);
    };

    const pas = (t: number) => {
      // Un onglet resté en arrière rend la main d'un coup : on borne le pas.
      const dt = Math.min(64, t - avant);
      avant = t;
      const part = 1 - Math.exp(-dt / RETARD);
      pose.x += (vise.x - pose.x) * part;
      pose.y += (vise.y - pose.y) * part;
      const arrive = Math.abs(vise.x - pose.x) < 0.2 && Math.abs(vise.y - pose.y) < 0.2;
      if (arrive) {
        pose.x = vise.x;
        pose.y = vise.y;
      }
      ecrire();
      image = arrive ? 0 : requestAnimationFrame(pas);
    };

    const lancer = () => {
      if (image) return;
      avant = performance.now();
      image = requestAnimationFrame(pas);
    };

    const cacher = () => {
      if (!montre) return;
      montre = false;
      sortie = performance.now();
      // La figure garde data-vue : la photo reste jusqu'au bout du fondu.
      carte.removeAttribute("data-montre");
    };

    /** La ligne sous le pointeur, s'il y en a une avec une photo. */
    const suivre = (cible: EventTarget | null) => {
      const survolee = cible instanceof Element ? cible.closest<HTMLElement>("[data-apercu]") : null;
      const visee = survolee && zone.contains(survolee) ? (survolee.dataset.apercu ?? null) : null;
      if (!survolee || !visee) {
        cacher();
        return;
      }
      ligne = survolee;
      if (visee !== cle) {
        cle = visee;
        figures.forEach((f) => f.toggleAttribute("data-vue", f.dataset.cle === cle));
        plafond = Math.max(0, document.querySelector(".entete")?.getBoundingClientRect().bottom ?? 0);
      }
      viser();
      if (!montre) {
        montre = true;
        // Sorti depuis longtemps, il n'est plus à l'écran : il arrive sous la main, sans
        // traverser la page. Encore en train de s'effacer, il repart d'où il est.
        if (performance.now() - sortie > FONDU) {
          pose.x = vise.x;
          pose.y = vise.y;
          ecrire();
        }
        carte.setAttribute("data-montre", "");
      }
      lancer();
    };

    const bouger = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      main.x = e.clientX;
      main.y = e.clientY;
      suivre(e.target);
    };

    /** La page défile sous une main immobile : la ligne survolée a pu changer. */
    const defiler = () => {
      if (!montre || verification) return;
      verification = requestAnimationFrame(() => {
        verification = 0;
        if (montre) suivre(document.elementFromPoint(main.x, main.y));
      });
    };

    const mesurer = () => {
      largeur = carte.offsetWidth;
      hauteur = carte.offsetHeight;
    };
    const taille = new ResizeObserver(mesurer);
    taille.observe(carte);

    zone.addEventListener("pointermove", bouger, { passive: true });
    zone.addEventListener("pointerleave", cacher);
    window.addEventListener("scroll", defiler, { passive: true });
    window.addEventListener("blur", cacher);
    return () => {
      taille.disconnect();
      zone.removeEventListener("pointermove", bouger);
      zone.removeEventListener("pointerleave", cacher);
      window.removeEventListener("scroll", defiler);
      window.removeEventListener("blur", cacher);
      if (image) cancelAnimationFrame(image);
      if (verification) cancelAnimationFrame(verification);
    };
  }, [vivant]);

  return (
    // data-tirage : le tirage suit la main. La feuille de style ne montre alors plus la
    // vignette au survol (elle ferait doublon), seulement au clavier.
    <div ref={racine} className={className} data-tirage={vivant ? "" : undefined} {...donnees}>
      {children}
      {vivant
        ? createPortal(
            // Un doublon pour l'œil : la photo et sa nature sont déjà dans la ligne, lues
            // par les lecteurs d'écran.
            <div ref={tirage} className="tirage" aria-hidden="true">
              <div className="tirage-carte">{tirages}</div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
