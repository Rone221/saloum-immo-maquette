// Page introuvable (spécification 7, plan des pages) : ouverture classique, sans
// numéro. Les six rubriques au dessin des lignes du menu mobile (numéro en mono
// trait, libellé en 85 %, filet fin), puis la bande de contact.
//
// Next envoie ce fichier avec chaque page du site : composants serveur seulement,
// rien d'interactif.
//
// Faits à valider avec le client, affichés sur cette page : aucun en propre.
// La bande de contact et le cartouche portent ceux de toutes les pages (siège).

import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand } from "@/components/contact-band";
import { PageHead } from "@/components/page-head";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { MESSAGES } from "@/content/messages";
import { NAVIGATION } from "@/content/site";
import { enLettres } from "@/lib/format";
import { metaPage } from "@/lib/meta";

// robots: null : Next pose déjà sa propre balise « noindex » sur la page 404.
// Celle du layout (« noindex, nofollow ») en ferait une seconde.
export const metadata: Metadata = metaPage(
  "Page introuvable",
  "Cette adresse ne mène à aucune page du site de Saloum Immo.",
  { robots: null },
);

export default function Introuvable() {
  return (
    <>
      <Section labelledBy="t-introuvable">
        <PageHead
          titre="Page introuvable"
          titreId="t-introuvable"
          intro="Cette adresse ne mène à aucune page du site. Choisissez une rubrique, ou écrivez-nous sur WhatsApp."
        />
        {/* Deux colonnes de trois dès 761 px, lues de haut en bas, posées sur la grille
            de l'en-tête : sous le titre (col. 2 à 7) et sous l'intro (col. 8 à 12). */}
        <nav aria-labelledby="t-rubriques" className="tab:grid tab:grid-cols-12 tab:gap-x-6">
          <p
            id="t-rubriques"
            className="border-b-[1.5px] border-ink pb-2.5 font-mono text-1 leading-caption font-medium text-ink-2 tab:col-span-full desk:col-[2/-1]"
          >
            {`${enLettres(NAVIGATION.length)} rubriques`}
          </p>
          <ol className="tab:col-span-full tab:grid tab:grid-flow-col tab:grid-cols-subgrid tab:grid-rows-[repeat(3,auto)]">
            {NAVIGATION.map((r, i) => (
              <li
                key={r.href}
                className={
                  i < NAVIGATION.length / 2
                    ? "tab:col-[1/span_6] desk:col-[2/span_6]"
                    : "tab:col-[7/span_6] desk:col-[8/span_5]"
                }
              >
                <Link
                  href={r.href}
                  className="flex min-h-14 w-full items-baseline gap-4 border-b border-rule py-3.5 text-5 leading-snug font-650 stretch-sub decoration-[1.5px] underline-offset-6 hover:text-trait hover:underline"
                >
                  <span className="font-mono text-1 leading-tight font-medium text-trait">{r.numero}</span>
                  {r.libelle}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="tab:grid tab:grid-cols-12 tab:gap-x-6">
          <TextLink href="/" className="mt-3 tab:col-span-full tab:mt-5 tab:justify-self-start desk:col-[2/-1]">
            Retour à l’accueil
          </TextLink>
        </div>
      </Section>
      <ContactBand message={MESSAGES.question.texte} />
    </>
  );
}
