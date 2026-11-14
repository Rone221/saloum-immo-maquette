// Comprendre le foncier (revue 2). Seule page du site qui porte les trois documents en
// entier, la liste « Avant d'acheter, vérifiez avec nous » et l'avertissement. Pas de
// photo : des cartes, l'axe du moins au plus protégé, deux vidéos d'explication.
// C'est une vérification proposée, jamais une garantie.

import type { Metadata } from "next";
import { CarteVideo } from "@/components/carte-video";
import { Documents } from "@/components/documents";
import { EnTete } from "@/components/en-tete";
import { Section } from "@/components/section";
import {
  AVANT_D_ACHETER,
  AVERTISSEMENT_STATUT,
  INTRO_FONCIER,
  SOURCE_DEFINITIONS,
  TITRE_FONCIER,
} from "@/content/foncier";
import { cx } from "@/lib/base";
import { ENTRE_BLOCS, NOTE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  "Comprendre le foncier",
  "Délibération, bail ou titre foncier : ce que dit chaque document et son niveau de sécurité, publiés par Saloum Immo. Ce que vous pouvez vérifier avec nous avant de payer.",
);

export default function Foncier() {
  return (
    <>
      {/* 1. En-tête, et l'interview du DG en carte vidéo. */}
      <Section labelledBy="t-page" rythme="ouverture">
        <div className="grid gap-y-10 desk:grid-cols-12 desk:items-center desk:gap-x-6">
          <EnTete titre={TITRE_FONCIER} chapeau={INTRO_FONCIER} className="entree desk:col-span-7" />
          {/* Sans photo, le quadrillage d'un plan : le titre est écrit sous la couverture. */}
          <CarteVideo cle="interviewDG" className="entree max-w-[26rem] [--delai:0.15s] desk:col-span-4 desk:col-start-9" />
        </div>
      </Section>

      {/* 2. Les trois documents, du moins au plus protégé. */}
      <Section labelledBy="t-documents" surface="paper-2">
        <h2 id="t-documents" className={cx(T2, "reveler")}>
          Délibération, bail, titre foncier
        </h2>
        <Documents variante="page" className={cx(ENTRE_BLOCS, "desk:mt-14")} />
        <p className={cx(NOTE, "mt-8")}>{typo(SOURCE_DEFINITIONS.texte)}</p>
      </Section>

      {/* 3. Avant d'acheter, vérifiez avec nous : la liste en cases, les trois phrases, la
          vidéo du NICAD ; puis l'avertissement, seule occurrence du site. */}
      <Section labelledBy="t-verifier">
        <div className="grid gap-y-12 desk:grid-cols-12 desk:gap-x-6">
          <div className="desk:col-span-7">
            <h2 id="t-verifier" className={cx(T2, "reveler")}>
              {typo(AVANT_D_ACHETER.titre)}
            </h2>
            <ul className={cx(ENTRE_BLOCS, "grid gap-3")}>
              {AVANT_D_ACHETER.lignes.map((l, i) => (
                <li
                  key={l.texte}
                  className={cx(
                    "group flex items-start gap-4 border border-rule p-4 transition-colors duration-300 hover:border-trait tab:px-5",
                    i % 2 === 1 ? "reveler-2" : "reveler",
                  )}
                >
                  {/* Une case de liste à cocher, comme sur un dossier. */}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-6 flex-none items-center justify-center border-[1.5px] border-ink text-small leading-none font-bold text-white transition-colors group-hover:border-trait group-hover:bg-trait"
                  >
                    ✓
                  </span>
                  <span>{typo(l.texte)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-8 desk:col-span-4 desk:col-start-9 desk:pt-20">
            <ul className="reveler flex flex-col gap-4 border-l-2 border-ink pl-5">
              {AVANT_D_ACHETER.suite.map((s) => (
                <li key={s.texte} className="text-ink-2">
                  {typo(s.texte)}
                </li>
              ))}
            </ul>
            <CarteVideo cle="nicad" className="reveler-2 max-w-[26rem]" />
          </div>
        </div>

        <p
          className="reveler mt-16 border-l-4 border-laterite bg-paper-2 px-6 py-6 text-h3 leading-snug font-semibold tab:px-8 desk:mt-24"
        >
          {typo(AVERTISSEMENT_STATUT)}
        </p>
      </Section>
    </>
  );
}
