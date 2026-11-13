// Accueil (recherche/allegement.md, partie 3). Cinq sections, une ligne par sujet :
// l'accueil résume, chaque détail vit sur sa page. Aucun lien sortant hors WhatsApp
// et téléphone. Pas de numéro de téléphone dans les sections : le pied le donne.

import { Bouton, BoutonWhatsApp } from "@/components/boutons";
import { CarteProgramme } from "@/components/carte-programme";
import { Cadre, Photo } from "@/components/photo";
import { Section } from "@/components/section";
import { InlineLink, TextLink } from "@/components/text-link";
import { DOCUMENTS, NOTAIRE, SOURCE_NIVEAUX, TITRE_FONCIER } from "@/content/foncier";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { TRAVAUX } from "@/content/registre";
import { DIASPORA, PHRASE_AMENAGER_ACCUEIL, QUESTION_PROPRIETAIRES } from "@/content/services";
import { FONDATEUR } from "@/content/site";
import { cx } from "@/lib/base";
import { CHAPEAU, COLONNE, ENTRE_BLOCS, NOTE, SOUS_TITRE, T1, T2, T3 } from "@/lib/classes";
import { moisEnLettres, typo } from "@/lib/format";

/** Tableau court : un filet fin entre les lignes, et nulle part ailleurs (2.6). */
const TABLEAU = "divide-y divide-rule";
const LIGNE = "grid items-baseline gap-x-6 py-3.5 first:pt-0 last:pb-0";

