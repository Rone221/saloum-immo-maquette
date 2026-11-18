// Contact, direction v4 « Du plan au terrain » (recherche/revue-4/direction-v4.md,
// sections 6 et 7). Cinq pièces, et les fonds alternent (du clair entre la planche au
// bleu et le pied) :
// 01. L'ouverture, sur le sable à croisillons : le numéro tient le titre, en très
//     grand, dans la voix des mesures, sur sa cote. C'est lui qu'on vient chercher.
//     Puis ce qu'on en fait et ses deux boutons (écrire, appeler), le fixe et l'e-mail
//     en cartouche.
// 02. Sur WhatsApp, sur le calque : les trois messages préparés, leur texte affiché
//     (seule page qui les montre). Une ligne par situation : qui, le message, son bouton.
//     Le message des propriétaires a deux trous : ils deviennent deux champs, la phrase
//     à trous d'Aménager, écrite en entier (components/phrase-a-trous.tsx).
// 03. Par écrit, sur la planche au bleu : la fiche de demande, une feuille de calque
//     posée sur le plan. Une maquette : rien ne part (components/formulaire-demande.tsx).
// 04. L'agence, sur le sable : son enseigne en gros plan, l'adresse, sur rendez-vous.
// 05. Les réseaux, sur le calque : un relevé daté, en tableau.
// Pas d'appel final ici, pas de carte, pas d'horaires. Le pied ne redit pas le numéro
// sur cette page (components/pied.tsx).
//
// Photo : 2352-haut (aussi sur l'accueil : deux pages, pas une de plus), agrandie sur
// l'enseigne, sans la vitrine.

