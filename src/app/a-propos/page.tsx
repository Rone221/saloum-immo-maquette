// À propos (recherche/allegement.md, partie 3) : le fondateur, l'entreprise, ses
// réalisations. Personne n'est nommé sauf Babacar Ndiaye. Les réseaux vivent sur
// la page Contact, le registre complet sur la page Aménager. Photo toujours à
// gauche, texte à droite, bord à bord sur mobile.
//
// Millennium City : seule la canalisation est attribuée à Saloum Immo, jamais
// l'aire de jeux, jamais « notre programme » (lotissement commercialisé par
// Senegindia). La vidéo « Nos réalisations 2026 » présente tout le projet comme
// réalisé par Saloum Immo : elle est liée depuis L'entreprise, pas depuis Réalisations.

import type { Metadata } from "next";
import { Cadre, Photo } from "@/components/photo";
import { Borne } from "@/components/reperes";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { FICHE_ENTREPRISE } from "@/content/pages/a-propos";
import { MILLENNIUM_CITY } from "@/content/registre";
import { FONDATEUR } from "@/content/site";
import { VIDEOS, titreVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, ENTRE_BLOCS, T1, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  "À propos",
  "Babacar Ndiaye, fondateur et directeur général de Saloum Immo. L’entreprise, son équipe et ses réalisations.",
);

export default function APropos() {
  const interview = VIDEOS.interviewDG;
  return (
    <>
      {/* 1. Babacar Ndiaye : l'interview, le rôle, la biographie. */}
      <Section labelledBy="t-page" rythme="ouverture">
        <div className="grid gap-y-10 tab:grid-cols-12 tab:items-center tab:gap-x-6">
          {/* Capture de 899 px dans un cadre 4:3 : dessinée par sa hauteur, 640 px de
              cadre au plus, soit 853 px dessinés et 887 au survol (zoom de 1,04) : jamais
              agrandie. */}
          <a
            href={interview.href}
            tabIndex={-1}
            aria-hidden="true"
            className="group entree relative -mx-gutter block max-w-[640px] [--delai:0.1s] tab:col-span-6 tab:mx-0"
          >
            <span className="relative block aspect-[4/3] overflow-hidden bg-paper-2">
              <Photo
                id={FONDATEUR.photo}
                fill
                preload
                decorative
                sizes="(min-width: 1384px) 853px, (min-width: 761px) 63vw, (min-width: 641px) 853px, 133vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </span>
            <span className="absolute bottom-0 left-0 inline-flex items-center gap-3 bg-ink py-3 pr-5 pl-3 font-semibold text-white transition-colors duration-300 group-hover:bg-trait">
              <span className="inline-flex size-9 items-center justify-center bg-white/15">
                <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
              </span>
              {typo(`L’interview, ${interview.duree}`)}
            </span>
          </a>
          <div className="entree tab:col-span-6 desk:col-span-5 desk:col-start-8">
            <h1 id="t-page" className={T1}>
              {FONDATEUR.nom.texte}
            </h1>
            <p className={cx(CHAPEAU, "mt-4 desk:mt-6")}>{typo(FONDATEUR.role.texte)}</p>
            <p className="mt-6 desk:mt-8">{typo(FONDATEUR.biographie.texte)}</p>
            <p className="mt-3">
              <TextLink href={interview.href}>{`L’écouter expliquer le foncier, en vidéo (${interview.duree})`}</TextLink>
            </p>
          </div>
        </div>
      </Section>

      {/* 2. L'entreprise : l'équipe sur le terrain (sans nom) à gauche, quatre lignes à droite. */}
      <Section labelledBy="t-entreprise" surface="paper-2">
        <div className="grid gap-y-10 tab:grid-cols-12 tab:items-center tab:gap-x-6">
          <Cadre
            id="2499"
            legende
            bord
            sizes="(min-width: 1440px) 668px, (min-width: 761px) 47vw, 100vw"
            className="reveler tab:col-span-6"
          />
          <div className="tab:col-span-6 desk:col-span-5 desk:col-start-8">
            <h2 id="t-entreprise" className={T2}>
              {typo("L’entreprise")}
            </h2>
            <dl className={cx(ENTRE_BLOCS, "grid gap-3 tab:grid-cols-2")}>
              {FICHE_ENTREPRISE.map((l, i) => (
                <div
                  key={l.libelle}
                  className={cx(
                    "border border-rule bg-paper p-4 transition-colors duration-300 hover:border-trait",
                    i % 2 === 1 ? "reveler-2" : "reveler",
                  )}
                >
                  <dt className="flex items-center gap-2 text-small font-semibold text-ink-2">
                    <Borne />
                    {l.libelle}
                  </dt>
                  <dd className="mt-1.5">{typo(l.valeur.texte)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6">
              <TextLink href={VIDEOS.realisations2026.href}>{titreVideo("realisations2026")}</TextLink>
            </p>
          </div>
        </div>
      </Section>

      {/* 3. Réalisations : Millennium City, attribué au mot près, avec 2537. */}
      <Section labelledBy="t-realisations">
        <div className="grid gap-y-10 tab:grid-cols-12 tab:items-center tab:gap-x-6">
          <Cadre
            id={MILLENNIUM_CITY.photo}
            ratio="aspect-[3/2]"
            legende
            sizes="(min-width: 1440px) 668px, (min-width: 761px) 47vw, 100vw"
            bord
            className="reveler tab:col-span-6"
          />
          <div className="reveler-2 border-l-4 border-borne pl-6 tab:col-span-6 desk:col-span-5 desk:col-start-8">
            <h2 id="t-realisations" className={T2}>
              Réalisations
            </h2>
            <p className="mt-4 desk:mt-6">{typo(MILLENNIUM_CITY.texte.texte)}</p>
            <p className="mt-3">
              <TextLink href="/amenager/#travaux">Nos travaux datés</TextLink>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
