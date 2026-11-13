// Diaspora (recherche/allegement.md, partie 3) : acheter depuis l'étranger.
// Ouverture avec la collaboratrice en grand, quatre étapes, trois vidéos, une
// ligne sur les programmes. Les listes du foncier vivent sur la page Foncier.
//
// Ne jamais écrire « EXCLUSIF DIASPORA ». Ne rien promettre qui n'est pas publié :
// ni paiement à distance, ni échéancier, ni procuration, ni visite vidéo en direct.
// Personne n'est nommé. Le notaire est un accompagnement, pas une garantie.

import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { BoutonWhatsApp } from "@/components/boutons";
import { Cadre } from "@/components/photo";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { Videos } from "@/components/videos";
import { NOTAIRE } from "@/content/foncier";
import { LIBELLES } from "@/content/messages";
import { PROGRAMMES } from "@/content/programmes";
import { DIASPORA, PARCOURS_DIASPORA } from "@/content/services";
import { MOBILE } from "@/content/site";
import { A_REGARDER } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, COLONNE, ENTRE_BLOCS, T1, T2 } from "@/lib/classes";
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

/** « Sakina City, titres fonciers individuels. » : le nom en lien, le statut en minuscules. */
function statutEnPhrase(texte: string): string {
  return texte.charAt(0).toLowerCase() + texte.slice(1);
}

export default function Diaspora() {
  return (
    <>
      {/* 1. Ouverture : le titre, WhatsApp, le notaire ; la collaboratrice en grand. */}
      <Section labelledBy="t-page" rythme="ouverture">
        <div className="grid gap-y-10 tab:grid-cols-12 tab:items-center tab:gap-x-6">
          <div className="tab:col-span-6">
            <h1 id="t-page" className={T1}>
              {typo(DIASPORA.titre)}
            </h1>
            <p className={cx(CHAPEAU, "mt-5 max-w-[30em] desk:mt-7")}>{typo(DIASPORA.chapeau)}</p>
            <BoutonWhatsApp label={LIBELLES.diaspora} message={DIASPORA.message} className="mt-8 desk:mt-10" />
            <p className="mt-4 text-ink-2">{typo(NOTAIRE.texte)}</p>
          </div>
          {/* Capture de 899 px dans un cadre 4:3 : dessinée par sa hauteur, 674 px de
              cadre au plus pour ne jamais l'agrandir. */}
          <Cadre
            id={DIASPORA.photo}
            preload
            legende
            sizes="(min-width: 1101px) 890px, (min-width: 761px) 63vw, 133vw"
            bord
            className="tab:col-span-6 tab:col-start-7"
          />
        </div>
      </Section>

      {/* 2. Quatre étapes, en liste numérotée simple : une colonne, le numéro en gras
          devant le titre, sans couleur. */}
      <Section labelledBy="t-etapes" surface="paper-2">
        <div className={COLONNE}>
          <h2 id="t-etapes" className={T2}>
            Quatre étapes
          </h2>
          <ol className={cx(ENTRE_BLOCS, "flex flex-col gap-7")}>
            {PARCOURS_DIASPORA.map((s, i) => (
              <li key={s.titre}>
                <h3 className="font-bold">
                  <span aria-hidden="true" className="inline-block w-6 tabular-nums">
                    {i + 1}
                  </span>
                  {typo(s.titre)}
                </h3>
                <p className="mt-1 pl-6 text-ink-2">{rendre(s.texte)}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 3. À regarder avant d'appeler, en une colonne : trois vidéos, le lien vers la
          chaîne, puis une ligne sur les programmes et le lien vers le foncier. */}
      <Section labelledBy="t-videos">
        <div className={COLONNE}>
          <Videos cles={A_REGARDER} titre="À regarder avant d’appeler" tous grand />
          <p className={ENTRE_BLOCS}>
            {PROGRAMMES.map((p, i) => (
              <Fragment key={p.slug}>
                {i > 0 ? " " : null}
                <Link href={p.href} className={cx(LIEN, "whitespace-nowrap")}>
                  {p.nom}
                </Link>
                {typo(`, ${statutEnPhrase(p.statut.texte)}`)}
              </Fragment>
            ))}
          </p>
          <p className="mt-2">
            <TextLink href="/foncier/">Avant d’acheter, vérifiez avec nous</TextLink>
          </p>
        </div>
      </Section>
    </>
  );
}