import type { Metadata } from "next";
import { Fragment } from "react";
import { BoutonAppel, BoutonWhatsApp } from "@/components/boutons";
import { CaseCartouche, Cartouche } from "@/components/cartouche";
import { EnTeteSection } from "@/components/en-tete-section";
import { FormulaireDemande } from "@/components/formulaire-demande";
import { LigneCartouche } from "@/components/ligne-cartouche";
import { TitreCote } from "@/components/mot-cote";
import { LegendePhoto, Photo } from "@/components/photo";
import { PhraseATrous } from "@/components/phrase-a-trous";
import { PhraseMesuree } from "@/components/phrase-mesuree";
import { Section } from "@/components/section";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { PROPRIETAIRES } from "@/content/pages/amenager";
import { AGENCE_PAGE, COMPTES, FORMULAIRE, MESSAGES_PRETS, OUVERTURE, RESEAUX_PAGE, USAGE } from "@/content/pages/contact";
import { type PhotoId } from "@/content/photos";
import { EMAIL, FIXE, MOBILE, RELEVE_RESEAUX, RESEAUX } from "@/content/site";
import { asset, cx } from "@/lib/base";
import { CHAPEAU, ETIQUETTE, NOTE, SOUS_BORNE, T2, T3 } from "@/lib/classes";
import { dateLongue, typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import "./contact.css";

export const metadata: Metadata = metaPage(
  "Contact",
  `WhatsApp et appel au ${MOBILE.long}. Fixe ${FIXE.court}, e-mail ${EMAIL.adresse}. Agence à Sicap Keur Massar, sur rendez-vous. Votre premier message WhatsApp, déjà écrit.`,
);

/** Les numéros et les adresses de l'ouverture : l'en-tête de section les compte. */
const NUMEROS = [MOBILE, FIXE];
const ADRESSES = [EMAIL];
/** « +221 » : ce que le numéro long a de plus que le court. Posé au-dessus, comme une unité. */
const INDICATIF = MOBILE.long.replace(MOBILE.court, "").trim();

/** La façade de l'agence, coupée au-dessus de la vitrine : 1 080 px de large. */
const ENSEIGNE: PhotoId = "2352-haut";

/** Un lien de coordonnée : 44 px de haut, souligné, la couleur d'accent au survol. */
const LIEN =
  "inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-surface hover:text-accent hover:decoration-2";

/** Un message prêt, en grand : le corps de sa ligne. */
const MESSAGE = "max-w-[36rem] text-[1.375rem] leading-snug text-fort tab:text-[1.625rem] desk:text-[1.75rem]";

/**
 * Le bloc du bouton, au bout de la ligne. Au bureau, le bouton se cale à droite, au
 * niveau de la première ligne du message.
 */
const ACTION = "mt-2 desk:col-span-4 desk:-mt-1.5 desk:flex desk:justify-end";

/**
 * Le texte d'un message, entre guillemets. Les « … » d'un message à compléter
 * restent écrits (WhatsApp les recevra tels quels), posés sur une cote sans valeur
 * (contact.css). Le trou ne quitte pas le mot qui le suit (« … m² », « …, »).
 */
function TexteMessage({ texte }: { texte: string }) {
  const [debut, ...suites] = typo(`« ${texte} »`).split("…");
  return (
    <>
      {debut}
      {suites.map((suite, i) => {
        const [, colle = "", reste = suite] = suite.match(/^(\s?\S+)([\s\S]*)$/) ?? [];
        return (
          <Fragment key={i}>
            <span className="whitespace-nowrap">
              <span className="trou">…</span>
              {colle}
            </span>
            {reste}
          </Fragment>
        );
      })}
    </>
  );
}

/** « 46 000 abonnés » : le nombre seul. La tête de colonne dit l'unité. */
function nombre(texte: string): string {
  return typo(texte).match(/^[\d\s]+/)?.[0].trim() ?? typo(texte);
}

/** Une case du relevé : le nombre dans la voix des mesures, ou rien. */
function CaseNombre({ texte }: { texte?: string }) {
  return (
    <td className="py-2 pl-4 text-right align-middle whitespace-nowrap">
      {texte ? <span className="mesure text-[clamp(1.25rem,5.4vw,1.75rem)] leading-none text-fort">{nombre(texte)}</span> : null}
    </td>
  );
}

export default function Contact() {
  return (
    <>
      {/* 01. Le numéro, en titre. L'indicatif au-dessus, comme une unité. Dessous, sa
          cote : elle prend la largeur du numéro et se tire une fois, à l'arrivée. */}
      <Section labelledBy="t-page" rythme="ouverture" croisillons>
        <EnTeteSection
          numero="01"
          nom={OUVERTURE.nom}
          quantite={`${NUMEROS.length} numéros · ${ADRESSES.length} e-mail`}
          arrivee
        />
        <h1 id="t-page" className={cx("m-0", SOUS_BORNE)}>
          {/* Lu avant le numéro : le titre de la page n'est pas qu'une suite de chiffres. */}
          <span className="sr-only">{typo(OUVERTURE.avantNumero)} </span>
          <a
            href={MOBILE.href}
            aria-label={typo(MOBILE.long)}
            className="inline-flex flex-col text-fort transition-surface hover:text-accent"
          >
            <span className="mesure text-h3 leading-none tab:text-h2">{INDICATIF}</span>
            {/* Ne se coupe pas : la taille suit la largeur de l'écran, 48 px à 390, 160 px
                dès 1 312. À 1 101 px, le numéro tient juste entre les deux gouttières. */}
            <span className="mesure mt-2 text-[clamp(2.25rem,12.2vw,10rem)] leading-[0.9] whitespace-nowrap tab:mt-3">
              {typo(MOBILE.court)}
            </span>
            <span aria-hidden="true" className="se-tire-arrivee mt-3 flex items-center text-accent tab:mt-4">
              <span className="h-[11px] w-[1.5px] flex-none bg-current desk:h-[17px] desk:w-0.5" />
              <span className="h-[1.5px] flex-1 bg-current desk:h-0.5" />
              <span className="h-[11px] w-[1.5px] flex-none bg-current desk:h-[17px] desk:w-0.5" />
            </span>
          </a>
        </h1>
        <div className="mt-7 grid gap-y-8 tab:mt-9 desk:mt-10 desk:grid-cols-12 desk:items-start desk:gap-x-6">
          {/* Ce qu'on fait du numéro, puis les deux gestes : écrire, appeler. Sous 761 px,
              un bouton par ligne, sur toute la largeur. */}
          <div className="desk:col-span-5">
            <p className={CHAPEAU}>{typo(USAGE.texte)}</p>
            <div className="mt-6 flex flex-col gap-3 tab:flex-row desk:mt-7">
              <BoutonWhatsApp label={LIBELLES.question} message={MESSAGES.question.texte} />
              <BoutonAppel />
            </div>
          </div>
          <Cartouche aria-label={OUVERTURE.cartouche} className="tab:grid-cols-2 desk:col-span-6 desk:col-start-7">
            <CaseCartouche cle={OUVERTURE.cles.fixe} className="pb-1.5 desk:pb-2">
              <a href={FIXE.href} className={cx(LIEN, "mesure -mt-1 text-[1.375rem]")}>
                {typo(FIXE.court)}
              </a>
            </CaseCartouche>
            <CaseCartouche cle={OUVERTURE.cles.email} className="pb-1.5 desk:pb-2">
              {/* 19 px : l'adresse tient sur une ligne dans sa case, dès 1 101 px. */}
              <a href={EMAIL.href} className={cx(LIEN, "-mt-1 text-[1.1875rem] break-all")}>
                {EMAIL.adresse}
              </a>
            </CaseCartouche>
          </Cartouche>
        </div>
      </Section>

      {/* 02. Les trois messages préparés. Une ligne par situation, comme dans l'index
          des terrains : qui écrit, le message en grand, son bouton au bout de la ligne. */}
      <Section surface="calque" labelledBy="t-messages">
        <EnTeteSection
          numero="02"
          nom={MESSAGES_PRETS.nom}
          quantite={`${MESSAGES_PRETS.situations.length} messages prêts`}
        />
        <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
          <h2 id="t-messages" className={cx(T2, "max-w-[14em] desk:col-span-7")}>
            <TitreCote texte={MESSAGES_PRETS.titre} mot={MESSAGES_PRETS.mot} />
          </h2>
          <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-4 desk:col-start-9")}>{typo(MESSAGES_PRETS.chapeau)}</p>
        </div>
        <ol className="m-0 mt-10 list-none border-t border-fort p-0 desk:mt-14">
          {MESSAGES_PRETS.situations.map((s, i) => {
            // Les trois boutons ont la largeur du plus long libellé, sur une ligne : une
            // colonne, pas un escalier. À 1 101 px, il mord de 20 px sur la gouttière voisine.
            const bouton = (
              <BoutonWhatsApp
                variante="contour"
                label={s.bouton}
                message={s.message.texte}
                className="desk:w-[21.5rem] desk:flex-none desk:self-start desk:whitespace-nowrap"
              />
            );
            return (
              <li
                key={s.id}
                className={cx(
                  "apparait grid gap-y-4 border-b border-ligne py-7 desk:grid-cols-12 desk:gap-x-6 desk:py-9",
                  i === 1 && "[--rang:1]",
                  i === 2 && "[--rang:2]",
                )}
              >
                <h3 className={cx(T3, "desk:col-span-3 desk:pt-0.5")}>{typo(s.qui)}</h3>
                {s.message.gabarit && PROPRIETAIRES.phrase ? (
                  // Le message à compléter : ses deux trous deviennent deux champs, et le
                  // bouton emporte la phrase remplie. Le formulaire reprend les colonnes du
                  // message et du bouton (sous-grille), comme les deux autres lignes.
                  <PhraseATrous
                    phrase={PROPRIETAIRES.phrase}
                    nom={s.bouton}
                    entier
                    className="grid gap-y-4 desk:col-span-9 desk:grid-cols-subgrid"
                    classePhrase={cx(MESSAGE, "desk:col-span-5")}
                    classeAction={ACTION}
                  >
                    {bouton}
                  </PhraseATrous>
                ) : (
                  <>
                    <div className="desk:col-span-5">
                      <p className={MESSAGE}>
                        <TexteMessage texte={s.message.texte} />
                      </p>
                      {s.message.gabarit ? <p className={cx(NOTE, "mt-3")}>{typo(MESSAGES_PRETS.aCompleter)}</p> : null}
                    </div>
                    <div className={ACTION}>{bouton}</div>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </Section>

      {/* 03. La fiche de demande, sur la planche au bleu : le titre à gauche, la feuille
          à droite. La section est sombre, la fiche est claire : elle porte ses couleurs. */}
      <Section id="demande" surface="plan" labelledBy="t-demande" croisillons>
        <EnTeteSection numero="03" nom={FORMULAIRE.nom} quantite={`${FORMULAIRE.champs.length} champs`} />
        <div className={cx("grid gap-y-10 desk:grid-cols-12 desk:gap-x-6", SOUS_BORNE)}>
          <div className="desk:col-span-4">
            <h2 id="t-demande" className={T2}>
              <TitreCote texte={FORMULAIRE.titre} mot={FORMULAIRE.mot} />
            </h2>
            <p className={cx(CHAPEAU, "mt-5 max-w-[30rem] desk:mt-7")}>{typo(FORMULAIRE.chapeau)}</p>
          </div>
          <FormulaireDemande textes={FORMULAIRE.textes} lienAdmin={asset("/admin/demandes/")} className="desk:col-span-8" />
        </div>
      </Section>

      {/* 04. L'agence : l'enseigne et sa devise, l'adresse, sur rendez-vous. */}
      <Section labelledBy="t-agence">
        {/* Pas de quantité : le lieu est écrit dans l'adresse, plus bas. La limite va au bord. */}
        <EnTeteSection numero="04" nom={AGENCE_PAGE.nom} />
        <div className={cx("grid gap-y-8 desk:grid-cols-12 desk:items-start desk:gap-x-6", SOUS_BORNE)}>
          {/* 2352-haut agrandie 1,4 fois sur l'enseigne (x 230 à 1 000, y 0 à 310 du
              fichier) : la vitrine sort du cadre. Dessinée à 1,4 fois la largeur du cadre :
              cadre de 42 rem au plus sur tablette, 940 px dessinés au plus pour un fichier
              de 1 080. Bord à bord sur mobile ; la légende garde la gouttière. */}
          <figure className="apparait -mx-gutter m-0 tab:mx-0 tab:max-w-[42rem] desk:col-span-6 desk:max-w-none [&_figcaption]:px-gutter tab:[&_figcaption]:px-0">
            <span className="relative block aspect-[5/2] overflow-hidden bg-attente">
              <Photo
                id={ENSEIGNE}
                fill
                position="50% top"
                sizes="(min-width: 1440px) 940px, (min-width: 1101px) 64vw, (min-width: 761px) 941px, 140vw"
                className="origin-[74%_0%] scale-[1.4] object-cover"
              />
            </span>
            <LegendePhoto id={ENSEIGNE} />
          </figure>
          <div className="desk:col-span-5 desk:col-start-8">
            <h2 id="t-agence" className={T2}>
              <TitreCote texte={AGENCE_PAGE.titre} mot={AGENCE_PAGE.mot} />
            </h2>
            <dl className="m-0 mt-6 border-t border-fort desk:mt-8">
              <LigneCartouche cle={AGENCE_PAGE.cles.adresse}>{typo(AGENCE_PAGE.adresse.texte)}</LigneCartouche>
              <LigneCartouche cle={AGENCE_PAGE.cles.visite}>{typo(AGENCE_PAGE.visite.texte)}</LigneCartouche>
            </dl>
          </div>
        </div>
      </Section>

      {/* 05. Les réseaux : un relevé daté. Un vrai tableau, à toutes les largeurs : le
          réseau et son compte, puis les nombres, alignés à droite comme dans un relevé. */}
      <Section surface="calque" labelledBy="t-reseaux">
        <EnTeteSection numero="05" nom={RESEAUX_PAGE.nom} quantite={`${RESEAUX.length} réseaux`} />
        <div className={cx("grid gap-y-8 desk:grid-cols-12 desk:gap-x-6", SOUS_BORNE)}>
          <h2 id="t-reseaux" className={cx(T2, "desk:col-span-5")}>
            <TitreCote texte={RESEAUX_PAGE.titre} mot={RESEAUX_PAGE.mot} />
          </h2>
          <div className="desk:col-span-6 desk:col-start-7">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{typo(RESEAUX_PAGE.legende)}</caption>
              <thead>
                <tr className="border-t border-b border-t-fort border-b-ligne">
                  <th scope="col" className={cx(ETIQUETTE, "py-3 pr-4")}>
                    {typo(RESEAUX_PAGE.colonnes.reseau)}
                  </th>
                  <th scope="col" className={cx(ETIQUETTE, "py-3 pl-4 text-right")}>
                    {typo(RESEAUX_PAGE.colonnes.abonnes)}
                  </th>
                  <th scope="col" className={cx(ETIQUETTE, "py-3 pl-4 text-right")}>
                    {typo(RESEAUX_PAGE.colonnes.videos)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {RESEAUX.map((r) => {
                  const compte = COMPTES[r.nom];
                  return (
                    <tr key={r.nom} className="border-b border-ligne">
                      <th scope="row" className="py-1.5 pr-4 font-normal">
                        {/* Sur téléphone, le compte passe sous le réseau, pour toutes les lignes. */}
                        <a
                          href={r.href}
                          className="group inline-flex min-h-11 flex-col justify-center gap-x-3 py-1.5 tab:flex-row tab:items-baseline tab:justify-start"
                        >
                          <span className="font-semibold text-fort underline decoration-1 underline-offset-4 transition-surface group-hover:text-accent group-hover:decoration-2">
                            {typo(r.nom)}
                          </span>
                          {compte ? <span className="text-small text-doux">{typo(compte.nom)}</span> : null}
                        </a>
                      </th>
                      <CaseNombre texte={r.chiffre?.texte} />
                      <CaseNombre texte={compte?.videos?.texte} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={cx(NOTE, "mt-4")}>
              <PhraseMesuree texte={`Nombres relevés le ${dateLongue(RELEVE_RESEAUX)}.`} />
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
