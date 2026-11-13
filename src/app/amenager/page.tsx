// Aménager mon terrain (spécification 7.4) : la page des propriétaires et des
// promoteurs. Ouverture dans le dessin (la coupe porte le H1), l'encart
// propriétaires tout de suite après, les six étapes en version longue, les huit
// services en pleine largeur, le registre complet, la bande de contact.
//
// Écarts voulus à 7.4 :
// - l'encart propriétaires n'a pas la nomenclature : la section pleine largeur
//   des huit services la suit, elle ferait doublon ;
// - étape 4 : pas de ligne sous les photos d'agents SEN'EAU (2355, 2327). Pas
//   celle des 58 parcelles et de la visite de contrôle de SEN'EAU (4.3 : 2355
//   jamais accolée aux 58 parcelles), qui reste au registre, en bas de page. Pas
//   le libellé du service 04 non plus : ce service renvoie à l'étape 4 (7.4), le
//   lecteur serait revenu au même texte. L'intro dit « sous la plupart » ;
// - titres : les étapes affirment (« Du débroussaillage au titre foncier. »), les
//   services s'ouvrent sur leur étiquette seule (3.4, 6.1).
//
// Les lignes datées sous les étapes ne sont pas des légendes : la photo et la
// ligne ne parlent pas forcément du même chantier. L'intro des étapes le dit.
//
// Faits à valider avec le client, affichés sur cette page :
// - lieux des photos 2542, 2355 et 2516 (légendées sans lieu) ;
// - registre : Millennium City présenté comme « travaux réalisés », réseau de
//   canalisation seulement ; lieux non publiés (tracé de 9 ha, électrification,
//   adduction d'eau), écrits « Non publié » ;
// - étape 3 : la ligne « Voies en latérite avec bordures béton à Sakina City »
//   n'a pas de date publiée ;
// - photo 2327 : coupée au-dessus du bandeau SEN'EAU incrusté.

import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { Coupe } from "@/components/dessins/coupe";
import { Nomenclature } from "@/components/nomenclature";
import { OwnerBox } from "@/components/owner-box";
import { Planche } from "@/components/planche";
import { Registre } from "@/components/registre";
import { Section } from "@/components/section";
import { MESSAGES } from "@/content/messages";
import { ETAPES } from "@/content/services";
import { enLettres, typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  "Aménager mon terrain",
  "Saloum Immo aménage ses programmes et les terrains des propriétaires : terrassement, bornage, voies en latérite, eau avec SEN’EAU, électricité. Les étapes en photos, les travaux datés, et WhatsApp pour décrire votre terrain.",
);

export default function Amenager() {
  const etapes = enLettres(ETAPES.length);
  return (
    <>
      {/* 02 Aménager la terre : ouverture dans le dessin, puis l'encart propriétaires */}
      <Section id="amenager" labelledBy="t-amenager" surface="paper-2" rythme="dessin">
        <Coupe
          numero="02"
          titre="Aménager la terre"
          titreId="t-amenager"
          intro="Terrassement, voies en latérite, eau avec SEN’EAU, électricité, bornage. Sur les terrains que nous vendons, et sur ceux des propriétaires."
          niveau={1}
        />
        {/* Sans la nomenclature : la page la donne en pleine largeur deux sections plus bas. */}
        <OwnerBox niveau={2} nomenclature={false} className="mt-11 tab:mt-20" />
      </Section>

      {/* Les six étapes, version longue : deux photos au plus et une ligne datée.
          Ouverture du registre (titre col. 1 à 6, intro col. 8 à 12), sans numéro :
          le 02 de la rubrique est déjà dans la coupe. Le titre affirme (6.1). */}
      <Section id="etapes" labelledBy="t-etapes">
        <header className="mb-9 border-t-2 border-ink pt-4 tab:mb-18 tab:pt-5 desk:grid desk:grid-cols-12 desk:items-end desk:gap-x-6">
          <h2 id="t-etapes" className="text-6 leading-title font-bold tracking-tight stretch-title desk:col-span-6">
            {typo("Du débroussaillage au titre foncier.")}
          </h2>
          <p className="mt-4 text-3 leading-body text-ink-2 desk:col-[8/span_5] desk:mt-0">
            {typo(
              `${etapes} étapes, dans l’ordre de la coupe. Sous la plupart, un fait publié et son origine : la photo et la ligne ne montrent pas forcément le même chantier.`,
            )}
          </p>
        </header>
        <Planche etapes={ETAPES} version="longue" niveau={3} marge="" />
      </Section>

      {/* Les huit services : pas une ouverture classique de plus (3.4), l'étiquette de la
          nomenclature sert de titre, comme dans l'encart propriétaires de l'accueil. */}
      <Section id="services" labelledBy="t-services" surface="paper-2">
        <Nomenclature variante="pleine" titreH2 titreId="t-services" />
      </Section>

      <Registre id="registre" />

      <ContactBand
        message={MESSAGES.proprietaire.texte}
        template={MESSAGES.proprietaire.gabarit}
        bouton="Décrire mon terrain sur WhatsApp"
      />
    </>
  );
}
