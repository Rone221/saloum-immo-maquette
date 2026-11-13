// Contact (recherche/allegement.md, partie 3). La page s'ouvre sur le bleu : le
// numéro en grand, WhatsApp, Appeler, le fixe, l'e-mail, l'agence. Puis les trois
// messages prêts, seul endroit du site où le texte des messages WhatsApp s'affiche,
// et les réseaux. Le pied n'a que sa ligne blanche (components/pied.tsx).
// Pas de formulaire (export statique), pas de carte, pas d'horaires : « Sur rendez-vous ».
// Les chiffres des réseaux s'affichent toujours avec la date de leur relevé.

import type { Metadata } from "next";
import { BoutonAppel, BoutonWhatsApp } from "@/components/boutons";
import { Cadre } from "@/components/photo";
import { Section } from "@/components/section";
import { LIBELLES, MESSAGES, type Message } from "@/content/messages";
import { AGENCE, EMAIL, FIXE, MOBILE, RELEVE_RESEAUX, RESEAUX } from "@/content/site";
import { cx } from "@/lib/base";
import { COLONNE, ENTRE_BLOCS, NOTE, SOUS_TITRE, T1, T2, T3 } from "@/lib/classes";
import { dateLongue, typo } from "@/lib/format";
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
            <h1 id="t-page" className={T1}>
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
        <ul className={cx(ENTRE_BLOCS, "grid gap-y-12 desk:grid-cols-3 desk:gap-x-12")}>
          {SITUATIONS.map((s) => (
            <li key={s.titre} className="flex flex-col">
              <h3 className={T3}>{typo(s.titre)}</h3>
              <p className="mt-3 text-ink-2 desk:flex-1">{typo(`« ${s.message.texte} »`)}</p>
              <BoutonWhatsApp
                label={s.bouton}
                message={s.message.texte}
                variante="contour"
                className="mt-6 self-start"
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Les réseaux, en une colonne, avec la date de leurs chiffres. */}
      <Section labelledBy="t-reseaux" surface="paper-2">
        <div className={COLONNE}>
          <h2 id="t-reseaux" className={T2}>
            Réseaux
          </h2>
          <ul className="mt-3 desk:mt-4">
            {RESEAUX.map((r) => (
              <li key={r.nom}>
                <a
                  href={r.href}
                  className="inline-flex min-h-11 items-center font-semibold text-trait underline decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {r.nom}
                </a>
                {r.chiffre ? <span className="text-ink-2">{typo(`, ${r.chiffre.texte}`)}</span> : null}
              </li>
            ))}
          </ul>
          <p className={cx(NOTE, "mt-4")}>{typo(`Chiffres au ${dateLongue(RELEVE_RESEAUX)}.`)}</p>
        </div>
      </Section>
    </>
  );
}
