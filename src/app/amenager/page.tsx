// Aménager mon terrain (recherche/allegement.md, partie 3) : la page des
// propriétaires et des promoteurs. Ouverture sur la coupe, les cinq étapes en
// photos, les quatre travaux datés avec leur source (#travaux), les huit services.
//
// Aucun fait daté sous une photo d'étape : une photo de lieu inconnu posée sur un
// fait daté se lirait comme sa légende. 2355 (agent SEN'EAU) n'est jamais dans la
// même section que les 58 parcelles. Un lieu n'est écrit que s'il est publié
// (Kounoune).

import type { Metadata } from "next";
import { BoutonWhatsApp } from "@/components/boutons";
import { Coupe } from "@/components/coupe";
import { Frise } from "@/components/frise";
import { Photo } from "@/components/photo";
import { Borne } from "@/components/reperes";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { VisionneuseEtapes, type EtapeVue } from "@/components/visionneuse-etapes";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { TRAVAUX } from "@/content/registre";
import { ETAPES, ETAPE_TITRE, INTRO_AMENAGER, QUESTION_PROPRIETAIRES, SERVICES } from "@/content/services";
import { cx } from "@/lib/base";
import { CHAPEAU, ENTRE_BLOCS, T1, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  "Aménager mon terrain",
  "Saloum Immo aménage les terrains qu’il vend et ceux des propriétaires : terrassement, bornage, voies en latérite, eau avec SEN’EAU, électricité. Les étapes en photos, les travaux datés, et WhatsApp pour décrire votre terrain.",
);

/** Les cinq étapes en photo, puis le titre foncier en texte. */
const etapes: EtapeVue[] = [
  ...ETAPES.map((e) => ({
    titre: typo(e.titre),
    texte: typo(e.texte),
    photoGrande: (
      <Photo id={e.photo} fill sizes="(min-width: 1440px) 790px, 55vw" className="object-cover" />
    ),
    photoCarte: <Photo id={e.photo} fill sizes="416px" className="object-cover" />,
  })),
  {
    titre: typo(ETAPE_TITRE.titre),
    texte: typo(ETAPE_TITRE.texte),
    sansPhoto: (
      <span className="quadrillage absolute inset-0 flex flex-col justify-end p-6 desk:p-10">
        <Borne className="mb-4 size-3.5" />
        <span className="stretch-title text-h1 leading-none font-bold">{typo(ETAPE_TITRE.titre)}</span>
      </span>
    ),
    // La carte du carrousel écrit le titre juste dessous : le quadrillage et la borne seuls.
    sansPhotoCarte: (
      <span aria-hidden="true" className="quadrillage absolute inset-0 flex items-end p-6">
        <Borne className="size-3.5" />
      </span>
    ),
    suite: <TextLink href="/foncier/">Comprendre le foncier</TextLink>,
  },
];

export default function Amenager() {
  return (
    <>
      {/* 1. Ouverture : le titre, la question des propriétaires, la coupe. */}
      <Section labelledBy="t-page" rythme="ouverture">
        <div className="grid gap-y-12 desk:grid-cols-12 desk:items-center desk:gap-x-6">
          <div className="desk:col-span-5">
            <h1 id="t-page" className={cx(T1, "entree")}>
              Aménager la terre
            </h1>
            <p className={cx(CHAPEAU, "entree mt-5 max-w-[30em] [--delai:0.1s] desk:mt-7")}>{typo(INTRO_AMENAGER)}</p>
            <p className="entree mt-8 font-semibold [--delai:0.2s] desk:mt-10">{typo(QUESTION_PROPRIETAIRES)}</p>
            <BoutonWhatsApp
              label={LIBELLES.proprietaire}
              message={MESSAGES.proprietaire.texte}
              className="entree mt-4 [--delai:0.25s]"
            />
          </div>
          <Coupe className="desk:col-span-7" />
        </div>
      </Section>

      {/* 2. Les étapes : la visionneuse (onglets et photo au bureau, carrousel en dessous).
          La sixième étape, le titre foncier, n'a pas de photo : un bloc de texte la remplace. */}
      <Section labelledBy="t-etapes" surface="paper-2">
        <h2 id="t-etapes" className={cx(T2, "reveler")}>
          {typo("Du débroussaillage au titre foncier")}
        </h2>
        <div className={cx(ENTRE_BLOCS, "reveler desk:mt-14")}>
          <VisionneuseEtapes etiquette="Les étapes de l’aménagement" etapes={etapes} />
        </div>
      </Section>

      {/* 3. Travaux datés : la date, le fait, sa source. Fond blanc, chiffres dans la phrase. */}
      <Section id="travaux" labelledBy="t-travaux">
        <h2 id="t-travaux" className={T2}>
          Travaux datés
        </h2>
        <Frise travaux={TRAVAUX} sources className={cx(ENTRE_BLOCS, "desk:mt-16")} />
      </Section>

      {/* 4. Les huit services, verbatim, en deux colonnes. */}
      <Section labelledBy="t-services" rythme="fin">
        <h2 id="t-services" className={T2}>
          Nos huit services
        </h2>
        <ul className={cx(ENTRE_BLOCS, "grid gap-3 tab:grid-cols-2 tab:gap-4 desk:grid-cols-4")}>
          {SERVICES.map((sv, i) => (
            <li
              key={sv}
              className={cx(
                "group flex flex-col border border-rule p-5 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-trait",
                i % 4 === 1 ? "reveler-2" : i % 4 >= 2 ? "reveler-3" : "reveler",
              )}
            >
              <span className="flex items-center gap-2.5 text-small font-semibold text-ink-2 tabular-nums">
                <Borne className="transition-colors group-hover:bg-trait" />
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-3 font-semibold leading-snug">{typo(sv)}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
