// À propos (spécification 7.7). Ouverture « image d'abord » : le fondateur.
// Puis l'entreprise, ses réalisations (le registre complet et le bloc
// Millennium City), ses comptes sur les réseaux, et la bande de contact.
// Personne n'est nommé sauf Babacar Ndiaye.
//
// Faits à valider avec le client, affichés sur cette page :
// - année de création 2022 (LinkedIn dit 2021) : biographie (« En 2022, il crée
//   Saloum Immo. »), frise (2022) et fiche (« Depuis 2022. ») ;
// - formulation de la biographie, résumée à partir de son site ;
// - siège « Sicap Keur Massar, Sangalkam, Dakar » (plusieurs adresses circulent) ;
// - portrait HD de Babacar Ndiaye (l'image de l'interview fait 899 px de large) ;
// - photo 2499 : droit à l'image de l'équipe (visages, personne n'est nommé) ;
// - photo 2352 : l'affiche de la vitrine porte le fixe 33 807 87 18, l'autre numéro
//   qui circule (le site affiche 33 805 87 18) ; la page montre 2352-haut, coupée au-dessus ;
// - Millennium City : « travaux réalisés », jamais « notre programme » (lotissement
//   commercialisé par Senegindia) ; seule la canalisation est attribuée à Saloum Immo.
//   La vidéo « Nos réalisations 2026 » présente tout le projet comme réalisé par Saloum
//   Immo : elle est liée depuis L'entreprise, pas depuis le bloc Millennium City ;
// - photo 2537 : trois personnes posent devant l'entrée de Millennium City ;
// - registre : lieux non publiés (tracé de 9 ha, électrification, adduction d'eau) ;
// - chiffres des réseaux, relevés le 13.11.2026 (à mettre à jour ou à retirer).

import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { Fiche } from "@/components/fiche";
import { FounderBlock } from "@/components/founder-block";
import { Photo } from "@/components/photo";
import { Registre } from "@/components/registre";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { TexteFait } from "@/components/texte";
import { MESSAGES } from "@/content/messages";
import { FICHE_ENTREPRISE, MILLENNIUM_TITRE } from "@/content/pages/a-propos";
import { PHOTOS } from "@/content/photos";
import { MILLENNIUM_CITY } from "@/content/registre";
import { PHRASE_MARQUE } from "@/content/site";
import { VIDEOS } from "@/content/videos";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import { Reseaux } from "./_composants/reseaux";

export const metadata: Metadata = metaPage(
  "À propos",
  "Babacar Ndiaye, fondateur et directeur général de Saloum Immo. L’entreprise, le registre daté de ses travaux et ses comptes sur les réseaux.",
);

const LEGENDE = "mt-2.5 text-2 leading-caption text-ink-2";

