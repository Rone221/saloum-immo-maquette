import { MOBILE } from "@/content/site";
import { typo } from "@/lib/format";
import { BoutonsContact } from "./contact-section";
import { Section } from "./section";

/**
 * Bande de contact (3.18) au pied des pages intérieures (toutes sauf Accueil et
 * Contact), juste avant le cartouche. Fond bleu, une rangée : la phrase, le
 * numéro, le bouton WhatsApp avec le message propre à la page, le bouton Appeler.
 * Pas de photo.
 */
export function ContactBand({
  message,
  template = false,
  phrase = "Parlons de votre terrain.",
  bouton = "Écrire sur WhatsApp",
  titreId = "t-contact-bande",
}: {
  /** Message propre à la page (content/messages.ts). */
  message: string;
  /** true pour le gabarit propriétaire. */
  template?: boolean;
  phrase?: string;
  bouton?: string;
  titreId?: string;
}) {
  return (
    <Section labelledBy={titreId} surface="trait" rythme="bande">
      <div className="flex flex-col gap-6 desk:flex-row desk:items-start desk:justify-between desk:gap-10">
        <div>
          <h2 id={titreId} className="text-5 leading-snug font-bold stretch-sub">
            {typo(phrase)}
          </h2>
          <a
            href={MOBILE.href}
            className="mt-2 inline-flex min-h-11 flex-wrap items-baseline gap-x-2.5 text-6 leading-title font-bold tracking-tight text-white stretch-title decoration-[3px] underline-offset-8 hover:underline"
          >
            <span className="font-mono text-2 leading-tight font-medium tracking-[0]">+221</span>
            {typo(MOBILE.court)}
          </a>
        </div>
        {/* Sous 761 px : le message sous le bouton WhatsApp qui l'enverra, puis « Appeler ». */}
        <div>
          <BoutonsContact message={message} template={template} bouton={bouton} className="" />
        </div>
      </div>
    </Section>
  );
}
