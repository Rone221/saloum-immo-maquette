"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "@/lib/base";
import { Carrousel } from "./carrousel";

export type EtapeVue = {
  titre: string;
  texte: string;
  /** Photo de la visionneuse (grande) et de la carte (carrousel), rendues côté serveur. */
  photoGrande?: ReactNode;
  photoCarte?: ReactNode;
  /** Sans photo : ce bloc remplace la photo (le titre foncier), au bureau. */
  sansPhoto?: ReactNode;
  /** Sans photo, sur la carte du carrousel : le quadrillage et la borne, sans le titre écrit juste dessous. */
  sansPhotoCarte?: ReactNode;
  /** Lien sous le texte (le titre foncier mène au foncier). */
  suite?: ReactNode;
};

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Les étapes de l'aménagement (revue 2). Au bureau : la liste à gauche, en onglets
 * verticaux ; la photo de l'étape choisie à droite, en fondu. Le survol, le clic et
 * les flèches du clavier changent d'étape. En dessous de 1 101 px : un carrousel de
 * cartes. Les deux ne sont jamais affichés ensemble (les photos de l'autre version
 * ne se chargent pas : chargement différé dans un bloc masqué).
 */
export function VisionneuseEtapes({ etapes, etiquette }: { etapes: EtapeVue[]; etiquette: string }) {
  const [actif, setActif] = useState(0);
  const onglets = useRef<(HTMLButtonElement | null)[]>([]);

  const clavier = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = etapes.length;
    const cible =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i + 1) % n
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (cible === null) return;
    e.preventDefault();
    setActif(cible);
    onglets.current[cible]?.focus();
  };

  return (
    <>
      {/* Bureau : onglets et photo. */}
      <div className="hidden desk:grid desk:grid-cols-12 desk:items-start desk:gap-x-6">
        <div role="tablist" aria-label={etiquette} aria-orientation="vertical" className="desk:col-span-5">
          {etapes.map((e, i) => {
            const choisi = i === actif;
            return (
              <button
                key={e.titre}
                ref={(el) => {
                  onglets.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`onglet-etape-${i}`}
                aria-selected={choisi}
                aria-controls="panneau-etape"
                tabIndex={choisi ? 0 : -1}
                onClick={() => setActif(i)}
                onMouseEnter={() => setActif(i)}
                onKeyDown={(ev) => clavier(ev, i)}
                className={cx(
                  "group relative grid w-full cursor-pointer grid-cols-[3.25rem_minmax(0,1fr)] border-t py-5 text-left transition-colors duration-300 last:border-b",
                  choisi ? "border-ink" : "border-rule",
                )}
              >
                {/* Le trait bleu de l'étape choisie, à gauche. */}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute top-0 bottom-0 -left-4 w-[3px] origin-top bg-trait transition-transform duration-300",
                    choisi ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cx(
                    "stretch-title text-h3 leading-snug font-bold tabular-nums transition-colors",
                    choisi ? "text-trait" : "text-sol group-hover:text-ink",
                  )}
                >
                  {num(i)}
                </span>
                <span>
                  <span className={cx("block text-h3 leading-snug font-semibold transition-colors", choisi ? "text-ink" : "text-ink-2 group-hover:text-ink")}>
                    {e.titre}
                  </span>
                  {/* Le texte de l'étape s'ouvre sous son titre (grille 0fr vers 1fr). */}
                  <span
                    className={cx(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      choisi ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-2 text-ink-2">{e.texte}</span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="panneau-etape"
          aria-labelledby={`onglet-etape-${actif}`}
          className="sticky top-[calc(var(--spacing-header)+24px)] desk:col-span-7"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
            {etapes.map((e, i) => (
              <div
                key={e.titre}
                aria-hidden={i !== actif}
                className={cx(
                  "absolute inset-0 transition-[opacity,scale] duration-700 ease-out",
                  i === actif ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                )}
              >
                {e.photoGrande ?? e.sansPhoto}
              </div>
            ))}
            {/* L'étiquette sur la photo seulement : sans photo, le titre est déjà écrit en grand. */}
            {etapes[actif].photoGrande ? (
              <p className="absolute bottom-0 left-0 z-[1] inline-flex items-center gap-3 bg-ink px-4 py-2.5 font-semibold text-white">
                <span className="text-small text-white/70 tabular-nums">{num(actif)}</span>
                {etapes[actif].titre}
              </p>
            ) : null}
          </div>
          {etapes[actif].suite ? <div className="mt-4">{etapes[actif].suite}</div> : null}
        </div>
      </div>

      {/* Mobile et tablette : les étapes en cartes, au doigt. */}
      <div className="desk:hidden">
        <Carrousel etiquette={etiquette} diapo="w-[82%] max-w-[26rem] tab:w-[44%]">
          {etapes.map((e, i) => (
            <article key={e.titre} className="flex w-full flex-col border border-rule bg-paper">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">{e.photoCarte ?? e.sansPhotoCarte ?? e.sansPhoto}</div>
              <div className="flex grow flex-col p-5">
                <p className="stretch-title text-h3 leading-none font-bold text-trait tabular-nums">{num(i)}</p>
                <h3 className="mt-2 text-h3 leading-snug font-semibold">{e.titre}</h3>
                <p className="mt-2 text-ink-2">{e.texte}</p>
                {e.suite ? <div className="mt-auto pt-3">{e.suite}</div> : null}
              </div>
            </article>
          ))}
        </Carrousel>
      </div>
    </>
  );
}
