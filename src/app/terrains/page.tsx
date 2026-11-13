// Terrains (spécification 7.2) : ouverture classique, clé des quatre statuts,
// catalogue des quatre offres, les trois programmes comme sur l'accueil, l'offre
// datée AIBD, les autres sites publiés, la phrase d'honnêteté, la bande de contact.
// Pas de filtres, pas de recherche, pas de tri : il y a trois programmes.
//
// Faits à valider avec le client, affichés sur cette page :
// - rattachement de la photo 2580 à Lac Town (légendée sans nom de lieu) ;
// - Lac Town : surfaces 150 à 450 m² et équipements, dits à l'oral le 21.05.2026 ;
// - Sicap Keur Massar : nom « Paradise City », disponibilité des lots publiés en 2026,
//   photo 2616 (probablement ce secteur, légendée sans nom) ;
// - Recasement AIBD : disponibilité en 2026 (offre d'avril 2025, prix de cette date) ;
// - Bayakh et Niague : statut foncier et disponibilité inconnus (échantillon
//   « Statut non publié »), et les deux messages WhatsApp proposés par la spécification.
//
// Jamais sur cette page : Kounoune 2 (peut-être Sakina City) ni son prix de 2024.

import type { Metadata } from "next";
import { CatalogueTable } from "@/components/catalogue-table";
import { ContactBand } from "@/components/contact-band";
import { DatedOffer } from "@/components/dated-offer";
import { StatusKey } from "@/components/dessins/status-key";
import { PageHead } from "@/components/page-head";
import { ProgrammeBlock } from "@/components/programme-block";
import { Section } from "@/components/section";
import { Warn } from "@/components/warn";
import { AVERTISSEMENT_STATUT } from "@/content/foncier";
import { MESSAGES } from "@/content/messages";
import { AUTRES_SITES, PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { dateLongue, enLettres } from "@/lib/format";
import { metaPage } from "@/lib/meta";

const TITRE = "Terrains disponibles";

/** « Lac Town, Sakina City et Sicap Keur Massar » */
const NOMS = PROGRAMMES.map((p) => p.nom).reduce((liste, nom, i, tous) =>
  i === tous.length - 1 ? `${liste} et ${nom}` : `${liste}, ${nom}`,
);

const DESCRIPTION = `${NOMS}, autour de Dakar, et l’offre ${RECASEMENT_AIBD.nom} d’${dateLongue(
  RECASEMENT_AIBD.texte.date ?? "",
)}. Statut foncier, surfaces publiées et travaux déjà faits. Prix sur demande, par WhatsApp.`;

export const metadata: Metadata = metaPage(TITRE, DESCRIPTION);

export default function Terrains() {
  return (
    <>
      <Section labelledBy="t-page">
        <PageHead
          numero="01"
          titre={TITRE}
          titreId="t-page"
          intro={`${enLettres(PROGRAMMES.length)} programmes en vente autour de Dakar. Les prix ne sont pas publiés : demandez-les par WhatsApp, lot par lot.`}
        >
          <StatusKey etats={["delib", "bail", "tf", "non-publie"]} />
        </PageHead>

        <CatalogueTable titreId="t-page" />

        {/* Les trois programmes, identiques à l'accueil. Pas de H2 au-dessus d'eux
            sur cette page : leur nom passe en H2, juste sous le H1. */}
        <div className="mt-14 tab:mt-28">
          {PROGRAMMES.map((p, i) => (
            <ProgrammeBlock key={p.slug} programme={p} niveau={2} premier={i === 0} />
          ))}
        </div>

        <DatedOffer offre={RECASEMENT_AIBD} as="article" lienFiche className="mt-10 tab:mt-18" />

        <section aria-labelledby="t-autres-sites" className="mt-14 tab:mt-20">
          <h2 id="t-autres-sites" className="mb-4 text-5 leading-snug font-bold stretch-sub tab:mb-6">
            Autres sites publiés
          </h2>
          <ul>
            {AUTRES_SITES.map((o, i) => (
              <li key={o.slug} className={i > 0 ? "-mt-px" : undefined}>
                <DatedOffer offre={o} as="article" />
              </li>
            ))}
          </ul>
        </section>

        <Warn marge="mt-10 tab:mt-14">{AVERTISSEMENT_STATUT}</Warn>
      </Section>

      <ContactBand message={MESSAGES.question.texte} />
    </>
  );
}
