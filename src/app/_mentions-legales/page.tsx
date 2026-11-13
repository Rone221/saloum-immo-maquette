// Mentions légales (spécification 7.9). Ouverture classique, sans numéro.
// Seuls la raison sociale, le téléphone et l'e-mail sont connus (content/site.ts).
// Le siège exact, le NINEA, le RCCM, le directeur de la publication et l'hébergeur
// doivent venir de Saloum Immo : ils sont en pointillés, rien n'est inventé.
//
// PAS PUBLIÉE : « La page n'est pas publiée tant qu'elle contient un champ vide »
// (7.9). Le dossier s'appelle _mentions-legales : un dossier préfixé par « _ » est
// privé, Next n'en fait pas de route. Le cartouche n'affiche le lien que si
// MENTIONS_PUBLIEES est vrai (content/pages/mentions-legales.ts). Pour publier :
// remplir les lignes `manque`, puis renommer le dossier en mentions-legales.
// La page reste hors index (robots), comme le reste de la maquette.
//
// Faits à valider avec le client, affichés sur cette page :
// - le contenu entier des mentions légales (spécification 9.5) ;
// - cartouche, commun à toutes les pages : siège « Sicap Keur Massar, Sangalkam,
//   Dakar » (plusieurs adresses circulent).

import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { PageHead } from "@/components/page-head";
import { Section } from "@/components/section";
import { MESSAGES } from "@/content/messages";
import { EDITEUR, HEBERGEMENT, MANQUES } from "@/content/pages/mentions-legales";
import { EMAIL, MOBILE, RAISON_SOCIALE } from "@/content/site";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import { FicheMentions } from "./_composants/fiche-mentions";

const TITRE = "Mentions légales";
const DESCRIPTION = `Éditeur du site : ${RAISON_SOCIALE.texte}. Téléphone ${MOBILE.long}, e-mail ${EMAIL.adresse}.`;

// robots écrit ici et pas seulement dans le layout : la page ne s'indexe pas tant
// qu'une mention manque.
export const metadata: Metadata = metaPage(TITRE, DESCRIPTION, { robots: { index: false, follow: false } });

/** « le siège exact, le NINEA et l'hébergeur » */
function enListe(elements: string[]): string {
  if (elements.length < 2) return elements.join("");
  return `${elements.slice(0, -1).join(", ")} et ${elements[elements.length - 1]}`;
}

function intro(): string {
  const editeur = `Le site est édité par ${RAISON_SOCIALE.texte}.`;
  if (MANQUES.length === 0) return editeur;
  const liste = enListe(MANQUES);
  const verbe = MANQUES.length === 1 ? "sera ajouté" : "seront ajoutés";
  return `${editeur} ${liste.charAt(0).toUpperCase()}${liste.slice(1)} ${verbe} avant la mise en ligne.`;
}

const TITRE_BLOC = "mb-3 text-5 leading-snug font-bold stretch-sub tab:mb-4";

export default function MentionsLegales() {
  return (
    <>
      <Section labelledBy="t-page">
        <PageHead titre={TITRE} titreId="t-page" intro={intro()} />

        {/* Même grille que l'en-tête : l'éditeur sous le titre (col. 2 à 7),
            l'hébergement sous l'intro (col. 8 à 12). */}
        <div className="grid gap-y-10 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-14">
          <section aria-labelledby="t-editeur" className="tab:col-[2/span_10] desk:col-[2/span_6]">
            <h2 id="t-editeur" className={TITRE_BLOC}>
              Éditeur du site
            </h2>
            <FicheMentions lignes={EDITEUR} />
          </section>
          <section aria-labelledby="t-hebergement" className="tab:col-[2/span_10] desk:col-[8/span_5]">
            <h2 id="t-hebergement" className={TITRE_BLOC}>
              Hébergement
            </h2>
            <FicheMentions lignes={HEBERGEMENT} />
            {MANQUES.length > 0 ? (
              <p className="mt-4 flex items-center gap-2.5 font-mono text-1 leading-label font-medium text-ink-2">
                <span className="dots-x block w-8.5 flex-none text-ink" aria-hidden="true" />
                {typo("Pointillés : à compléter")}
              </p>
            ) : null}
          </section>
        </div>
      </Section>

      <ContactBand message={MESSAGES.question.texte} />
    </>
  );
}
