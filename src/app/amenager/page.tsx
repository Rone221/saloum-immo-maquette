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
import { Photo } from "@/components/photo";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { TRAVAUX } from "@/content/registre";
import { ETAPES, ETAPE_TITRE, INTRO_AMENAGER, QUESTION_PROPRIETAIRES, SERVICES } from "@/content/services";
import { cx } from "@/lib/base";
import { CHAPEAU, ENTRE_BLOCS, T1, T2, T3 } from "@/lib/classes";
import { moisEnLettres, typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  "Aménager mon terrain",
  "Saloum Immo aménage les terrains qu’il vend et ceux des propriétaires : terrassement, bornage, voies en latérite, eau avec SEN’EAU, électricité. Les étapes en photos, les travaux datés, et WhatsApp pour décrire votre terrain.",
);

export default function Amenager() {
  return (
    <>
      {/* 1. Ouverture : le titre, la question des propriétaires, la coupe. */}
      <Section labelledBy="t-page" rythme="ouverture">
        <div className="grid gap-y-12 desk:grid-cols-12 desk:items-center desk:gap-x-6">
          <div className="desk:col-span-5">
            <h1 id="t-page" className={T1}>
              Aménager la terre
            </h1>
            <p className={cx(CHAPEAU, "mt-5 max-w-[30em] desk:mt-7")}>{typo(INTRO_AMENAGER)}</p>
            <p className="mt-8 font-semibold desk:mt-10">{typo(QUESTION_PROPRIETAIRES)}</p>
            <BoutonWhatsApp label={LIBELLES.proprietaire} message={MESSAGES.proprietaire.texte} className="mt-4" />
          </div>
          <Coupe className="desk:col-span-7" />
        </div>
      </Section>

      {/* 2. Les étapes : cinq photos (bord à bord sur mobile), la sixième case en texte. */}
      <Section labelledBy="t-etapes" surface="paper-2">
        <h2 id="t-etapes" className={T2}>
          {typo("Du débroussaillage au titre foncier")}
        </h2>
        <ol className={cx(ENTRE_BLOCS, "grid gap-y-12 tab:grid-cols-2 tab:gap-x-6 desk:grid-cols-3 desk:gap-y-16")}>
          {ETAPES.map((e) => (
            <li key={e.titre}>
              <span className="relative -mx-gutter block aspect-[4/3] overflow-hidden bg-paper tab:mx-0">
                <Photo
                  id={e.photo}
                  fill
                  sizes="(min-width: 1440px) 437px, (min-width: 1101px) 31vw, (min-width: 761px) 47vw, 100vw"
                  className="object-cover"
                />
              </span>
              <h3 className={cx(T3, "mt-5")}>{typo(e.titre)}</h3>
              <p className="mt-2 text-ink-2">{typo(e.texte)}</p>
            </li>
          ))}
          {/* Sans photo : une cale de la hauteur d'une photo (dès 761 px) aligne son
              titre sur ceux de la rangée. */}
          <li>
            <span aria-hidden="true" className="hidden aspect-[4/3] tab:block" />
            <h3 className={cx(T3, "tab:mt-5")}>{typo(ETAPE_TITRE.titre)}</h3>
            <p className="mt-2 text-ink-2">{typo(ETAPE_TITRE.texte)}</p>
            <p className="mt-2">
              <TextLink href="/foncier/">Comprendre le foncier</TextLink>
            </p>
          </li>
        </ol>
      </Section>

      {/* 3. Travaux datés : la date, le fait, sa source. Fond blanc, chiffres dans la phrase. */}
      <Section id="travaux" labelledBy="t-travaux">
        <h2 id="t-travaux" className={T2}>
          Travaux datés
        </h2>
        <ul className={cx(ENTRE_BLOCS, "divide-y divide-rule tabular-nums")}>
          {TRAVAUX.map((t) => (
            <li
              key={t.id}
              className="grid gap-y-1 py-5 first:pt-0 last:pb-0 tab:grid-cols-12 tab:items-baseline tab:gap-x-6 desk:py-6"
            >
              <span className="font-semibold tab:col-span-3 desk:col-span-2">{moisEnLettres(t.mois)}</span>
              <span className="tab:col-span-9 desk:col-span-6">{typo(t.texte.texte)}</span>
              {/* Sources : 44 px de haut chacune, côte à côte quand il y en a deux. */}
              <span className="flex flex-wrap gap-x-5 text-small text-ink-2 tab:col-span-9 tab:col-start-4 desk:col-span-4 desk:col-start-9">
                {t.sources.map((s) =>
                  s.href ? (
                    <a
                      key={s.libelle}
                      href={s.href}
                      className="inline-flex min-h-11 items-center text-trait underline decoration-1 underline-offset-4 hover:decoration-2"
                    >
                      {typo(s.libelle)}
                    </a>
                  ) : (
                    <span key={s.libelle} className="inline-flex min-h-11 items-center">
                      {typo(s.libelle)}
                    </span>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. Les huit services, verbatim, en deux colonnes. */}
      <Section labelledBy="t-services" rythme="fin">
        <h2 id="t-services" className={T2}>
          Nos huit services
        </h2>
        <ul className={cx(ENTRE_BLOCS, "grid gap-y-3 tab:grid-flow-col tab:grid-cols-2 tab:grid-rows-4 tab:gap-x-6 desk:gap-y-4")}>
          {SERVICES.map((s) => (
            <li key={s} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6em] size-1.5 flex-none bg-laterite" />
              {typo(s)}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
