import Link from "next/link";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { MENTIONS_PUBLIEES } from "@/content/pages/mentions-legales";
import { AGENCE, EMAIL, MOBILE, RAISON_SOCIALE, SLOGAN } from "@/content/site";
import { asset, cx } from "@/lib/base";
import { T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { BoutonAppel, BoutonWhatsApp } from "./boutons";
import { LiensRubriques, SaufSurContact } from "./nav-links";

/**
 * Pied de contact (allegement.md, 2.10) : la bande « Parlons de votre terrain » et
 * le pied de page fusionnés. Un bloc bleu, puis une ligne blanche. Ni grille, ni
 * cadre, ni étiquette. 400 px au plus au bureau, 650 sur mobile.
 * Sur la page Contact, la ligne blanche seule : la page s'ouvre déjà sur le bleu.
 */
export function Pied() {
  return (
    <footer id="pied">
      <SaufSurContact>
        <BlocContact />
      </SaufSurContact>
      <LignePied />
    </footer>
  );
}

/**
 * Le bloc bleu. Le numéro en grand (lien tel:), « Écrire sur WhatsApp » avec le
 * message de la question générale, « Appeler », l'agence et l'e-mail.
 */
function BlocContact() {
  const titreId = "t-pied-contact";
  return (
    <section aria-labelledby={titreId} className="bg-trait text-white [&_:focus-visible]:outline-white">
      <div className="wrap grid gap-y-5 py-10 tab:grid-cols-2 tab:items-center tab:gap-x-6 tab:gap-y-6 tab:py-14 desk:grid-cols-12">
        <div className="desk:col-span-5">
          <h2 id={titreId} className="text-h3 leading-snug font-semibold">
            Parlons de votre terrain
          </h2>
          <a
            href={MOBILE.href}
            className={cx(T2, "mt-1 inline-flex min-h-11 items-center font-bold decoration-2 underline-offset-8 hover:underline")}
          >
            {typo(MOBILE.long)}
          </a>
        </div>
        {/* Sous 761 px, les deux boutons remplissent la ligne ensemble. */}
        <div className="flex flex-wrap gap-3 desk:col-span-4">
          <BoutonWhatsApp
            label={LIBELLES.question}
            message={MESSAGES.question.texte}
            variante="inverse"
            bloc={false}
            className="grow tab:grow-0"
          />
          <BoutonAppel variante="ligne" bloc={false} className="grow tab:grow-0" />
        </div>
        <div className="text-white/90 desk:col-span-3">
          <p>{typo(`Agence : ${AGENCE.texte}`)}</p>
          <a href={EMAIL.href} className="inline-flex min-h-11 items-center text-white underline decoration-1 underline-offset-4 hover:decoration-2">
            {EMAIL.adresse}
          </a>
        </div>
      </div>
    </section>
  );
}

/** La ligne blanche : logo, les six rubriques, la raison sociale et la devise. */
function LignePied() {
  return (
    <div className="wrap pt-7 pb-8 tab:pt-10 tab:pb-10">
      <div className="flex flex-col gap-3 tab:gap-4 desk:flex-row desk:items-center desk:justify-between desk:gap-10">
        <Link href="/" aria-label="Saloum Immo, accueil" className="inline-flex flex-none self-start">
          {/* Logo officiel complet, jamais recoloré : variantes réduites par scripts/photos.mjs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/2269-logo-176.png")}
            srcSet={`${asset("/2269-logo-176.png")} 176w, ${asset("/2269-logo-352.png")} 352w`}
            sizes="(min-width: 761px) 88px, 64px"
            width={176}
            height={133}
            loading="lazy"
            alt=""
            className="h-auto w-16 tab:w-22"
          />
        </Link>
        {/* Deux colonnes égales sur mobile, une ligne dès 761 px. */}
        <nav aria-label="Plan du site">
          <ul className="grid grid-cols-2 gap-x-5 tab:flex tab:flex-wrap tab:gap-x-6">
            <LiensRubriques className="inline-flex min-h-11 items-center hover:text-trait hover:underline hover:underline-offset-4" />
          </ul>
        </nav>
      </div>
      <p className="mt-3 text-small text-ink-2 tab:mt-4">
        {RAISON_SOCIALE.texte} · {typo(SLOGAN.texte)}
        {/* Pas de lien tant que la page n'est pas publiée. */}
        {MENTIONS_PUBLIEES ? (
          <>
            {" · "}
            <Link href="/mentions-legales/" className="underline underline-offset-4 hover:text-trait">
              Mentions légales
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
