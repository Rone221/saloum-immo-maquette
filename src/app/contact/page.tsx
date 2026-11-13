// Contact (spécification 7.8). Ouverture « sur le bleu » : la section contact
// complète, en page entière, titre en H1. Puis, sur le papier, trois messages
// prêts : acheter, faire aménager, depuis l'étranger, chacun avec le message
// qu'il enverra. Pas de formulaire (export statique, pas de serveur), pas de
// carte (adresse à valider), pas d'horaires (inconnus). Pas de bande de contact
// en pied : la page en est une.
//
// Le bouton WhatsApp du bloc bleu n'a pas de texte pré-rempli (comme celui de
// l'en-tête) : le message « question » est déjà le premier des trois messages prêts.
//
// Faits à valider avec le client, affichés sur cette page :
// - fixe 33 805 87 18 : 33 807 87 18 circule aussi (c'est celui de l'affiche de la
//   vitrine de l'agence ; la photo montrée, 2352-haut, est coupée au-dessus) ;
// - agence « Sicap Keur Massar, Sangalkam, Dakar. Sur rendez-vous. » (plusieurs
//   adresses circulent, horaires inconnus) ; même adresse dans le cartouche ;
// - chiffres des réseaux, relevés le 13.11.2026 (à mettre à jour ou à retirer).

import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { Section } from "@/components/section";
import { SectionHead } from "@/components/section-head";
import { TextLink } from "@/components/text-link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MESSAGES, type Message } from "@/content/messages";
import { PROGRAMMES } from "@/content/programmes";
import { AGENCE, EMAIL, FIXE, MOBILE } from "@/content/site";
import { enLettres, typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

type Situation = {
  titre: string;
  texte: string;
  bouton: string;
  message: Message;
  lien: { href: string; libelle: string };
};

/** Les trois messages de 7.8, dans l'ordre des publics : acheter, faire aménager, depuis l'étranger. */
const SITUATIONS: Situation[] = [
  {
    titre: "Acheter un terrain",
    texte: `${PROGRAMMES.map((p) => p.nom).join(", ")}. Prix sur demande.`,
    bouton: "Écrire sur WhatsApp",
    message: MESSAGES.question,
    lien: { href: "/terrains/", libelle: "Tous les terrains" },
  },
  {
    titre: "Faire aménager mon terrain",
    texte: "Vous avez une parcelle ou des hectares. Dites-nous où se trouve le terrain et sa surface.",
    bouton: "Décrire mon terrain sur WhatsApp",
    message: MESSAGES.proprietaire,
    lien: { href: "/amenager/", libelle: "Tout sur l’aménagement" },
  },
  {
    titre: "Acheter depuis l’étranger",
    texte: "Vous vivez hors du Sénégal. Tout commence à distance, sur WhatsApp, avec des vidéos et des documents.",
    bouton: "Commencer sur WhatsApp",
    message: MESSAGES.diaspora,
    lien: { href: "/diaspora/", libelle: "Acheter à distance, pas à pas" },
  },
];

const TITRE = "Contact";
const DESCRIPTION = `WhatsApp et mobile ${MOBILE.long}, fixe ${FIXE.court}, e-mail ${EMAIL.adresse}. Agence : ${AGENCE.texte} ${enLettres(SITUATIONS.length)} messages prêts à envoyer sur WhatsApp.`;

export const metadata: Metadata = metaPage(TITRE, DESCRIPTION);

export default function Contact() {
  return (
    <>
      {/* 06 Parlons de votre terrain : sur le bleu */}
      <ContactSection niveau={1} titreId="t-page" message={null} />

      {/* Trois messages prêts : une ligne par public, filet encre en tête, filets fins
          entre les lignes. Le texte sous le titre (col. 2 à 6), le bouton et son
          message sous l'intro (col. 8 à 12). Sur mobile : titre, bouton, message, lien. */}
      <Section id="messages" labelledBy="t-messages">
        <SectionHead
          titre={`${enLettres(SITUATIONS.length)} messages prêts à envoyer`}
          titreId="t-messages"
          intro="Choisissez votre situation. WhatsApp s’ouvre avec le message déjà écrit : relisez-le, complétez ce qui est entre crochets, puis envoyez-le."
        />
        <ul className="border-t-[1.5px] border-ink">
          {SITUATIONS.map((s) => (
            <li
              key={s.titre}
              className="grid gap-y-4 border-b border-rule py-6 tab:grid-cols-12 tab:grid-rows-[auto_1fr] tab:gap-x-6 tab:gap-y-1 tab:py-7"
            >
              <div className="tab:col-[1/span_6] tab:row-start-1 desk:col-[2/span_5]">
                <h3 className="text-4 leading-snug font-650 stretch-sub">
                  {typo(s.titre)}
                </h3>
                <p className="mt-1.5 max-w-[30em] text-2 leading-caption text-ink-2">{typo(s.texte)}</p>
              </div>
              <WhatsAppButton
                label={s.bouton}
                message={s.message.texte}
                template={s.message.gabarit}
                className="tab:col-[7/span_6] tab:row-[1/span_2] desk:col-[8/span_5]"
              />
              <TextLink
                href={s.lien.href}
                className="-mt-2 self-start justify-self-start tab:col-[1/span_6] tab:row-start-2 tab:mt-0 desk:col-[2/span_5]"
              >
                {s.lien.libelle}
              </TextLink>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
