"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Deux colonnes : les étapes à gauche, la coupe collée à droite (methode.css). */
const BUREAU = "(min-width: 1101px)";
const CALME = "(prefers-reduced-motion: reduce)";
/**
 * En une colonne, la coupe se colle sous l'en-tête et prend 38 % de l'écran. Sur un
 * écran trop bas (téléphone couché), il ne resterait rien pour lire dessous : la coupe
 * reste alors entière, dans le fil de la page.
 */
const ASSEZ_HAUT = "(min-height: 35rem)";

/** Au bureau, l'étape lue est celle dont le haut a passé cette part de la hauteur de l'écran. */
const LIGNE_BUREAU = 0.45;
/** En une colonne : cette part de ce qui reste d'écran sous la coupe collée. */
const LIGNE_COLONNE = 0.25;
/** Le trait de terrain, dans la hauteur du dessin (components/coupe.tsx : 300 sur 464). */
const SOL = 300 / 464;
/** La coupe commence à se construire quand son sol est entré de tant dans l'écran. */
const SOL_ENTRE = 80;

/**
 * La planche de la méthode, côté écoute (direction v4, pièce 9) : la coupe se construit
 * avec l'étape lue. Le contenu (les étapes, la coupe, son cartouche) est rendu côté
 * serveur et passé en enfants : le HTML livre la coupe entière et toutes les étapes.
 *
 * Le script ne fait que mesurer et écrire, une fois par image, et seulement ce qui
 * change :
 * - data-vivante sur la planche et sur la coupe : la feuille de style colle alors la
 *   coupe sous l'en-tête en une colonne, et arme ses transitions ;
 * - --methode-figure sur la planche, la hauteur de la figure : au bureau, la feuille de
 *   style s'en sert pour centrer la coupe collée dans la hauteur de l'écran (une mesure,
 *   pas un mouvement : écrite aussi en mouvement réduit) ;
 * - data-etape sur la planche : 0 tant que le sol de la coupe n'est pas à l'écran, puis
 *   le rang de l'étape lue ;
 * - data-posee sur chaque pièce de la coupe dont l'étape est lue (data-couche),
 *   data-active sur celles de l'étape en cours, et data-entiere sur la coupe quand
 *   l'étape en cours n'y pose plus rien (le papier) ;
 * - data-courante sur l'étape en cours, dans la liste ;
 * - le nom de l'étape en cours dans le cartouche ([data-methode-nom]), et data-pair
 *   un coup sur deux : la feuille de style y rejoue un fondu.
 * La feuille de style fait le mouvement (coupe.css, methode.css).
 *
 * Deux garanties : la coupe reste collée tant que
 * la liste défile (c'est la liste qui fait la hauteur de la planche), et la dernière
 * étape s'allume au plus tard quand la coupe va se décoller, jamais derrière l'en-tête.
 *
 * Rien en mouvement réduit, rien sans script : la coupe est entière, les étapes sont
 * toutes lisibles, aucune n'est « en cours ».
 */
