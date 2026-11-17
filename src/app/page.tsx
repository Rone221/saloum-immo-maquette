// Accueil, direction v4 « Du plan au terrain » (recherche/revue-4/direction-v4.md,
// section 6) : la pièce de référence du site. Chaque section est une pièce du plan de
// lotissement, livrée par son composant ; cette page les pose dans l'ordre et tient le
// rythme des fonds (jamais deux sombres de suite, toujours du clair entre le bleu de
// plan et la latérite) :
// 01. L'ouverture : la vue d'en haut, ses axes de voies, son cartouche, la lunette.
// 02. Où acheter, et avec quel papier : l'index des terrains, puis l'offre AIBD datée.
// 03. Du débroussaillage au titre foncier : la méthode sur planche au bleu, la coupe
//     d'une voie qui se construit avec l'étape lue. Puis les propriétaires, sur calque.
// 04. Le bon papier avant le bon prix : l'échelle des papiers et ses trois traits.
// 05. Nos chantiers, datés : le journal de chantier, sur la latérite.
// 06. De loin, faites tout vérifier avant de payer : la diaspora, les vidéos.
// 07. Babacar Ndiaye et l'agence.
// 08. L'appel final. Le pied suit, dans le layout.
//
// Les bornes des en-têtes de section se suivent de 01 à 08. Photos : 2538 (ouverture),
// 2413-droite, 2616-bas et 2580 (index), les gestes de la méthode, 2542 (propriétaires),
// 2333 et la vidéo du NICAD (diaspora), l'interview et 2352-haut (fondateur, agence).

import { AccueilEtranger } from "@/components/accueil-etranger";
import { AccueilFondateur } from "@/components/accueil-fondateur";
import { AccueilProprietaires } from "@/components/accueil-proprietaires";
import { AppelFinal } from "@/components/appel-final";
import { BoutonWhatsApp } from "@/components/boutons";
import { AccueilPapiers } from "@/components/echelle-papiers";
import { EnTeteSection } from "@/components/en-tete-section";
import { IndexTerrains } from "@/components/index-terrains";
import { AccueilMethode } from "@/components/methode";
import { TitreCote } from "@/components/mot-cote";
import { OuverturePlan } from "@/components/ouverture-plan";
import { AccueilTravaux } from "@/components/registre-travaux";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { APPEL, TITRES } from "@/content/pages/accueil";
import { PROGRAMMES } from "@/content/programmes";
import { cx } from "@/lib/base";
import { SOUS_BORNE, T2 } from "@/lib/classes";

export default function Accueil() {
  return (
    <>
      {/* 01. L'ouverture porte sa propre borne. */}
      <OuverturePlan />

      {/* 02. Où acheter, et avec quel papier */}
      <Section id="terrains" labelledBy="t-terrains" croisillons>
        <EnTeteSection numero="02" nom="Les terrains" quantite={`${PROGRAMMES.length} programmes`} />
        <h2 id="t-terrains" className={cx(T2, SOUS_BORNE, "max-w-[12em]")}>
          <TitreCote texte={TITRES.terrains} mot="papier" basse />
        </h2>
        <IndexTerrains className="mt-10 desk:mt-14" />
        <TextLink href="/terrains/" className="mt-6 desk:mt-8">
          Tous les terrains, et les autres sites
        </TextLink>
      </Section>

      {/* 03. La méthode, sur la planche au bleu, puis les propriétaires, sans borne à
          eux : c'est la suite de la méthode, dite à qui a un terrain. */}
      <AccueilMethode numero="03" />
      <AccueilProprietaires surface="calque" />

      {/* 04. Les papiers, sur le sable à croisillons. */}
      <AccueilPapiers numero="04" />

      {/* 05. Le journal de chantier, sur la latérite. */}
      <AccueilTravaux numero="05" />

      {/* 06. De loin */}
      <AccueilEtranger numero="06" />

      {/* 07. Le fondateur et l'agence */}
      <AccueilFondateur numero="07" />

      {/* 08. L'appel final */}
      <AppelFinal
        numero="08"
        nom={APPEL.nom}
        phrase={APPEL.phrase}
        mot={APPEL.mot}
        bouton={<BoutonWhatsApp label={LIBELLES.question} message={MESSAGES.question.texte} />}
      />
    </>
  );
}
