import Link from "next/link";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { MENTIONS_PUBLIEES } from "@/content/pages/mentions-legales";
import { AGENCE, EMAIL, MOBILE, RAISON_SOCIALE, SLOGAN } from "@/content/site";
import { asset } from "@/lib/base";
import { typo } from "@/lib/format";
import { BoutonWhatsApp } from "./boutons";
import { CaseCartouche, Cartouche } from "./cartouche";
import { LiensRubriques, SaufSurContact } from "./nav-links";

/** Un lien du pied : 44 px de haut, souligné, clair plein au survol. */
const LIEN = "inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-surface hover:text-fort hover:decoration-2";

/**
 * Pied de page (direction v4, pièce 16) : le bas de la coupe, sur le bleu de plan et
 * ses croisillons clairs. En haut, un trait de terrain en latérite vive, ses hachures
 * dessous, deux bornes plantées dessus, au droit des bords du contenu : la page tient
 * entre deux bornes. Puis le numéro en très grand, dans la voix des mesures, et le
 * bouton WhatsApp ; le cartouche à quatre cases ; les rubriques numérotées 01 à 06 ;
 * la devise en Besley italique, comme sur l'enseigne de l'agence ; la raison sociale
 * en étiquette, et le lien discret vers l'espace client de démonstration.
 * Sur la page Contact, le bloc du numéro saute : la page le donne déjà en titre.
 *
 * data-voie="sombre" : la voie de lecture passe en clair au-dessus du pied.
 */
export function Pied() {
  return (
    <footer id="pied" data-voie="sombre" className="croisillons-clairs relative bg-plan sur-plan">
      <TraitTerrain />
      <div className="wrap pt-14 pb-10 tab:pt-16 desk:pt-24 desk:pb-14">
        <SaufSurContact>
          <BlocNumero />
        </SaufSurContact>

        <Cartouche sur="plan" aria-label="Saloum Immo" className="tab:grid-cols-2 desk:grid-cols-4">
          <CaseCartouche cle="Entreprise">
            {/* Logo officiel complet, jamais recoloré : sur le plan, il lui faut sa plaque. */}
            <Link href="/" aria-label="Saloum Immo, accueil" className="mt-1 inline-flex rounded-1 bg-calque px-3.5 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/2269-logo-176.png")}
                srcSet={`${asset("/2269-logo-176.png")} 176w, ${asset("/2269-logo-352.png")} 352w, ${asset("/2269-logo-528.png")} 528w`}
                sizes="112px"
                width={176}
                height={133}
                loading="lazy"
                alt="Saloum Immo"
                className="h-auto w-28"
              />
            </Link>
          </CaseCartouche>
          <CaseCartouche cle="Agence">
            <p className="text-fort">{typo(AGENCE.texte)}</p>
          </CaseCartouche>
          <CaseCartouche cle="Téléphone et WhatsApp">
            <a href={MOBILE.href} className={`${LIEN} mesure text-fort`}>
              {typo(MOBILE.long)}
            </a>
          </CaseCartouche>
          <CaseCartouche cle="E-mail">
            <a href={EMAIL.href} className={`${LIEN} break-all text-fort`}>
              {EMAIL.adresse}
            </a>
          </CaseCartouche>
        </Cartouche>

        <nav aria-label="Plan du site" className="mt-8 desk:mt-10">
          <ol className="m-0 flex list-none flex-col p-0 tab:flex-row tab:flex-wrap tab:gap-x-9">
            <LiensRubriques />
          </ol>
        </nav>

        <div className="mt-8 grid gap-y-6 border-t border-ligne pt-8 desk:mt-10 desk:grid-cols-12 desk:items-end desk:gap-x-6 desk:pt-10">
          <p className="titre text-[clamp(1.625rem,3vw,2.5rem)] leading-[1.15] text-fort italic desk:col-span-7">
            {typo(SLOGAN.texte)}
          </p>
          <div className="desk:col-span-5 desk:justify-self-end desk:text-right">
            <p className="etiquette text-doux">{RAISON_SOCIALE.texte}</p>
            <ul className="m-0 mt-1 flex list-none flex-wrap gap-x-6 p-0 desk:justify-end">
              {/* Pas de lien tant que la page n'est pas publiée. */}
              {MENTIONS_PUBLIEES ? (
                <li>
                  <Link href="/mentions-legales/" className={`${LIEN} text-small`}>
                    Mentions légales
                  </Link>
                </li>
              ) : null}
              <li>
                {/* L'espace client est une maquette, hors menu : un lien simple, sans
                    préchargement de la page par next/link. */}
                <a href={asset("/admin/connexion/")} className={`${LIEN} text-small`}>
                  {typo("Espace client (démonstration)")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Le trait de terrain naturel : 2 px de latérite vive, les hachures du sol dessous
 * (45°, au pas de 8 px), et deux bornes en élévation, à demi dans le sol.
 */
function TraitTerrain() {
  const borne = "absolute -top-3 h-5 w-2.5 border border-encre bg-blanc";
  return (
    <div aria-hidden="true" className="relative">
      {/* Au-dessus des hachures : leur masque les ferait passer devant les bornes. */}
      <div className="wrap relative z-1">
        <span className={`${borne} left-(--spacing-gutter)`} />
        <span className={`${borne} right-(--spacing-gutter)`} />
      </div>
      <div className="h-0.5 bg-laterite-vive" />
      <div className="hachures h-6 text-laterite-vive/40" />
    </div>
  );
}

/** Le numéro, en très grand, et le bouton WhatsApp du site. */
function BlocNumero() {
  const titreId = "t-pied-contact";
  return (
    // La marge sous le bloc est la sienne : sur Contact, il saute et le cartouche remonte.
    <section
      aria-labelledby={titreId}
      className="mb-14 flex flex-col gap-y-7 desk:mb-20 desk:flex-row desk:items-end desk:justify-between desk:gap-x-6"
    >
      <div>
        <h2 id={titreId} className="etiquette text-doux">
          {typo("WhatsApp ou appel, au même numéro")}
        </h2>
        <a
          href={MOBILE.href}
          // Le numéro ne se coupe pas (espaces insécables) : sa taille suit la largeur
          // de l'écran. 33 px à 390, 89 px à 1 440. Au bureau, il laisse la place du
          // bouton sur sa ligne dès 1 101 px (68 px de corps, 25 px de marge).
          className="mesure mt-3 flex min-h-11 w-fit items-center text-[clamp(1.75rem,8.6vw,6rem)] leading-[0.95] text-fort transition-surface hover:text-accent desk:mt-4 desk:text-[clamp(4rem,6.2vw,6rem)]"
        >
          {typo(MOBILE.long)}
        </a>
      </div>
      <BoutonWhatsApp
        label={LIBELLES.question}
        message={MESSAGES.question.texte}
        className="whitespace-nowrap tab:self-start desk:mb-2 desk:flex-none desk:self-end"
      />
    </section>
  );
}