export function MethodeEtapes({ className, children }: { className?: string; children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const planche = racine.current;
    const figure = planche?.querySelector<HTMLElement>(".coupe");
    const dessin = planche?.querySelector<HTMLElement>(".coupe-dessin");
    if (!planche || !figure || !dessin) return;

    const etapes = [...planche.querySelectorAll<HTMLElement>("[data-methode-etape]")];
    const pieces = [...planche.querySelectorAll<HTMLElement | SVGElement>("[data-couche]")];
    const nom = planche.querySelector<HTMLElement>("[data-methode-nom]");
    const nomAuRepos = nom?.textContent ?? "";
    if (!etapes.length) return;
    /** La dernière étape qui pose quelque chose sur la coupe : au-delà, elle est entière. */
    const derniereCouche = Math.max(0, ...pieces.map((piece) => Number(piece.dataset.couche)));

    const bureau = window.matchMedia(BUREAU);
    const calme = window.matchMedia(CALME);
    const assezHaut = window.matchMedia(ASSEZ_HAUT);

    let vivante = false;
    let image = 0;
    /** Le haut de chaque étape, depuis le haut de la planche. */
    let debuts: number[] = [];
    let hauteurPlanche = 0;
    let hauteurFigure = 0;
    /** Là où la coupe se colle, depuis le haut de l'écran. */
    let colle = 0;
    /** Du haut de la figure à son trait de terrain. */
    let sol = 0;
    /** Dernières valeurs écrites : on n'écrit que ce qui change. */
    const ecrit = { etape: -1, courante: -1 };

    const ecrire = () => {
      image = 0;
      if (!vivante) return;
      const haut = planche.getBoundingClientRect().top;
      const ecran = window.innerHeight;
      const basFigure = colle + hauteurFigure;
      const ligne = bureau.matches ? ecran * LIGNE_BUREAU : basFigure + (ecran - basFigure) * LIGNE_COLONNE;

      let lues = 0;
      for (const debut of debuts) if (haut + debut <= ligne) lues += 1;
      // La coupe va se décoller (le bas de la planche arrive à son pied) : tout est lu.
      if (haut + hauteurPlanche <= basFigure + 1) lues = etapes.length;
      const courante = Math.max(1, lues);
      // Avant de se coller, la figure est en haut de la planche.
      const vue = Math.max(colle, haut) + sol + SOL_ENTRE <= ecran;
      const etape = vue ? courante : 0;

      if (etape !== ecrit.etape) {
        ecrit.etape = etape;
        planche.dataset.etape = String(etape);
        for (const piece of pieces) piece.toggleAttribute("data-posee", Number(piece.dataset.couche) <= etape);
      }
      if (courante !== ecrit.courante) {
        ecrit.courante = courante;
        etapes.forEach((e, i) => e.toggleAttribute("data-courante", i + 1 === courante));
        for (const piece of pieces) piece.toggleAttribute("data-active", Number(piece.dataset.couche) === courante);
        figure.toggleAttribute("data-entiere", courante > derniereCouche);
        if (nom) {
          nom.textContent = etapes[courante - 1].dataset.nom ?? "";
          nom.toggleAttribute("data-pair");
        }
      }
    };

    const demander = () => {
      if (!image) image = requestAnimationFrame(ecrire);
    };

    /** Ce qui dépend de la mise en page : à l'allumage, puis quand la planche change de taille. */
    const mesurer = () => {
      const p = planche.getBoundingClientRect();
      debuts = etapes.map((e) => e.getBoundingClientRect().top - p.top);
      hauteurPlanche = p.height;
      hauteurFigure = figure.offsetHeight;
      colle = parseFloat(getComputedStyle(figure).top) || 0;
      sol = dessin.getBoundingClientRect().top - figure.getBoundingClientRect().top + dessin.offsetHeight * SOL;
    };

    const eteindre = () => {
      vivante = false;
      planche.removeAttribute("data-vivante");
      planche.removeAttribute("data-etape");
      figure.removeAttribute("data-vivante");
      figure.removeAttribute("data-entiere");
      for (const piece of pieces) {
        piece.removeAttribute("data-posee");
        piece.removeAttribute("data-active");
      }
      for (const e of etapes) e.removeAttribute("data-courante");
      if (nom) {
        nom.textContent = nomAuRepos;
        nom.removeAttribute("data-pair");
      }
      ecrit.etape = -1;
      ecrit.courante = -1;
    };

    /** Allume ou éteint selon l'écran, puis remesure. À l'arrivée et à chaque changement de taille. */
    const regler = () => {
      // Au bureau, la feuille de style centre la coupe collée dans la hauteur de l'écran :
      // il lui faut la hauteur de la figure. Ce n'est pas un mouvement : écrit même au calme.
      planche.style.setProperty("--methode-figure", `${figure.offsetHeight}px`);
      const veut = !calme.matches && (bureau.matches || assezHaut.matches);
      if (!veut) {
        if (vivante) eteindre();
        return;
      }
      if (!vivante) {
        vivante = true;
        planche.setAttribute("data-vivante", "");
        figure.setAttribute("data-vivante", "");
      }
      mesurer();
      // Tout de suite, sans attendre l'image suivante : les pièces déjà lues ne
      // disparaissent pas le temps d'une image.
      ecrire();
    };

    regler();
    // La planche change de hauteur (polices, photos, largeur) : on remesure.
    const observateur = new ResizeObserver(regler);
    observateur.observe(planche);
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", regler);
    calme.addEventListener("change", regler);
    return () => {
      observateur.disconnect();
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", regler);
      calme.removeEventListener("change", regler);
      if (image) cancelAnimationFrame(image);
      eteindre();
      planche.style.removeProperty("--methode-figure");
    };
  }, []);

  return (
    <div ref={racine} className={className}>
      {children}
    </div>
  );
}
