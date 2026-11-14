// Contact (recherche/allegement.md, partie 3). La page s'ouvre sur le bleu : le
// numéro en grand, WhatsApp, Appeler, le fixe, l'e-mail, l'agence. Puis les trois
// messages prêts, seul endroit du site où le texte des messages WhatsApp s'affiche,
// et les réseaux. Le pied n'a que sa ligne blanche (components/pied.tsx).
// Pas de formulaire (export statique), pas de carte, pas d'horaires : « Sur rendez-vous ».
// Les chiffres des réseaux s'affichent toujours avec la date de leur relevé.

import type { Metadata } from "next";
import { BoutonAppel, BoutonWhatsApp } from "@/components/boutons";
import { Fleche } from "@/components/reperes";
import { Cadre } from "@/components/photo";
import { Section } from "@/components/section";
import { LIBELLES, MESSAGES, type Message } from "@/content/messages";
import { AGENCE, EMAIL, FIXE, MOBILE, RELEVE_RESEAUX, RESEAUX } from "@/content/site";
import { cx } from "@/lib/base";
import { ENTRE_BLOCS, NOTE, SOUS_TITRE, T1, T2, T3 } from "@/lib/classes";
import { dateLongue, typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { metaPage } from "@/lib/meta";

/** Trois situations, chacune avec le bouton de son intention et son message. */
const SITUATIONS: { titre: string; bouton: string; message: Message }[] = [
  { titre: "J’achète un terrain", bouton: LIBELLES.question, message: MESSAGES.question },
  { titre: "Je veux faire aménager", bouton: LIBELLES.proprietaire, message: MESSAGES.proprietaire },
  { titre: "J’habite à l’étranger", bouton: LIBELLES.diaspora, message: MESSAGES.diaspora },
];

export const metadata: Metadata = metaPage(
  "Contact",
  `WhatsApp et mobile ${MOBILE.long}, fixe ${FIXE.court}, e-mail ${EMAIL.adresse}. Agence : ${AGENCE.texte} Trois messages prêts à envoyer sur WhatsApp.`,
);

const LIEN_BLANC = "underline decoration-1 underline-offset-4 hover:decoration-2";

/**
 * Une ligne du bloc bleu : le même pas pour les trois (10 px dessus et dessous,
 * lignes alignées sur leur ligne de base). Les liens font ainsi 45 px de haut.
 */
const PAS = "py-2.5";

export default function Contact() {
  return (
    <>
      {/* 1. Ouverture sur le bleu. */}
      <section aria-labelledby="t-page" className="bg-trait text-white [&_:focus-visible]:outline-white">
        <div className="wrap grid gap-y-10 pt-10 pb-18 tab:pt-14 tab:pb-24 tab:grid-cols-12 tab:items-center tab:gap-x-6 desk:pt-20 desk:pb-28">
          <div className="tab:col-span-6">
            <h1 id="t-page" className={cx(T1, "entree")}>
              Parlons de votre terrain
            </h1>
            <a
              href={MOBILE.href}
              className={cx(T2, "mt-5 inline-flex min-h-11 items-center font-bold decoration-2 underline-offset-8 hover:underline desk:mt-8")}
            >
              {typo(MOBILE.long)}
            </a>
            <div className="mt-6 flex flex-wrap gap-3 desk:mt-8">
              <BoutonWhatsApp
                label={LIBELLES.question}
                message={MESSAGES.question.texte}
                variante="inverse"
                bloc={false}
                className="grow tab:grow-0"
              />
              <BoutonAppel variante="ligne" bloc={false} className="grow tab:grow-0" />
            </div>
            {/* Trois lignes au même pas, clé et valeur sur la même ligne de base. */}
            <dl className="mt-8 grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-4 desk:mt-10">
              <dt className={cx(PAS, "text-small text-white/80")}>Fixe</dt>
              <dd>
                <a href={FIXE.href} className={cx(LIEN_BLANC, PAS, "inline-block")}>
                  {typo(FIXE.court)}
                </a>
              </dd>
              <dt className={cx(PAS, "text-small text-white/80")}>E-mail</dt>
              <dd>
                <a href={EMAIL.href} className={cx(LIEN_BLANC, PAS, "inline-block break-all")}>
                  {EMAIL.adresse}
                </a>
              </dd>
              <dt className={cx(PAS, "text-small text-white/80")}>Agence</dt>
              <dd className={PAS}>{typo(AGENCE.texte)}</dd>
            </dl>
          </div>
          <Cadre
            id="2352-haut"
            preload
            legende
            bord
            sizes="(min-width: 1440px) 832px, (min-width: 761px) 62vw, 133vw"
            className="tab:col-span-6 [&_figcaption]:text-white/80"
          />
        </div>
      </section>

      {/* 2. Trois messages prêts : le seul endroit où leur texte s'affiche. */}
      <Section labelledBy="t-messages">
        <h2 id="t-messages" className={T2}>
          Trois messages prêts
        </h2>
        <p className={cx(SOUS_TITRE, "max-w-[36rem] text-ink-2")}>
          {typo("Chaque bouton ouvre WhatsApp avec ce message déjà écrit. Vous le relisez avant d’envoyer.")}
        </p>
        <ul className={cx(ENTRE_BLOCS, "grid gap-4 tab:grid-cols-3 tab:gap-6")}>
          {SITUATIONS.map((st, i) => (
            <li key={st.titre} className={i === 1 ? "reveler-2" : i === 2 ? "reveler-3" : "reveler"}>
              {/* Pas d'aria-label : le nom du lien est son texte, le message prêt compris. */}
              <a
                href={waHref(typo(st.message.texte))}
                className="group relative flex h-full flex-col border border-rule bg-paper p-6 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-trait"
              >
                <h3 className={T3}>{typo(st.titre)}</h3>
                {/* Le message, comme une bulle déjà écrite. */}
                <p className="relative mt-5 bg-paper-2 px-4 py-3.5 text-ink-2 transition-colors duration-300 group-hover:bg-trait group-hover:text-white tab:flex-1">
                  {typo(`« ${st.message.texte} »`)}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-6 border-x-[8px] border-t-[8px] border-x-transparent border-t-paper-2 transition-colors duration-300 group-hover:border-t-trait"
                  />
                </p>
                <span className="mt-7 inline-flex items-center gap-2 font-semibold text-trait">
                  {st.bouton} <Fleche />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Les réseaux, en cartes, avec la date de leurs chiffres. */}
      <Section labelledBy="t-reseaux" surface="paper-2">
        <h2 id="t-reseaux" className={T2}>
          Réseaux
        </h2>
        <ul className={cx(ENTRE_BLOCS, "grid grid-cols-2 gap-3 tab:grid-cols-3 desk:grid-cols-5")}>
          {RESEAUX.map((r, i) => (
            <li key={r.nom} className={i % 3 === 1 ? "reveler-2" : i % 3 === 2 ? "reveler-3" : "reveler"}>
              <a
                href={r.href}
                className="group flex h-full flex-col border border-rule bg-paper p-5 transition-colors duration-300 hover:border-trait"
              >
                <span className="inline-flex items-center gap-2 font-semibold transition-colors group-hover:text-trait">
                  {r.nom} <Fleche />
                </span>
                {r.chiffre ? <span className="mt-1 text-small text-ink-2">{typo(r.chiffre.texte)}</span> : null}
              </a>
            </li>
          ))}
        </ul>
        <p className={cx(NOTE, "mt-4")}>{typo(`Chiffres au ${dateLongue(RELEVE_RESEAUX)}.`)}</p>
      </Section>
    </>
  );
}
