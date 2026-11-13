// Diaspora (spécification 7.5) : acheter depuis l'étranger. Ouverture « appel
// et vidéo » (bande paper-2, comme la section 04 de l'accueil), cheminement en
// quatre stations, les deux listes du foncier, les six vidéos (#videos), les
// programmes en bref, puis la bande de contact.
//
// Ne jamais écrire « EXCLUSIF DIASPORA ». Ne rien promettre qui n'est pas publié :
// ni paiement à distance, ni échéancier, ni procuration, ni visite vidéo en direct.
//
// Faits à valider avec le client, affichés sur cette page :
// - vignette du reel du 27.10.2026 : droit à l'image de la collaboratrice
//   (personne n'est nommé) ;
// - station 3 : « Un notaire agréé suit chaque étape. » (TikTok du 15.10.2025),
//   présenté comme un accompagnement, pas comme une garantie ;
// - formulation des deux listes « Ce que nous faisons » et « Avant d'acheter,
//   vérifiez avec nous » ;
// - « Sicap Keur Massar, les lots » : vidéo titrée « Paradise City » par le client
//   (nom à valider) ;
// - Lac Town : statut foncier non publié, écrit « à demander ».

import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { ListeProgrammes, versLien } from "@/components/liste-programmes";
import { OuvertureAppel } from "@/components/ouverture-appel";
import { PathSteps } from "@/components/path-steps";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { Ticks } from "@/components/ticks";
import { WatchList } from "@/components/watch-list";
import { AVANT_D_ACHETER, CE_QUE_NOUS_FAISONS } from "@/content/foncier";
import { PROGRAMMES } from "@/content/programmes";
import { APPEL_DIASPORA } from "@/content/services";
import { VIDEOS } from "@/content/videos";
import { metaPage } from "@/lib/meta";

const DESCRIPTION =
  "Vous vivez hors du Sénégal : écrivez à Saloum Immo sur WhatsApp, regardez les terrains en vidéo, vérifiez les documents avec nous, visitez sur place sur rendez-vous.";

export const metadata: Metadata = metaPage(APPEL_DIASPORA.titre, DESCRIPTION);

export default function Diaspora() {
  return (
    <>
      {/* 04 Acheter depuis l'étranger : ouverture appel et vidéo. La vignette du reel
          est l'image d'ouverture : préchargée (4.2). Les stations sont des H2. */}
      <Section labelledBy="t-diaspora" surface="paper-2">
        <OuvertureAppel {...APPEL_DIASPORA} numero="04" titreId="t-diaspora" niveau={1} preload />
        <PathSteps avecSuite niveau={2} />
      </Section>

      {/* Les deux listes du foncier, sans en-tête (7.5, point 3) : le titre et l'intro de la
          page Foncier, repris ici, faisaient la troisième occurrence du même bloc sur le site.
          Les titres de colonne sont des H2. */}
      <div id="documents" className="wrap pt-14 tab:pt-28">
        <div className="grid gap-y-9 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-10">
          <Ticks
            titre={CE_QUE_NOUS_FAISONS.titre}
            lignes={CE_QUE_NOUS_FAISONS.lignes}
            niveau={2}
            className="tab:col-[1/span_6] desk:col-[2/span_5]"
          >
            <TextLink href="/foncier/" className="mt-1.5">
              Délibération, bail, titre foncier : la différence
            </TextLink>
          </Ticks>
          <Ticks
            titre={AVANT_D_ACHETER.titre}
            lignes={AVANT_D_ACHETER.lignes}
            niveau={2}
            className="tab:col-[7/span_6] desk:col-[8/span_5]"
          >
            <TextLink href={VIDEOS.nicad.href} className="mt-1.5">
              {`${VIDEOS.nicad.titre}, ${VIDEOS.nicad.duree}`}
            </TextLink>
          </Ticks>
        </div>
      </div>

      {/* À regarder avant d'appeler (#videos), puis les programmes en bref */}
      <Section labelledBy="t-videos" rythme="aucun" className="pt-14 tab:pt-24">
        <WatchList marge="" />
      </Section>
      <Section id="programmes" labelledBy="t-programmes" rythme="aucun" className="pt-9 pb-16 tab:pt-16 tab:pb-30">
        {/* Au gabarit de la liste des vidéos qu'elle suit : titre à gauche, lignes à droite. */}
        <ListeProgrammes
          titre="Les programmes en bref"
          titreId="t-programmes"
          liens={PROGRAMMES.map((p) => versLien(p, { lieu: true }))}
          variante="gauche"
        />
      </Section>

      <ContactBand message={APPEL_DIASPORA.message} bouton={APPEL_DIASPORA.bouton} />
    </>
  );
}
