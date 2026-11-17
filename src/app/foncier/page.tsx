// Comprendre le foncier, direction v4 « Du plan au terrain »
// (recherche/revue-4/direction-v4.md, section 6). C'est la page où la peur de l'arnaque
// se traite : une page typographique, sans photo de terrain, où les traits du plan
// disent ce qu'on sait. Pointillé : ce qui n'est pas sûr. Tirets : ce qui est en cours.
// Plein, entre deux bornes : ce qui est acquis. Chaque section a sa pièce :
// 01. Les papiers. L'ouverture de page, puis l'échelle complète : délibération, bail,
//     titre foncier, chacun sur son trait. En bas de planche, comme sur un plan, le
//     cartouche : la source des définitions, et l'interview du DG en lien.
// 02. À demander. L'avertissement, sur l'aplat de latérite (la seule fois de la page) :
//     la phrase entière en grand, ses trois statuts sur leurs trois traits. En regard,
//     le lien vers nos terrains, dont le papier est écrit.
// 03. À vérifier. La fiche des vérifications, posée sur le plan : la liste en lignes
//     séparées d'un pointillé, la pièce (le document montré dans la vidéo du NICAD, et
//     sa vidéo), puis le notaire, une seule fois sur la page.
// 04. L'appel final. Le pied suit, dans le layout.
//
// Les fonds alternent : sable à croisillons, latérite, sable, calque, puis le bleu du
// pied. Une seule photo : l'image du document, tirée de la vidéo du NICAD (accueil et
// cette page), jamais plus large que son fichier (449 px).
// C'est une vérification proposée, jamais une garantie.
// Le CSS propre à la page (les traits dans la phrase, les pointillés de la fiche,
// l'arrivée de l'échelle) est dans foncier.css, à côté.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppelFinal } from "@/components/appel-final";
import { BoutonWhatsApp } from "@/components/boutons";
import { LienVideo } from "@/components/carte-video";
import { CaseCartouche, Cartouche } from "@/components/cartouche";
import { EchellePapiers } from "@/components/echelle-papiers";
import { EnTete } from "@/components/en-tete";
import { EnTeteSection } from "@/components/en-tete-section";
import { TitreCote } from "@/components/mot-cote";
import { LegendePhoto, Photo, cadreNaturel, plafond } from "@/components/photo";
import { PhraseMesuree } from "@/components/phrase-mesuree";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { AVANT_D_ACHETER, AVERTISSEMENT_STATUT, DOCUMENTS, NOTAIRE, SOURCE_DEFINITIONS } from "@/content/foncier";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { FONCIER } from "@/content/pages/foncier";
import { type PhotoId } from "@/content/photos";
import { VIDEOS } from "@/content/videos";
import { cx } from "@/lib/base";
import { NOM, SOUS_BORNE, T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import "./foncier.css";

export const metadata: Metadata = metaPage(FONCIER.titre, FONCIER.description);

/** Le document montré dans la vidéo du NICAD : 449 px de large, jamais agrandi. */
const DOCUMENT: PhotoId = "ig-DexPGrbBztC-20s";

// Les deux vidéos de la page sont dans une case : en lien nu, sans filet (LienVideo,
// components/carte-video.tsx).

/**
 * L'avertissement, mot pour mot. Les trois statuts qu'il nomme sont repérés dans la
 * phrase (les noms des documents, en minuscules) et posés chacun sur le trait de son
 * document : pointillé, tirets, plein entre deux bornes (foncier.css). Ils se rangent
 * sur leur ligne quand elle les contient, comme une légende au bas de la phrase.
 * Si la phrase ne nomme plus les trois documents, elle sort telle quelle.
 */
function Avertissement() {
  const noms = DOCUMENTS.map((d) => d.nom.toLocaleLowerCase("fr"));
  const morceaux = AVERTISSEMENT_STATUT.split(new RegExp(`(${noms.join("|")})`));
  if (morceaux.length !== 2 * DOCUMENTS.length + 1) return <>{typo(AVERTISSEMENT_STATUT)}</>;

  const statuts: ReactNode[] = [];
  for (let i = 1; i < morceaux.length; i += 2) {
    const papier = DOCUMENTS[noms.indexOf(morceaux[i])];
    const suite = morceaux[i + 1];
    // La virgule ou le point final : dans le même bloc insécable que le mot.
    const colle = suite.match(/^ ?[,.;:!?»…]+/)?.[0] ?? "";
    statuts.push(
      <span key={papier.cle} className="whitespace-nowrap">
        <span className="foncier-statut" data-statut={papier.cle}>
          {typo(morceaux[i])}
        </span>
        {typo(colle)}
      </span>,
      typo(suite.slice(colle.length)),
    );
  }
  return (
    <>
      {typo(morceaux[0])}
      <span className="block">{statuts}</span>
    </>
  );
}

export default function Foncier() {
  return (
    <>
      {/* 01. Les papiers : l'ouverture de page, puis l'échelle, sur le sable à croisillons.
          L'échelle est une figure : les noms des documents sont les h2 de la page. */}
      <Section labelledBy="t-page" rythme="ouverture" croisillons>
        <EnTete
          nom={FONCIER.sections.papiers.nom}
          quantite={`${DOCUMENTS.length} ${FONCIER.sections.papiers.unite}`}
          titre={FONCIER.titre}
          mot={FONCIER.mot}
          chapeau={FONCIER.chapeau}
        />

        <EchellePapiers complet niveau={2} className="foncier-echelle mt-12 desk:mt-16" />

        {/* Bas de planche : le cartouche. Au bureau, son filet tombe sous la borne où
            commence le trait du titre foncier : la colonne de l'échelle et sa gouttière. */}
        <Cartouche
          aria-label={FONCIER.cartouche.nom}
          className="apparait mt-12 tab:grid-cols-2 desk:mt-16 desk:grid-cols-[calc((100%_+_1.5rem)_/_2)_minmax(0,1fr)]"
        >
          <CaseCartouche cle={FONCIER.cartouche.source}>
            <p className="max-w-[34rem]">
              <PhraseMesuree texte={SOURCE_DEFINITIONS.texte} />
            </p>
          </CaseCartouche>
          <CaseCartouche cle={FONCIER.cartouche.video}>
            <LienVideo cle="interviewDG" />
          </CaseCartouche>
        </Cartouche>
      </Section>

      {/* 02. À demander : l'avertissement, fort. Seule occurrence du site. La quantité
          de l'en-tête : les réponses possibles, celles que la phrase nomme. */}
      <Section surface="laterite" labelledBy="t-statut">
        <EnTeteSection
          numero="02"
          nom={FONCIER.sections.statut.nom}
          quantite={`${DOCUMENTS.length} ${FONCIER.sections.statut.unite}`}
        />
        {/* La phrase à gauche, sur neuf colonnes. En regard, calé sur sa dernière ligne :
            « tout autre terrain » appelle le lien vers les nôtres, dont le papier est
            écrit sur la page Terrains. Le lien prend les quatre dernières colonnes, sur
            la même rangée : il tient sur une ligne dès 1 101 px, et la dernière ligne de
            la phrase, plus courte, s'arrête avant lui. Sur mobile, il passe dessous. */}
        <div className={cx("grid gap-y-8 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
          <h2 id="t-statut" className={cx(T2, "desk:col-span-9 desk:col-start-1 desk:row-start-1")}>
            <Avertissement />
          </h2>
          <TextLink
            href={FONCIER.lienTerrains.href}
            className="justify-self-start desk:col-span-4 desk:col-start-9 desk:row-start-1 desk:justify-self-end desk:whitespace-nowrap"
          >
            {FONCIER.lienTerrains.libelle}
          </TextLink>
        </div>
      </Section>

      {/* 03. À vérifier : la fiche, en calque, posée sur le plan. */}
      <Section labelledBy="t-verifier" croisillons>
        <EnTeteSection
          numero="03"
          nom={FONCIER.sections.verifier.nom}
          quantite={`${AVANT_D_ACHETER.lignes.length} ${FONCIER.sections.verifier.unite}`}
        />
        <h2 id="t-verifier" className={cx(T2, SOUS_BORNE, "max-w-[12em]")}>
          <TitreCote texte={AVANT_D_ACHETER.titre} mot={FONCIER.motVerifier} />
        </h2>

        <div className="apparait mt-10 grid border border-ligne bg-calque sur-calque desk:mt-14 desk:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          {/* Les lignes : elles se partagent la hauteur de la pièce, en regard. */}
          <ul className="foncier-lignes m-0 flex list-none flex-col px-5 py-2 tab:px-8 tab:py-3 desk:border-r desk:border-ligne desk:px-10 desk:py-4">
            {AVANT_D_ACHETER.lignes.map((l) => (
              <li key={l.texte} className={cx(T3, "flex flex-1 items-center py-4 desk:py-5")}>
                {typo(l.texte)}
              </li>
            ))}
          </ul>

          {/* La pièce : le document montré dans la vidéo du NICAD, à sa taille, puis la
              vidéo. Sur tablette, la vidéo passe à droite de l'image, calée sur son pied :
              la case est plus large que le fichier, et quatre neuvièmes laissent au titre
              de la vidéo sa ligne entière dès 761 px. `group/piece` : survoler l'image
              allume le titre de sa vidéo. */}
          <div className="group/piece border-t border-ligne p-5 tab:grid tab:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] tab:items-end tab:gap-x-8 tab:p-8 desk:block desk:border-t-0 wide:p-10">
            <figure className="m-0" style={plafond(DOCUMENT)}>
              <span className="relative block overflow-hidden bg-attente" style={{ aspectRatio: cadreNaturel(DOCUMENT).aspectRatio }}>
                <Photo
                  id={DOCUMENT}
                  fill
                  sizes="(min-width: 1441px) 373px, (min-width: 1281px) 26vw, (min-width: 1101px) 27vw, (min-width: 761px) 50vw, (min-width: 531px) 449px, calc(100vw - 82px)"
                  className="object-cover"
                />
                {/* L'image se clique aussi, à la souris : le lien de la vidéo est son
                    titre, dessous. Celui-ci le double sans rien ajouter au clavier ni
                    à un lecteur d'écran. */}
                <a href={VIDEOS.nicad.href} tabIndex={-1} aria-hidden="true" data-document="" className="absolute inset-0" />
              </span>
              <LegendePhoto id={DOCUMENT} texte={FONCIER.legendeDocument} className="text-balance" />
            </figure>
            <LienVideo cle="nicad" className="mt-3 group-has-[[data-document]:hover]/piece:text-accent tab:mt-0 desk:mt-3" />
          </div>

          {/* Le notaire, une seule fois sur la page : il ferme la fiche. */}
          <p className={cx(NOM, "border-t border-ligne px-5 py-7 tab:px-8 tab:py-8 desk:col-span-2 desk:px-10 desk:py-10")}>
            <TitreCote texte={NOTAIRE.texte} mot={FONCIER.motNotaire} />
          </p>
        </div>
      </Section>

      {/* 04. L'appel final. */}
      <AppelFinal
        numero="04"
        nom={FONCIER.appel.nom}
        phrase={FONCIER.appel.phrase}
        mot={FONCIER.appel.mot}
        bouton={<BoutonWhatsApp label={LIBELLES.question} message={MESSAGES.documents.texte} />}
      />
    </>
  );
}
