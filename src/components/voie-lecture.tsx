"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { typo } from "@/lib/format";
import { useChemin } from "./nav-links";

/** Un carrefour : le départ d'une section, et sa place sur la voie (0 en haut, 1 en bas). */
type Carrefour = { id: string; numero: string; nom: string; s: number };

/** Les en-têtes de section (components/en-tete-section.tsx). */
const SECTIONS = "[data-voie-section]";
/**
 * Les blocs au-dessus desquels la voie passe en clair : les surfaces plan et latérite
 * (components/section.tsx), le pied, une ouverture sombre.
 */
const SOMBRES = '[data-voie="sombre"], [data-ouverture="sombre"]';
const BUREAU = "(min-width: 1101px)";
const INSECABLE = " ";

const borner = (v: number) => Math.min(1, Math.max(0, v));

/**
 * La voie de lecture (direction v4, pièce 1) : une voie en latérite vue d'en haut, qui
 * s'ouvre pendant qu'on lit. La partie lue est en aplat (12 px, bordures en tirets), le
 * reste n'est que piqueté (deux files de piquets, l'axe en trait mixte). Un carrefour
 * marque le départ de chaque section : son nom au survol, on y va au clic. En bas,
 * verticale, l'étiquette « LECTURE 54 % ». Dès 1 101 px, dans la gouttière gauche.
 * Sous 1 101 px, la même voie court à l'horizontale sur le filet de l'en-tête (3 px) :
 * la signature ne disparaît pas au téléphone.
 *
 * Jamais le mot « avancement » : il se lirait comme l'état d'un chantier.
 *
 * Le script ne fait que mesurer et écrire : --p (la part lue), le nombre de
 * l'étiquette, et deux masques qui découpent le tirage clair et le tirage sombre de
 * la voie selon le fond qui passe dessous. Pas de lissage, écoute passive, une
 * écriture par image. La feuille de style dessine tout (globals.css, « La voie de
 * lecture »). Sans script, la voie n'existe pas : elle ne mesure rien.
 *
 * Elle trouve seule les sections (data-voie-section) et les fonds sombres
 * (data-voie="sombre"). Elle se retire de l'espace client (/admin/).
 */
