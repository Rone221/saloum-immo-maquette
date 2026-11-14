"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cx } from "@/lib/base";

export type DiapoEtape = {
  /** « Débroussaillage et terrassement » */
  titre: string;
  /** La photo, rendue côté serveur (components/photo.tsx). */
  photo: ReactNode;
};

/** Temps passé sur chaque étape, en secondes. */
const DUREE = 6;

/** Abonnement vide : `monte` passe une fois de false (serveur, hydratation) à true. */
const rien = () => () => {};

/** Focus donné au clavier (:focus-visible), pas par un appui ou un clic. */
const focusVisible = (el: EventTarget) => {
  try {
    return (el as Element).matches(":focus-visible");
  } catch {
    return false;
  }
};

/**
 * Ouverture de l'accueil (revue 2) : les étapes de l'aménagement en fondu enchaîné.
 * Le segment actif se remplit pendant DUREE secondes ; à la fin de son remplissage,
 * l'étape suivante arrive. Le minuteur est donc l'animation elle-même : la mettre en
 * pause (bouton, survol à la souris, focus au clavier) arrête tout, sans setInterval.
 * Elle ne part qu'une fois le composant hydraté : sinon, sur un réseau lent, elle
 * finirait avant que React écoute sa fin, et l'ouverture resterait figée.
 *
 * Avec prefers-reduced-motion, aucune animation : rien ne défile tout seul, les
 * segments restent cliquables, le bouton pause disparaît. Les photos suivantes ne
 * sont rendues qu'à l'approche de leur tour (la première et la deuxième au chargement).
 */
export function HeroEtapes({
  diapos,
  cadre,
  className,
}: {
  diapos: DiapoEtape[];
  /** Classes du cadre photo : proportions, hauteur, débord sur mobile. */
  cadre?: string;
  className?: string;
}) {
  const n = diapos.length;
  const [actif, setActif] = useState(0);
  const [pause, setPause] = useState(false);
  const [survol, setSurvol] = useState(false);
  const [rendues, setRendues] = useState(() => new Set([0, 1]));
  const racine = useRef<HTMLDivElement>(null);
  const monte = useSyncExternalStore(rien, () => true, () => false);

  // Tout changement d'étape passe par ici (segment, fin du remplissage). L'étape suivante
  // est rendue en même temps, pour que son fondu parte d'une photo déjà chargée.
  const aller = (i: number) => {
    setRendues((r) => new Set([...r, i, (i + 1) % n]));
    setActif(i);
  };
  const enLecture = !pause && !survol;
  const etape = diapos[actif];

  return (
    <div
      ref={racine}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Nos étapes d’aménagement, en photos"
      // La souris seulement : sur un écran tactile, un appui n'est pas un survol.
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setSurvol(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setSurvol(false);
      }}
      onFocus={(e) => {
        if (focusVisible(e.target)) setSurvol(true);
      }}
      onBlur={(e) => {
        if (!racine.current?.contains(e.relatedTarget as Node)) setSurvol(false);
      }}
      className={className}
    >
      <div className={cx("relative isolate overflow-hidden bg-paper-2", cadre)}>
        {diapos.map((d, i) => (
          <div
            key={d.titre}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${n} : ${d.titre}`}
            aria-hidden={i !== actif}
            className={cx(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              i === actif ? "z-[1] opacity-100" : "opacity-0",
            )}
          >
            {/* La photo active avance doucement ; la clé relance l'effet à chaque tour. */}
            <div key={i === actif ? `actif-${actif}` : "repos"} className={cx("absolute inset-0", i === actif && "zoom-lent")}>
              {rendues.has(i) ? d.photo : null}
            </div>
          </div>
        ))}

        {/* Bandeau du bas : numéro et nom de l'étape, bouton pause. */}
        <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 p-3 tab:p-4">
          <p className="inline-flex max-w-[calc(100%-3.5rem)] items-center gap-3 bg-ink px-3 py-2 text-small leading-snug font-semibold text-white tab:px-3.5 tab:py-2.5 tab:text-body">
            <span className="text-small whitespace-nowrap text-white/70 tabular-nums">
              {String(actif + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <span key={actif}>{etape.titre}</span>
          </p>
          {/* Bouton bascule : un nom fixe, l'état dans aria-pressed. */}
          <button
            type="button"
            onClick={() => setPause((p) => !p)}
            aria-label="Pause du défilement des étapes"
            aria-pressed={pause}
            className="inline-flex size-11 flex-none cursor-pointer items-center justify-center bg-paper text-ink transition-surface hover:bg-ink hover:text-white motion-reduce:hidden"
          >
            <span aria-hidden="true" className="text-small leading-none font-bold">
              {pause ? "▶" : "❚❚"}
            </span>
          </button>
        </div>
      </div>

      {/* Segments : un par étape, cliquables, sous la photo. Le segment actif se remplit. */}
      <div className="mt-3 flex gap-1.5 tab:mt-4">
        {diapos.map((d, i) => (
          <button
            key={d.titre}
            type="button"
            onClick={() => aller(i)}
            aria-label={`Étape ${i + 1} : ${d.titre}`}
            aria-current={i === actif ? "step" : undefined}
            className="group/seg flex h-8 flex-1 cursor-pointer flex-col justify-center gap-1.5 text-left"
          >
            <span className="relative block h-[3px] w-full overflow-hidden bg-rule transition-[height] duration-200 group-hover/seg:h-[5px]">
              {i < actif ? <span className="absolute inset-0 bg-ink" /> : null}
              {i === actif ? (
                <span
                  key={`fil-${actif}`}
                  className="remplissage absolute inset-0 bg-trait"
                  style={{
                    ["--duree" as string]: `${DUREE}s`,
                    ["--lecture" as string]: monte && enLecture ? "running" : "paused",
                  }}
                  onAnimationEnd={() => aller((actif + 1) % n)}
                />
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
