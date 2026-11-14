"use client";

import { Children, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/base";

type Etat = {
  index: number;
  /** Diapositives visibles à la fois (1 sur mobile, 2 ou 3 au-delà). */
  visibles: number;
  debut: boolean;
  fin: boolean;
  deborde: boolean;
  vue: number;
  position: number;
};

const NBSP = " ";
const num = (k: number) => String(k).padStart(2, "0");

/**
 * Carrousel (revue 2) : une piste à défilement natif (au doigt, à la molette, au
 * clavier en suivant le focus), des boutons précédent et suivant, un trait qui
 * montre où l'on est. Sans JavaScript, la piste défile quand même.
 * Pas de lecture automatique. Les boutons disparaissent quand tout tient à l'écran.
 * En bout de piste, le bouton reste focalisable (aria-disabled, pas disabled) : le
 * focus du clavier ne tombe pas sur la page.
 *
 * `bureau="grille"` : au-delà de 1 101 px, la piste devient une grille de trois
 * colonnes (les cartes de l'accueil). `bureau="wrap"` : au-delà de 1 101 px, la
 * piste reste dans la colonne du site, sans déborder dans les gouttières, et aucune
 * carte n'est coupée au bord de l'écran (6 px de marge pour le contour du focus).
 * Les contenus des diapositives sont rendus côté serveur et passés en enfants : rien
 * du contenu ne part dans ce composant.
 */
export function Carrousel({
  etiquette,
  children,
  diapo = "w-[82%] max-w-[26rem] tab:w-[44%]",
  bureau = "carrousel",
  ton = "clair",
  className,
}: {
  /** Nom du carrousel pour les lecteurs d'écran : « Terrains disponibles ». */
  etiquette: string;
  children: ReactNode;
  /** Largeur d'une diapositive, par largeur d'écran. */
  diapo?: string;
  bureau?: "carrousel" | "grille" | "wrap";
  /** Sur un fond sombre, les commandes passent en blanc. */
  ton?: "clair" | "sombre";
  className?: string;
}) {
  const piste = useRef<HTMLUListElement>(null);
  const id = useId();
  const diapos = Children.toArray(children);
  const n = diapos.length;
  const [etat, setEtat] = useState<Etat>({ index: 0, visibles: 1, debut: true, fin: false, deborde: true, vue: 1, position: 0 });

  /** Pas d'un clic : la largeur d'une diapositive et l'écart qui la suit. */
  const pas = useCallback(() => {
    const el = piste.current;
    if (!el) return 0;
    const premiere = el.firstElementChild as HTMLElement | null;
    const ecart = parseFloat(getComputedStyle(el).columnGap) || 0;
    return premiere ? premiere.getBoundingClientRect().width + ecart : el.clientWidth;
  }, []);

  const mesurer = useCallback(() => {
    const el = piste.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = pas();
    setEtat({
      index: p ? Math.min(n - 1, Math.round(el.scrollLeft / p)) : 0,
      visibles: p ? Math.max(1, Math.round(el.clientWidth / p)) : 1,
      debut: el.scrollLeft <= 2,
      fin: el.scrollLeft >= max - 2,
      deborde: max > 2,
      vue: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1,
      position: max > 0 ? el.scrollLeft / max : 0,
    });
  }, [n, pas]);

  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    mesurer();
    el.addEventListener("scroll", mesurer, { passive: true });
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", mesurer);
      ro.disconnect();
    };
  }, [mesurer]);

  const aller = (sens: 1 | -1) => {
    if ((sens === 1 && etat.fin) || (sens === -1 && etat.debut)) return;
    const el = piste.current;
    if (!el) return;
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sens * pas(), behavior: doux ? "smooth" : "auto" });
  };

  // Compteur : la diapositive visible (« 02 / 05 »), ou la plage visible quand
  // plusieurs tiennent à l'écran (« 03 à 05 / 05 »). En bout de piste, la dernière.
  const premier = etat.index + 1;
  const dernier = etat.fin ? n : Math.min(n, etat.index + etat.visibles);
  const compteur =
    etat.visibles > 1 && dernier > premier
      ? `${num(premier)}${NBSP}à${NBSP}${num(dernier)} / ${num(n)}`
      : `${num(premier)} / ${num(n)}`;

  const sombre = ton === "sombre";
  const bouton = cx(
    "inline-flex size-11 cursor-pointer items-center justify-center rounded-1 border-[1.5px] text-h3 leading-none transition-surface aria-disabled:cursor-default aria-disabled:opacity-35 tab:size-12",
    sombre
      ? "border-white/70 text-white not-aria-disabled:hover:border-white not-aria-disabled:hover:bg-white not-aria-disabled:hover:text-ink"
      : "border-ink text-ink not-aria-disabled:hover:bg-ink not-aria-disabled:hover:text-white",
  );
  const grille = bureau === "grille";

  return (
    <div role="region" aria-roledescription="carrousel" aria-label={etiquette} className={className}>
      {/* py-1.5 -my-1.5 : la place du contour de focus des cartes, que la piste rognerait. */}
      <ul
        ref={piste}
        id={id}
        className={cx(
          "piste -mx-gutter -my-1.5 gap-4 px-gutter py-1.5 tab:gap-6",
          grille && "desk:mx-0 desk:grid desk:grid-cols-3 desk:overflow-visible desk:px-0",
          bureau === "wrap" && "desk:-mx-1.5 desk:px-1.5 desk:scroll-px-1.5",
        )}
      >
        {diapos.map((d, i) => (
          <li
            key={i}
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${n}`}
            className={cx("flex flex-none snap-start", diapo, grille && "desk:w-auto desk:max-w-none")}
          >
            {d}
          </li>
        ))}
      </ul>

      {/* Commandes : le trait de progression, le compteur, les deux boutons. */}
      <div className={cx("mt-6 flex items-center gap-4 tab:mt-8", !etat.deborde && "hidden", grille && "desk:hidden")}>
        <div aria-hidden="true" className={cx("relative h-0.5 flex-1 overflow-hidden", sombre ? "bg-white/25" : "bg-rule")}>
          {/* Largeur et position en variables sans unité : le calcul est fait en CSS. */}
          <span
            className={cx(
              "absolute inset-y-0 w-[calc(var(--vue)*100%)] [left:calc(var(--pos)*(100%-var(--vue)*100%))] transition-[left] duration-200",
              sombre ? "bg-white" : "bg-trait",
            )}
            style={{ ["--vue" as string]: etat.vue.toFixed(4), ["--pos" as string]: etat.position.toFixed(4) }}
          />
        </div>
        <p
          aria-hidden="true"
          className={cx("text-small font-semibold whitespace-nowrap tabular-nums", sombre ? "text-white/80" : "text-ink-2")}
        >
          {compteur}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-controls={id}
            aria-label="Précédent"
            aria-disabled={etat.debut}
            onClick={() => aller(-1)}
            className={bouton}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-controls={id}
            aria-label="Suivant"
            aria-disabled={etat.fin}
            onClick={() => aller(1)}
            className={bouton}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