export default function APropos() {
  const realisations = VIDEOS.realisations2026;
  const presentation = VIDEOS.presentation;
  return (
    <>
      {/* 05 Babacar Ndiaye : ouverture image d'abord */}
      <Section id="fondateur" labelledBy="t-page">
        {/* L'image de l'interview ouvre la page : préchargée (4.2). */}
        <FounderBlock niveau={1} titreId="t-page" preload />
      </Section>

      {/* L'entreprise : en-tête au gabarit de celui du registre (titre 1 à 6, intro 8 à 12),
          pour qu'il s'aligne sur la feuille suivante. Fiche à gauche, l'équipe sous la fiche,
          l'agence à droite. */}
      <Section id="entreprise" labelledBy="t-entreprise" surface="paper-2">
        <header className="mb-9 items-end gap-x-6 border-t-2 border-ink pt-4 tab:mb-18 tab:pt-5 desk:grid desk:grid-cols-12">
          <h2 id="t-entreprise" className="text-6 leading-title font-bold tracking-tight stretch-title desk:col-span-6">
            L’entreprise
          </h2>
          <p className="mt-3 max-w-[32em] text-3 leading-body text-ink-2 desk:col-[8/span_5] desk:mt-0">
            {typo(PHRASE_MARQUE.texte)}
          </p>
        </header>
        <div className="grid gap-y-8 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-10 desk:gap-y-12">
          <div className="tab:col-[1/span_9] desk:col-[1/span_5] desk:row-start-1">
            <Fiche lignes={FICHE_ENTREPRISE} marge="" />
            {/* Les vidéos de l'entreprise, ici et pas sous Millennium City : « Nos réalisations
                2026 » y présente le projet entier comme le sien, la page n'attribue à Saloum
                Immo que le réseau de canalisation. */}
            <div className="mt-4 flex flex-col items-start tab:mt-5">
              <TextLink href={presentation.href}>{`${presentation.titre}, ${presentation.duree}`}</TextLink>
              <TextLink href={realisations.href}>{`${realisations.titre}, ${realisations.duree}`}</TextLink>
            </div>
          </div>
          <figure className="m-0 flex flex-col tab:col-[1/span_6] desk:col-[7/span_6] desk:row-[1/span_2]">
            {/* Paysage (1 080 × 650) calé sur la hauteur des deux blocs de gauche au bureau :
                sizes donne la largeur dessinée, environ 1 200 px. */}
            <span className="relative block aspect-[4/3] overflow-hidden bg-paper desk:aspect-auto desk:min-h-90 desk:flex-1">
              <Photo
                id="2352-haut"
                fill
                sizes="(min-width: 1101px) 1200px, (min-width: 761px) calc((50vw - 40px) * 1.25), calc((100vw - 40px) * 1.25)"
                className="object-cover"
              />
            </span>
            <figcaption className={LEGENDE}>{typo(PHOTOS["2352-haut"].legende ?? "")}</figcaption>
          </figure>
          <figure className="m-0 tab:col-[7/span_6] desk:col-[1/span_5] desk:row-start-2">
            {/* Portrait 3:4 recadré en 4:3 : l'image dessinée a la largeur du cadre.
                Cadrage dans content/photos.ts. */}
            <span className="relative block aspect-[4/3] overflow-hidden bg-paper">
              <Photo
                id="2499"
                fill
                sizes="(min-width: 1440px) 552px, (min-width: 1101px) 38vw, (min-width: 761px) calc(50vw - 40px), calc(100vw - 40px)"
                className="object-cover"
              />
            </span>
            <figcaption className={LEGENDE}>{typo(PHOTOS["2499"].legende ?? "")}</figcaption>
          </figure>
        </div>
      </Section>

      {/* Réalisations : le registre complet, sur la latérite */}
      <Registre id="realisations" titre="Réalisations" titreId="t-realisations" />

      {/* Millennium City : travaux réalisés, jamais « notre programme » */}
      <Section labelledBy="t-millennium" rythme="aucun" className="pt-14 pb-11 tab:pt-28 tab:pb-18">
        <div className="grid gap-y-6 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-8">
          <figure className="m-0 tab:col-[1/span_8] desk:col-[1/span_7]">
            <Photo
              id={MILLENNIUM_CITY.photo}
              sizes="(min-width: 1440px) 783px, (min-width: 1101px) 58vw, (min-width: 761px) calc(67vw - 45px), calc(100vw - 40px)"
              className="block h-auto w-full"
            />
            <figcaption className={LEGENDE}>{typo(PHOTOS[MILLENNIUM_CITY.photo].legende ?? "")}</figcaption>
          </figure>
          <div className="tab:col-[1/span_9] desk:col-[9/span_4]">
            <h3 id="t-millennium" className="text-5 leading-snug font-bold stretch-sub">
              {typo(MILLENNIUM_TITRE.texte)}
            </h3>
            <p className="mt-4 max-w-[32em] text-3 leading-body">
              <TexteFait fait={MILLENNIUM_CITY.texte} />
            </p>
          </div>
        </div>
      </Section>

      {/* Sur les réseaux : titre à gauche, liste à droite */}
      <Section labelledBy="t-reseaux" rythme="aucun" className="pb-16 tab:pb-30">
        <Reseaux titreId="t-reseaux" />
      </Section>

      <ContactBand message={MESSAGES.question.texte} />
    </>
  );
}
