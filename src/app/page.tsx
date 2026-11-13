// Accueil (spécification 7.1), dans l'ordre du prototype, avec deux allègements :
// la liste « À regarder avant d'appeler » part sur la page Diaspora, le tableau des
// documents part sur la page Foncier.
//
// Faits à valider avec le client, affichés sur cette page :
// - année de création 2022 (LinkedIn dit 2021) : « Saloum Immo · depuis 2022 »,
//   biographie du fondateur (« En 2022, il crée Saloum Immo. ») et frise : 2022 ;
// - lieu de la vue zénithale 2538 (légendée sans nom de lieu). D'après l'image, c'est le
//   même lotissement que 2580 et 2421 (Lac Town, à valider) : le bloc Lac Town de cette
//   page n'a donc pas la photo 2580, seulement la vignette 2421 de la visite commentée
//   (4.4 : jamais deux photos du même lotissement sur une page) ;
// - Lac Town : surfaces 150 à 450 m² et équipements, dits à l'oral le 21.05.2026 ;
// - Sicap Keur Massar : nom « Paradise City », disponibilité des lots publiés en 2026 ;
// - Recasement AIBD : disponibilité en 2026 (offre d'avril 2025) ;
// - lieux des photos 2542, 2355 et 2516 (légendées sans lieu) ;
// - registre : Millennium City (« travaux réalisés »), lieux non publiés ;
// - droit à l'image de la collaboratrice du reel du 27.10.2026 ;
// - siège « Sicap Keur Massar, Sangalkam, Dakar », fixe 33 805 87 18 (33 807 87 18 circule
//   aussi : c'est celui de l'affiche de la vitrine, que la photo 2352-haut laisse hors cadre) ;
// - « Paradise City » : le site ne parle pas de « nos programmes » mais des terrains
//   que nous vendons (8 : jamais « notre programme » pour Paradise City) ;
// - compteurs des réseaux, relevés le 13.11.2026 ;
// - portrait HD de Babacar Ndiaye (l'image de l'interview fait 899 px de large).

