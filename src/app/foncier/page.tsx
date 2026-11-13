// Comprendre le foncier (spécification 7.6). Ouverture classique, numéro 03.
// Pas de photo d'illustration : les échantillons de hachure sont l'illustration.
// La seule image est la vignette décorative du lien vers l'interview du DG (7.6, point 5).
// C'est une vérification proposée, jamais une garantie : ne pas écrire « nous garantissons ».
// Ne rien citer de l'interview au-delà de content/foncier.ts (pas de transcription fiable).
//
// Faits à valider avec le client, affichés sur cette page :
// - ligne Délibération, colonne Chez Saloum Immo : le service 01 verbatim, en attendant
//   que le client valide (ou non) « Accompagnement vers le bail, puis le titre foncier » ;
// - « Saloum Immo Consulting » : le carrousel du 08.07.2026 est signé de ce nom, absent
//   de contenu-maquette.md ; la source le dit « publiés par Saloum Immo sur Instagram » ;
// - formulation des deux listes « Ce que nous faisons » et « Avant d'acheter, vérifiez avec nous » ;
// - message WhatsApp « Bonjour, je voudrais faire vérifier les documents d'un terrain. »,
//   proposé par la spécification (absent du prototype) ;
// - image de l'interview (capture du reel du 08.06.2026), en vignette : statut à valider ;
// - cartouche, commun à toutes les pages : siège « Sicap Keur Massar, Sangalkam, Dakar ».

import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { DocTable } from "@/components/doc-table";
import { PageHead } from "@/components/page-head";
import { Section } from "@/components/section";
import { TexteFait } from "@/components/texte";
import { TextLink } from "@/components/text-link";
import { Ticks } from "@/components/ticks";
import { VideoLink } from "@/components/video-link";
import { Warn } from "@/components/warn";
import { AVANT_D_ACHETER, AVERTISSEMENT_STATUT, CE_QUE_NOUS_FAISONS, SOURCE_DEFINITIONS } from "@/content/foncier";
import { MESSAGES } from "@/content/messages";
import { FONDATEUR } from "@/content/site";
import { VIDEOS } from "@/content/videos";
import { metaPage } from "@/lib/meta";

const TITRE = "Comprendre le foncier";
const DESCRIPTION =
  "Délibération, bail ou titre foncier : ce que dit chaque document et son niveau de sécurité, publiés par Saloum Immo. Ce que nous faisons, et ce que vous pouvez vérifier avec nous avant de payer.";

export const metadata: Metadata = metaPage(TITRE, DESCRIPTION);

export default function Foncier() {
  return (
    <>
      <Section labelledBy="t-foncier">
        <PageHead
          numero="03"
          titre="Le bon papier avant le bon prix."
          titreId="t-foncier"
          intro="Avant de payer, sachez quel document vous achetez. Voici ce que nous faisons, et ce que vous pouvez vérifier avec nous."
        />

        {/* Deux listes : col. 2 à 6 et 8 à 12 au bureau, 1 à 6 et 7 à 12 sur tablette. */}
        <div className="grid gap-y-9 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-10">
          <Ticks
            titre={CE_QUE_NOUS_FAISONS.titre}
            lignes={CE_QUE_NOUS_FAISONS.lignes}
            niveau={2}
            className="tab:col-[1/span_6] desk:col-[2/span_5]"
          />
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

        {/* Tableau des documents : 104 px au-dessus, 56 sur mobile (2.4). */}
        <div id="documents" className="mt-14 tab:mt-26">
          <DocTable />
          <Warn>{AVERTISSEMENT_STATUT}</Warn>

          {/* Sources (3.15) : la publication des définitions, puis l'interview du DG. */}
          <div className="mt-9 grid gap-y-3 border-t border-rule pt-4 tab:mt-12 tab:grid-cols-12 tab:gap-x-6 tab:pt-5">
            <p className="font-mono text-1 leading-label font-medium text-ink-2 tab:col-span-full desk:col-span-1">
              Sources
            </p>
            <p className="text-2 leading-caption text-ink-2 tab:col-span-6 desk:col-[2/span_5]">
              <TexteFait fait={SOURCE_DEFINITIONS} />
            </p>
            {/* Vignette 16:9 d'une image 16:9 : un zoom de 1,25 depuis le coin haut droit sort
                du cadre le logo incrusté (x 28 à 147 sur 899, en haut à gauche) et rogne le bas,
                pas le haut : le crâne de Babacar Ndiaye reste entier (4.1, 4.3). */}
            <VideoLink
              video="interviewDG"
              photo={FONDATEUR.interview.photo}
              zoom={{ echelle: 1.25, origine: "right top" }}
              className="mt-2 tab:col-[7/span_6] tab:mt-0 desk:col-[8/span_5]"
            />
          </div>
        </div>
      </Section>

      <ContactBand message={MESSAGES.foncier.texte} />
    </>
  );
}