export default function Accueil() {
  const aibd = RECASEMENT_AIBD.accueil.texte;
  return (
    <>
      {/* 1. Ouverture : le titre, deux boutons, la chargeuse de 2493. */}
      <section aria-labelledby="t-hero" className="pb-18 tab:pb-24 desk:py-14">
        <div className="wrap grid desk:grid-cols-12 desk:items-center desk:gap-x-6">
          <div className="relative -mx-gutter aspect-[3/2] overflow-hidden bg-paper-2 tab:aspect-[2/1] desk:col-[7/span_6] desk:row-start-1 desk:mx-0 desk:aspect-auto desk:h-[clamp(560px,calc(100svh-var(--spacing-header)-112px),720px)]">
            <Photo
              id="2493"
              fill
              preload
              sizes="(min-width: 1440px) 668px, (min-width: 1101px) 47vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="pt-8 tab:pt-12 desk:col-[1/span_6] desk:row-start-1 desk:pt-0 desk:pr-6">
            <h1 id="t-hero" className={T1}>
              {typo("Nous vendons des terrains. Et nous les aménageons nous-mêmes.")}
            </h1>
            <p className={cx(CHAPEAU, "mt-5 max-w-[30em] desk:mt-7")}>
              {typo(
                "Terrassement, voies en latérite, eau avec SEN’EAU, électricité, bornage. Sur les terrains que nous vendons autour de Dakar, et sur ceux des propriétaires.",
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 tab:flex-row tab:flex-wrap desk:mt-10">
              <Bouton href="#terrains">Acheter un terrain</Bouton>
              <Bouton href="#amenager" variante="contour">
                Faire aménager mon terrain
              </Bouton>
            </div>
            <p className="mt-6 text-ink-2">
              {typo("Vous vivez à l’étranger : ")}
              <InlineLink href="/diaspora/">achetez à distance, pas à pas</InlineLink>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Terrains disponibles : trois cartes, puis l'offre AIBD en une ligne. */}
      <Section id="terrains" labelledBy="t-terrains" surface="paper-2">
        <h2 id="t-terrains" className={T2}>
          Terrains disponibles
        </h2>
        <p className={cx(SOUS_TITRE, "text-ink-2")}>
          {typo("Trois programmes en vente autour de Dakar. Prix sur demande, par WhatsApp.")}
        </p>
        <div className={cx(ENTRE_BLOCS, "grid gap-y-14 tab:gap-y-12 desk:grid-cols-3 desk:gap-x-6")}>
          {PROGRAMMES.map((p) => (
            <CarteProgramme key={p.slug} programme={p} />
          ))}
        </div>
        <p className="mt-14 max-w-[46rem] desk:mt-16">
          <InlineLink href={RECASEMENT_AIBD.href}>{RECASEMENT_AIBD.nom}</InlineLink>
          {typo(aibd.slice(RECASEMENT_AIBD.nom.length))}
        </p>
      </Section>

      {/* 3. Aménager la terre : 2542 en grand, les quatre travaux datés, la question. */}
      <Section id="amenager" labelledBy="t-amenager">
        <div className="grid gap-y-8 tab:grid-cols-12 tab:items-start tab:gap-x-6">
          <Cadre
            id="2542"
            legende
            bord
            sizes="(min-width: 1440px) 668px, (min-width: 761px) 47vw, 100vw"
            className="tab:col-span-6"
          />
          <div className="tab:col-span-6 desk:col-[8/span_5]">
            <h2 id="t-amenager" className={T2}>
              Aménager la terre
            </h2>
            <p className={cx(SOUS_TITRE, "text-ink-2")}>{typo(PHRASE_AMENAGER_ACCUEIL)}</p>
            <ul className={cx(TABLEAU, "mt-8 tabular-nums desk:mt-10")}>
              {TRAVAUX.map((t) => (
                <li key={t.id} className={cx(LIGNE, "gap-y-0.5 desk:grid-cols-[9rem_minmax(0,1fr)]")}>
                  <span className="font-semibold">{moisEnLettres(t.mois)}</span>
                  <span>{typo(t.texte.texte)}</span>
                </li>
              ))}
            </ul>
            <h3 className={cx(T3, "mt-12")}>{typo(QUESTION_PROPRIETAIRES)}</h3>
            <BoutonWhatsApp label={LIBELLES.proprietaire} message={MESSAGES.proprietaire.texte} className="mt-5" />
            <p className="mt-3">
              <TextLink href="/amenager/">Tout sur l’aménagement</TextLink>
            </p>
          </div>
        </div>
      </Section>

      {/* 4. Le bon papier avant le bon prix : trois niveaux, le notaire ; la diaspora. */}
      <Section id="foncier" labelledBy="t-foncier" surface="paper-2">
        <h2 id="t-foncier" className={T2}>
          {typo(TITRE_FONCIER)}
        </h2>
        <div className={cx(ENTRE_BLOCS, "grid gap-y-14 tab:grid-cols-12 tab:gap-x-6")}>
          <div className="tab:col-span-7 desk:col-span-6">
            <ul className={cx(TABLEAU, "max-w-[34rem]")}>
              {DOCUMENTS.map((d) => (
                <li key={d.cle} className={cx(LIGNE, "grid-cols-[8.5rem_minmax(0,1fr)] tab:grid-cols-[10rem_minmax(0,1fr)]")}>
                  <span className="font-semibold">{d.nom}</span>
                  <span>{typo(`${d.niveau.texte}.`)}</span>
                </li>
              ))}
            </ul>
            <p className={cx(NOTE, "mt-4")}>{typo(SOURCE_NIVEAUX.texte)}</p>
            <p className="mt-8">{typo(NOTAIRE.texte)}</p>
            <p className="mt-2">
              <TextLink href="/foncier/">Comprendre le foncier</TextLink>
            </p>
          </div>
          <div className="tab:col-span-5 desk:col-[8/span_5]">
            <h3 className={T3}>{typo("Vous vivez à l’étranger ?")}</h3>
            <p className="mt-3 text-ink-2">{typo(DIASPORA.accueil)}</p>
            <p className="mt-2">
              <TextLink href="/diaspora/">Acheter depuis l’étranger</TextLink>
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Babacar Ndiaye, et l'agence. Le texte d'abord, en une colonne ; puis les
          deux photos côte à côte, même cadre 4:3, même hauteur (668 × 501 au bureau).
          Pas de numéro ici : le pied suit. */}
      <Section id="fondateur" labelledBy="t-fondateur">
        <div className={COLONNE}>
          <h2 id="t-fondateur" className={T2}>
            {FONDATEUR.nom.texte}
          </h2>
          <p className={cx(SOUS_TITRE, "font-semibold")}>{typo(FONDATEUR.roleCourt.texte)}</p>
          <p className="mt-2 text-ink-2">{typo(FONDATEUR.enVideo.texte)}</p>
          <p className="mt-2">
            <TextLink href="/a-propos/">Son parcours</TextLink>
          </p>
        </div>
        <div className={cx(ENTRE_BLOCS, "grid gap-y-10 tab:grid-cols-2 tab:gap-x-6")}>
          {/* Capture de 899 px dans un cadre 4:3 : dessinée par sa hauteur, 674 px de
              cadre au plus pour ne jamais l'agrandir. */}
          <Cadre
            id={FONDATEUR.photo}
            legende
            bord
            sizes="(min-width: 1101px) 890px, (min-width: 761px) 63vw, 133vw"
          />
          <figure className="m-0 -mx-gutter tab:mx-0">
            <span className="relative block aspect-[4/3] overflow-hidden bg-paper-2">
              <Photo
                id="2352-haut"
                fill
                sizes="(min-width: 1440px) 832px, (min-width: 761px) 62vw, 133vw"
                className="object-cover"
              />
            </span>
            <figcaption className={cx(NOTE, "mt-3 px-gutter tab:px-0")}>
              {typo("L’agence, à Sicap Keur Massar. Sur rendez-vous.")}
            </figcaption>
          </figure>
        </div>
      </Section>
    </>
  );
}