export function VoieLecture() {
  const chemin = useChemin();
  const racine = useRef<HTMLDivElement>(null);
  const [carrefours, setCarrefours] = useState<Carrefour[]>([]);
  const horsSite = chemin.startsWith("/admin/");

  useEffect(() => {
    const voie = racine.current;
    if (!voie) return;

    const bureau = window.matchMedia(BUREAU);
    const nombres = voie.querySelectorAll<HTMLElement>("[data-voie-nombre]");
    /** Ce qu'on peut défiler, le haut et la hauteur de la colonne, les fonds sombres (dans la page). */
    let course = 0;
    let haut = 0;
    let hauteur = 0;
    let zones: Array<[number, number]> = [];
    let image = 0;
    /** Dernières valeurs écrites : on n'écrit que ce qui change. */
    const ecrit = { p: -1, nombre: -1, masque: "" };

    /** Les deux masques, pour un défilement donné : noir là où le tirage se voit. */
    const masques = (y: number) => {
      const vues = zones
        .map(([a, b]) => [Math.round(a - y - haut), Math.round(b - y - haut)])
        .filter(([a, b]) => b > 0 && a < hauteur)
        .map(([a, b]) => [Math.max(0, a), Math.min(hauteur, b)]);
      if (!vues.length) return null;
      let clair = "linear-gradient(180deg";
      let sombre = "linear-gradient(180deg";
      let fait = 0;
      for (const [a, b] of vues) {
        clair += `, black ${fait}px ${a}px, transparent ${a}px ${b}px`;
        sombre += `, transparent ${fait}px ${a}px, black ${a}px ${b}px`;
        fait = b;
      }
      return { clair: `${clair}, black ${fait}px)`, sombre: `${sombre}, transparent ${fait}px)` };
    };

    const ecrire = () => {
      image = 0;
      const y = window.scrollY;
      const p = course > 0 ? borner(y / course) : 0;
      if (p !== ecrit.p) {
        ecrit.p = p;
        voie.style.setProperty("--p", p.toFixed(4));
      }
      const nombre = Math.round(p * 100);
      if (nombre !== ecrit.nombre) {
        ecrit.nombre = nombre;
        const texte = String(nombre).padStart(2, "0");
        nombres.forEach((n) => (n.textContent = texte));
      }
      const m = bureau.matches ? masques(y) : null;
      const cle = m ? m.clair : "";
      if (cle !== ecrit.masque) {
        ecrit.masque = cle;
        if (m) {
          voie.style.setProperty("--masque-clair", m.clair);
          voie.style.setProperty("--masque-sombre", m.sombre);
        } else {
          voie.style.removeProperty("--masque-clair");
          voie.style.removeProperty("--masque-sombre");
        }
      }
    };

    /** Tout ce qui dépend de la mise en page : à l'arrivée, puis quand la page change de taille. */
    const mesurer = () => {
      const y = window.scrollY;
      const page = document.documentElement;
      course = page.scrollHeight - window.innerHeight;
      // Une page qui tient dans l'écran n'a rien à mesurer : la voie se retire.
      voie.toggleAttribute("data-vide", course <= 0);
      voie.setAttribute("data-pret", "");
      const colonne = voie.getBoundingClientRect();
      haut = colonne.top;
      hauteur = colonne.height;
      zones = [...document.querySelectorAll<HTMLElement>(SOMBRES)]
        .map((el): [number, number] => {
          const b = el.getBoundingClientRect();
          return [b.top + y, b.bottom + y];
        })
        .sort((a, b) => a[0] - b[0]);
      // Là où l'ancre d'une section s'arrête : sous l'en-tête (scroll-padding-top).
      const marge = parseFloat(getComputedStyle(page).scrollPaddingTop) || 0;
      const liste = [...document.querySelectorAll<HTMLElement>(SECTIONS)]
        .filter((el) => el.id)
        .map((el) => ({
          id: el.id,
          numero: el.dataset.numero ?? "",
          nom: el.dataset.nom ?? "",
          s: course > 0 ? Math.round(borner((el.getBoundingClientRect().top + y - marge) / course) * 10000) / 10000 : 0,
        }));
      setCarrefours((avant) => (JSON.stringify(avant) === JSON.stringify(liste) ? avant : liste));
      ecrire();
    };

    const demander = () => {
      if (!image) image = requestAnimationFrame(ecrire);
    };

    // L'observateur mesure une première fois dès qu'il est branché.
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(document.body);
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", mesurer);
    return () => {
      observateur.disconnect();
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", mesurer);
      if (image) cancelAnimationFrame(image);
    };
  }, [chemin, horsSite]);

  if (horsSite) return null;

  return (
    <div ref={racine} className="voie">
      {/* Le dessin, tiré deux fois : pour les fonds clairs, pour les fonds sombres. */}
      {(["voie-clair", "voie-sombre"] as const).map((tirage) => (
        <div key={tirage} aria-hidden="true" className={`voie-couche ${tirage}`}>
          <span className="voie-piquete" />
          <span className="voie-faite" />
          {/* Le dessin des carrefours : une traverse piquetée, puis ouverte. */}
          {carrefours.map((c) => (
            <span key={c.id} className="voie-croix" style={{ "--s": c.s } as CSSProperties} />
          ))}
          <span className="voie-front" />
          <span className="voie-etiquette etiquette">
            {typo("Lecture")}
            {INSECABLE}
            <span data-voie-nombre="">00</span>
            {INSECABLE}%
          </span>
        </div>
      ))}
      {/* Les carrefours sont des liens : un sommaire de la page, pour le clavier et les
          lecteurs d'écran aussi. Pas de repère de navigation vide sur une page sans section. */}
      {carrefours.length ? (
        <nav aria-label="Sections de la page">
          <ol className="voie-carrefours m-0 list-none p-0">
            {carrefours.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} style={{ "--s": c.s } as CSSProperties}>
                  <span className="sr-only">{`${c.numero}, ${c.nom}`}</span>
                  <span aria-hidden="true" className="voie-nom etiquette">{`${c.numero} · ${c.nom}`}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}