import { ContactSection } from "@/components/contact-section";
import { Coupe } from "@/components/dessins/coupe";
import { StatusKey } from "@/components/dessins/status-key";
import { DatedOffer } from "@/components/dated-offer";
import { Niveaux } from "@/components/doc-table";
import { FounderBlock } from "@/components/founder-block";
import { Hero } from "@/components/hero";
import { OuvertureAppel } from "@/components/ouverture-appel";
import { OwnerBox } from "@/components/owner-box";
import { PathSteps } from "@/components/path-steps";
import { Planche } from "@/components/planche";
import { ProgrammeBlock } from "@/components/programme-block";
import { Registre } from "@/components/registre";
import { Section } from "@/components/section";
import { SectionHead } from "@/components/section-head";
import { TextLink } from "@/components/text-link";
import { Ticks } from "@/components/ticks";
import { Warn } from "@/components/warn";
import { AVANT_D_ACHETER, AVERTISSEMENT_STATUT, CE_QUE_NOUS_FAISONS } from "@/content/foncier";
import { LAC_TOWN, PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { APPEL_DIASPORA } from "@/content/services";
import { A_REGARDER, VIDEOS } from "@/content/videos";
import { enLettres } from "@/lib/format";

export default function Accueil() {
  const programmes = PROGRAMMES.map((p) => p.nom).join(", ");
  return (
    <>
      <Hero
        titre="Nous vendons des terrains. Et nous les aménageons nous-mêmes."
        chapeau="Terrassement, voies en latérite, eau avec SEN’EAU, électricité, bornage. Sur les terrains que nous vendons autour de Dakar, et sur ceux des propriétaires."
        entrees={[
          { href: "#terrains", titre: "Acheter un terrain", sousTitre: programmes },
          { href: "#proprietaires", titre: "Faire aménager mon terrain", sousTitre: "Vous avez une parcelle ou des hectares" },
        ]}
        diaspora={{
          // Une question au plus par page (6.1) : celle de l'encart propriétaires.
          // La ligne diaspora affirme.
          question: "Vous vivez à l’étranger :",
          lien: "achetez à distance, pas à pas",
          href: "/diaspora/",
        }}
      />

      {/* 01 Terrains disponibles */}
      <Section id="terrains" labelledBy="t-terrains">
        <SectionHead
          numero="01"
          titre="Terrains disponibles"
          titreId="t-terrains"
          intro={`${enLettres(PROGRAMMES.length)} programmes en vente autour de Dakar. Les prix ne sont pas publiés : demandez-les par WhatsApp, lot par lot.`}
        >
          <StatusKey />
        </SectionHead>
        {/* Lac Town sans sa photo 2580 : l'ouverture montre déjà ce lotissement (plan 2538). */}
        {PROGRAMMES.map((p, i) => (
          <ProgrammeBlock key={p.slug} programme={p} premier={i === 0} photoPrincipale={p.slug !== LAC_TOWN.slug} />
        ))}
        <DatedOffer offre={RECASEMENT_AIBD} lienFiche className="mt-10 tab:mt-18" />
        <TextLink href="/terrains/" className="mt-3 tab:mt-6">
          Tous les terrains
        </TextLink>
      </Section>

      {/* 02 Aménager la terre : ouverture dans le dessin */}
      <Section id="amenager" labelledBy="t-amenager" surface="paper-2" rythme="dessin">
        <Coupe
          numero="02"
          titre="Aménager la terre"
          titreId="t-amenager"
          intro="Sur nos terrains, le travail commence bien avant la vente. La coupe montre ce qui reste dans le sol une fois les engins partis."
        />
        <Planche />
        <OwnerBox className="mt-11 tab:mt-20" />
        <TextLink href="/amenager/" className="mt-3 tab:mt-6">
          Tout sur l’aménagement
        </TextLink>
      </Section>

      <Registre id="registre" />

      {/* 03 Le bon papier avant le bon prix */}
      <Section id="foncier" labelledBy="t-foncier">
        <SectionHead
          numero="03"
          titre="Le bon papier avant le bon prix."
          titreId="t-foncier"
          intro="Avant de payer, sachez quel document vous achetez. Voici ce que nous faisons, et ce que vous pouvez vérifier avec nous."
        />
        <div className="grid gap-y-9 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-10">
          <Ticks
            titre={CE_QUE_NOUS_FAISONS.titre}
            lignes={CE_QUE_NOUS_FAISONS.lignes}
            className="tab:col-[1/span_6] desk:col-[2/span_5]"
          />
          <Ticks
            titre={AVANT_D_ACHETER.titre}
            lignes={AVANT_D_ACHETER.lignes}
            className="tab:col-[7/span_6] desk:col-[8/span_5]"
          >
            <TextLink href={VIDEOS.nicad.href} className="mt-1.5">
              {`${VIDEOS.nicad.titre}, ${VIDEOS.nicad.duree}`}
            </TextLink>
          </Ticks>
        </div>
        <Niveaux />
        <Warn>{AVERTISSEMENT_STATUT}</Warn>
        <TextLink href="/foncier/" className="mt-2 tab:mt-4">
          Délibération, bail, titre foncier : la différence
        </TextLink>
      </Section>

      {/* 04 Acheter depuis l'étranger : ouverture appel et vidéo */}
      <Section id="diaspora" labelledBy="t-diaspora" surface="paper-2">
        <OuvertureAppel {...APPEL_DIASPORA} numero="04" titreId="t-diaspora" />
        <PathSteps />
        <TextLink href="/diaspora/#videos" className="mt-1 tab:mt-10">
          {`${enLettres(A_REGARDER.length)} vidéos à regarder avant d’appeler`}
        </TextLink>
      </Section>

      {/* 05 Babacar Ndiaye : ouverture image d'abord */}
      <Section id="fondateur" labelledBy="t-fondateur">
        <FounderBlock liens={<TextLink href="/a-propos/">L’entreprise et ses réalisations</TextLink>} />
      </Section>

      {/* 06 Parlons de votre terrain : sur le bleu */}
      <ContactSection />
    </>
  );
}
