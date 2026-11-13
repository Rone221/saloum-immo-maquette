// Page introuvable : le titre, une phrase, les six rubriques, le retour à l'accueil.
// Le pied de contact suit, comme partout.
//
// Next envoie ce fichier avec chaque page du site : composants serveur seulement,
// rien d'interactif.

import type { Metadata } from "next";
import { EnTete } from "@/components/en-tete";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { NAVIGATION } from "@/content/site";
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
    <Section labelledBy="t-page" rythme="ouverture">
      <EnTete
        titre="Page introuvable"
        chapeau="Cette adresse ne mène à aucune page du site. Choisissez une rubrique, ou écrivez-nous sur WhatsApp."
      />
      <nav aria-label="Rubriques" className="mt-10 desk:mt-12">
        <ul className="grid tab:grid-cols-2 tab:gap-x-6 desk:grid-cols-3">
          {NAVIGATION.map((r) => (
            <li key={r.href}>
              <TextLink href={r.href} className="text-h3">
                {r.libelle}
              </TextLink>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-8">
        <TextLink href="/">Retour à l’accueil</TextLink>
      </p>
    </Section>
  );
}
