import { MESSAGES } from "@/content/messages";
import { AGENCE, EMAIL, FIXE, MOBILE, RELEVE_RESEAUX, RESEAUX } from "@/content/site";
import { cx } from "@/lib/base";
import { dateMono, typo } from "@/lib/format";
import { PHOTOS } from "@/content/photos";
import { CallButton } from "./call-button";
import { Photo } from "./photo";
import { Section } from "./section";
import { MessagePreview, WhatsAppButton } from "./whatsapp-button";

const LIEN_COORD = "inline-flex min-h-11 items-center text-white underline-offset-5 hover:underline";

/**
 * Section contact (3.18), sur le bleu du logo : numéro géant (lien tel:),
 * « Écrire sur WhatsApp » et « Appeler », le message envoyé, les coordonnées
 * (liens de 44 px), les réseaux avec la date du relevé de leurs chiffres
 * (abonnés et vidéos), la photo de l'agence.
 * Accueil (H2) et page Contact (H1). Pas d'horaires (inconnus), pas de carte.
 *
 * La photo est 2352-haut : le bas de 2352 montre l'affiche de la vitrine avec le
 * fixe 33 807 87 18, à côté du 33 805 87 18 de la liste. Sous 761 px, le message
 * se pose sous le bouton WhatsApp qui l'enverra, avant « Appeler » (3.3).
 */
export function ContactSection({
  id = "contact",
  titreId = "t-contact",
  numero = "06",
  titre = "Parlons de votre terrain.",
  niveau = 2,
  message = MESSAGES.question.texte,
}: {
  id?: string;
  titreId?: string;
  numero?: string;
  titre?: string;
  niveau?: 1 | 2;
  /**
   * null : bouton sans texte pré-rempli, comme celui de l'en-tête (page Contact, où
   * la liste des trois messages prêts suit et donne déjà celui-ci).
   */
  message?: string | null;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";
  return (
    <Section id={id} labelledBy={titreId} surface="trait" rythme="contact">
      <div className="tab:grid tab:grid-cols-12 tab:gap-x-6">
        <div className="border-t-2 border-white pt-4 tab:col-[1/span_7] tab:pt-5">
          <span className="mt-2.5 mb-4 block font-mono text-1 leading-tight font-medium tab:mt-3.5 tab:mb-5.5">
            {numero}
          </span>
          <Titre
            id={titreId}
            className={cx(
              "font-bold stretch-title",
              niveau === 1 ? "text-7 leading-title tracking-title" : "text-6 leading-title tracking-tight",
            )}
          >
            {typo(titre)}
          </Titre>
          <p className="mt-7 mb-1.5 font-mono text-1 leading-label font-medium text-white/88 tab:mt-10">
            WhatsApp et mobile
          </p>
          <a
            href={MOBILE.href}
            className="inline-flex min-h-11 flex-wrap items-baseline gap-x-2.5 text-7 leading-tight font-bold tracking-tight text-white stretch-title decoration-[3px] underline-offset-8 hover:underline tab:gap-x-3.5"
          >
            <span className="font-mono text-2 leading-tight font-medium tracking-[0] tab:text-4">+221</span>
            {typo(MOBILE.court)}
          </a>
          <BoutonsContact message={message} />

          <dl className="mt-7 border-t-[1.5px] border-white tab:mt-10">
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 border-b border-white/35 py-1 tab:grid-cols-[112px_minmax(0,1fr)]">
              <dt className="pt-3.75 font-mono text-1 leading-label font-medium text-white/88">Fixe</dt>
              <dd className="text-4 leading-label font-semibold stretch-sub">
                <a href={FIXE.href} className={LIEN_COORD}>
                  {typo(FIXE.court)}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 border-b border-white/35 py-1 tab:grid-cols-[112px_minmax(0,1fr)]">
              <dt className="pt-3.75 font-mono text-1 leading-label font-medium text-white/88">E-mail</dt>
              <dd className="min-w-0 text-4 leading-label font-semibold break-words stretch-sub">
                <a href={EMAIL.href} className={LIEN_COORD}>
                  {EMAIL.adresse}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 border-b border-white/35 py-3 tab:grid-cols-[112px_minmax(0,1fr)]">
              <dt className="pt-1 font-mono text-1 leading-label font-medium text-white/88">Agence</dt>
              <dd className="text-4 leading-label font-semibold stretch-sub">{typo(AGENCE.texte)}</dd>
            </div>
          </dl>

          {/* Deux colonnes dès 1 101 px seulement : entre 761 et 1 100 px, la colonne
              de texte est trop étroite et « 46 000 abonnés » passait sur deux lignes. */}
          <ul aria-label="Réseaux sociaux" className="mt-4 grid tab:mt-7 desk:grid-cols-2 desk:gap-x-6">
            {RESEAUX.map((r) => (
              <li key={r.nom}>
                <a
                  href={r.href}
                  className="group flex min-h-11 items-center justify-between gap-3 border-b border-white/35 py-2 font-semibold text-white tab:min-h-12"
                >
                  <span className="underline-offset-5 group-hover:underline">{r.nom}</span>
                  <span className="font-mono text-1 leading-tight font-medium whitespace-nowrap text-white/88">
                    {typo(r.repere.texte)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 font-mono text-1 leading-label font-medium text-white/88">
            Chiffres relevés le {dateMono(RELEVE_RESEAUX)}
          </p>
        </div>

        <figure className="m-0 mt-9 flex flex-col tab:col-[8/span_5] tab:mt-0 desk:col-[9/span_4]">
          {/* Photo paysage (1 080 × 650) dans un cadre portrait : sizes donne la largeur
              dessinée. Bureau : environ 1 300 px, calée sur la hauteur de la colonne de texte. */}
          <span className="relative block aspect-[4/3] overflow-hidden tab:aspect-[4/5] desk:aspect-auto desk:min-h-90 desk:flex-1">
            {/* Page Contact (H1) : la section ouvre la page, sa photo est préchargée (4.2). */}
            <Photo
              id="2352-haut"
              fill
              preload={niveau === 1}
              sizes="(min-width: 1101px) 1300px, (min-width: 761px) 80vw, calc((100vw - 40px) * 1.25)"
              className="object-cover"
            />
          </span>
          <figcaption className="mt-2.5 text-2 leading-caption text-white/90">
            {typo(PHOTOS["2352-haut"].legende ?? "")}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}

/**
 * Bouton WhatsApp, son message, bouton Appeler (contact et bande de contact).
 * Sous 761 px, les boutons s'empilent : le message suit le bouton WhatsApp, à 10 px,
 * puis vient « Appeler ». Dès 761 px, les deux boutons sont côte à côte et le message
 * passe dessous, sous le bouton WhatsApp.
 */
export function BoutonsContact({
  message,
  template = false,
  bouton = "Écrire sur WhatsApp",
  className = "mt-7",
}: {
  message?: string | null;
  template?: boolean;
  bouton?: string;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col tab:flex-row tab:flex-wrap tab:gap-x-3", className)}>
      <WhatsAppButton label={bouton} message={message ?? undefined} template={template} tone="inv" apercu={false} />
      {message ? (
        <MessagePreview texte={typo(message)} template={template} tone="inv" className="tab:order-last tab:basis-full" />
      ) : null}
      <CallButton variant="line" className="mt-3 tab:mt-0" />
    </div>
  );
}
