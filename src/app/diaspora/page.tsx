// Diaspora (recherche/allegement.md, partie 3) : acheter depuis l'étranger.
// Ouverture avec la collaboratrice en grand, quatre étapes, trois vidéos, une
// ligne sur les programmes. Les listes du foncier vivent sur la page Foncier.
//
// Ne jamais écrire « EXCLUSIF DIASPORA ». Ne rien promettre qui n'est pas publié :
// ni paiement à distance, ni échéancier, ni procuration, ni visite vidéo en direct.
// Personne n'est nommé. Le notaire est un accompagnement, pas une garantie.

import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { BoutonWhatsApp } from "@/components/boutons";
import { Carrousel } from "@/components/carrousel";
import { CarteVideo } from "@/components/carte-video";
import { Cadre } from "@/components/photo";
import { Fleche } from "@/components/reperes";
import { Section } from "@/components/section";
import { Lien, TextLink } from "@/components/text-link";
import { VignetteTerrain } from "@/components/vignette-terrain";
import { NOTAIRE } from "@/content/foncier";
import { LIBELLES } from "@/content/messages";
import { PROGRAMMES } from "@/content/programmes";
import { DIASPORA, PARCOURS_DIASPORA } from "@/content/services";
import { MOBILE } from "@/content/site";
import { A_REGARDER, CHAINE_YOUTUBE } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, ENTRE_BLOCS, T1, T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import { waHref } from "@/lib/whatsapp";

export const metadata: Metadata = metaPage(
  DIASPORA.titre,
  "Vous vivez hors du Sénégal : écrivez à Saloum Immo sur WhatsApp, regardez les terrains en vidéo, vérifiez les documents avec nous, visitez sur place sur rendez-vous.",
);

const LIEN = "font-semibold text-trait underline decoration-1 underline-offset-4 hover:decoration-2";

/**
 * Le texte d'une étape : {whatsapp} devient un lien vers WhatsApp, avec le numéro ;
 * {appel:texte} un lien tel: vers le même numéro.
 */
function rendre(texte: string): ReactNode {
  return texte.split(/(\{whatsapp\}|\{appel:[^}]+\})/).map((m, i) => {
    if (m === "{whatsapp}") {
      return (
        <a key={i} href={waHref()} className={LIEN}>
          {typo(`WhatsApp au ${MOBILE.long}`)}
        </a>
      );
    }
    if (m.startsWith("{appel:")) {
      return (
        <a key={i} href={MOBILE.href} className={LIEN}>
          {typo(m.slice(7, -1))}
        </a>
      );
    }
    return <Fragment key={i}>{typo(m)}</Fragment>;
  });
}

export default function Diaspora() {
  return (
    <>
      {/* 1. Ouverture : le titre, WhatsApp, le notaire ; la collaboratrice en grand. */}
      <Section labelledBy="t-page" rythme="ouverture">
        <div className="grid gap-y-10 tab:grid-cols-12 tab:items-center tab:gap-x-6">
          <div className="tab:col-span-6">
            <h1 id="t-page" className={cx(T1, "entree")}>
              {typo(DIASPORA.titre)}
            </h1>
            <p className={cx(CHAPEAU, "entree mt-5 max-w-[30em] [--delai:0.1s] desk:mt-7")}>{typo(DIASPORA.chapeau)}</p>
            <BoutonWhatsApp
              label={LIBELLES.diaspora}
              message={DIASPORA.message}
              className="entree mt-8 [--delai:0.2s] desk:mt-10"
            />
            <p className="entree mt-4 text-ink-2 [--delai:0.25s]">{typo(NOTAIRE.texte)}</p>
          </div>
          {/* Capture de 899 px dans un cadre 4:3 : dessinée par sa hauteur, 668 px de
              cadre au plus (890 px dessinés) pour ne jamais l'agrandir. */}
          <Cadre
            id={DIASPORA.photo}
            preload
            legende
            sizes="(min-width: 1440px) 890px, (min-width: 761px) 63vw, (min-width: 669px) 890px, 133vw"
            bord
            className="entree max-w-[668px] [--delai:0.15s] tab:col-span-6 tab:col-start-7"
          />
        </div>
      </Section>

      {/* 2. Quatre étapes : quatre cartes en ligne au bureau, reliées par un trait qui se
          trace au défilement. Le texte complet, avec ses liens. */}
      <Section labelledBy="t-etapes" surface="paper-2">
        <h2 id="t-etapes" className={cx(T2, "reveler")}>
          Quatre étapes
        </h2>
        <ol className={cx(ENTRE_BLOCS, "relative grid gap-4 tab:grid-cols-2 tab:gap-6 desk:mt-14 desk:grid-cols-4")}>
          <span aria-hidden="true" className="trace-x absolute top-0 right-0 left-0 hidden h-[3px] bg-trait desk:block" />
          {PARCOURS_DIASPORA.map((s, i) => (
            <li
              key={s.titre}
              className={cx(
                "group relative flex flex-col border border-rule bg-paper p-6 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-trait desk:mt-6",
                i === 1 ? "reveler-2" : i >= 2 ? "reveler-3" : "reveler",
              )}
            >
              <span
                aria-hidden="true"
                className="stretch-title text-h1 leading-none font-bold text-sol tabular-nums transition-colors duration-300 group-hover:text-trait"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-h3 leading-snug font-semibold">{typo(s.titre)}</h3>
              <p className="mt-2 text-ink-2">{rendre(s.texte)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 3. À regarder avant d'appeler : trois vidéos en cartes (carrousel sous 1 101 px),
          le lien vers la chaîne ; puis les programmes en vignettes et le foncier. */}
      <Section labelledBy="t-videos">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2 id="t-videos" className={cx(T2, "reveler")}>
            {typo("À regarder avant d’appeler")}
          </h2>
          <Lien href={CHAINE_YOUTUBE} className="group inline-flex min-h-11 items-center gap-2 font-semibold text-trait">
            <span className="underline decoration-1 underline-offset-4 group-hover:decoration-2">Toutes nos vidéos sur YouTube</span>
            <Fleche />
          </Lien>
        </div>
        {/* Couvertures sans photo, le quadrillage d'un plan : la photo de l'agence sert déjà
            sur l'accueil et sur Contact, celle de la collaboratrice en ouverture. */}
        <Carrousel etiquette="Vidéos à regarder avant d’appeler" bureau="grille" className={cx(ENTRE_BLOCS, "reveler")}>
          {A_REGARDER.map((cle) => (
            <CarteVideo key={cle} cle={cle} />
          ))}
        </Carrousel>

        <section aria-labelledby="t-programmes" className="mt-16 desk:mt-24">
          <h2 id="t-programmes" className={T3}>
            Les terrains en vente
          </h2>
          <ul className="mt-5 grid gap-4 tab:grid-cols-3">
            {PROGRAMMES.map((p, i) => (
              <li key={p.slug} className={i === 1 ? "reveler-2" : i === 2 ? "reveler-3" : "reveler"}>
                <VignetteTerrain href={p.href} nom={p.nom} detail={p.statut.texte} photo={p.photo} />
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <TextLink href="/foncier/">Avant d’acheter, vérifiez avec nous</TextLink>
          </p>
        </section>
      </Section>
    </>
  );
}
