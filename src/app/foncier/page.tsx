// Comprendre le foncier (recherche/allegement.md, partie 3). Seule page du site
// qui porte les trois documents, la liste « Avant d'acheter, vérifiez avec nous »
// et l'avertissement. Pas de photo : une page courte, typographique.
// C'est une vérification proposée, jamais une garantie.

import type { Metadata } from "next";
import { EnTete } from "@/components/en-tete";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import {
  AVANT_D_ACHETER,
  AVERTISSEMENT_STATUT,
  DOCUMENTS,
  INTRO_FONCIER,
  SOURCE_DEFINITIONS,
  TITRE_FONCIER,
} from "@/content/foncier";
import { VIDEOS, titreVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { COLONNE, ENTRE_BLOCS, NOTE, SOUS_TITRE, T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  "Comprendre le foncier",
  "Délibération, bail ou titre foncier : ce que dit chaque document et son niveau de sécurité, publiés par Saloum Immo. Ce que vous pouvez vérifier avec nous avant de payer.",
);

export default function Foncier() {
  return (
    <>
      {/* 1. En-tête, et l'interview du DG en lien. */}
      <Section labelledBy="t-page" rythme="ouverture">
        <EnTete titre={TITRE_FONCIER} chapeau={INTRO_FONCIER}>
          <p className="mt-4">
            <TextLink href={VIDEOS.interviewDG.href}>
              {`${VIDEOS.interviewDG.titre}, en vidéo (${VIDEOS.interviewDG.duree})`}
            </TextLink>
          </p>
        </EnTete>
      </Section>

      {/* 2. Les trois documents : trois colonnes au bureau, empilés sur mobile. */}
      <Section labelledBy="t-documents" surface="paper-2">
        <h2 id="t-documents" className={T2}>
          Délibération, bail, titre foncier
        </h2>
        <div className={cx(ENTRE_BLOCS, "grid gap-y-12 desk:grid-cols-3 desk:gap-x-12")}>
          {DOCUMENTS.map((d) => (
            <section key={d.cle} aria-labelledby={`t-${d.cle}`}>
              <h3 id={`t-${d.cle}`} className={T3}>
                {d.nom}
              </h3>
              <p className="mt-3">{typo(d.definition.texte)}</p>
              <p className="mt-3 text-ink-2">{typo(d.aSavoir.texte)}</p>
              <p className="mt-4 font-semibold">{typo(`Niveau de sécurité : ${d.niveau.texte.toLowerCase()}.`)}</p>
              <p className="mt-1 text-ink-2">{typo(`Chez Saloum Immo : ${d.chezNous.texte}`)}</p>
            </section>
          ))}
        </div>
        <p className={cx(NOTE, "mt-10 desk:mt-12")}>{typo(SOURCE_DEFINITIONS.texte)}</p>
      </Section>

      {/* 3. Avant d'acheter, vérifiez avec nous : une colonne, la liste, trois phrases,
          puis l'avertissement en gras, sans barre ni cadre (seule occurrence du site). */}
      <Section labelledBy="t-verifier">
        <div className={COLONNE}>
          <h2 id="t-verifier" className={T2}>
            {typo(AVANT_D_ACHETER.titre)}
          </h2>
          <ul className={cx(SOUS_TITRE, "flex flex-col gap-3")}>
            {AVANT_D_ACHETER.lignes.map((l) => (
              <li key={l.texte} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 flex-none bg-borne" />
                {typo(l.texte)}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-ink-2">{typo(AVANT_D_ACHETER.suite.map((s) => s.texte).join(" "))}</p>
          <p className="mt-2">
            <TextLink href={VIDEOS.nicad.href}>{titreVideo("nicad")}</TextLink>
          </p>
          <p className={cx(ENTRE_BLOCS, "text-h3 leading-snug font-semibold")}>{typo(AVERTISSEMENT_STATUT)}</p>
        </div>
      </Section>
    </>
  );
}
