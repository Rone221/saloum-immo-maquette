// Fiches, direction v4 « Du plan au terrain » (recherche/revue-4/direction-v4.md,
// section 6) : /terrains/sakina-city/, /terrains/sicap-keur-massar/, /terrains/lac-town/
// et l'offre datée /terrains/recasement-aibd/. Une route, quatre pages générées à
// l'export (dynamicParams = false). Chaque fiche s'ouvre sur un cartouche de plan
// (borne 01), prend la forme de sa pièce (_composants/fiche-programme.tsx,
// _composants/fiche-offre.tsx), puis se ferme sur les autres terrains et l'appel final.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAMMES, RECASEMENT_AIBD, type Programme } from "@/content/programmes";
import { metaPage } from "@/lib/meta";
import { FicheOffre } from "./_composants/fiche-offre";
import { FicheProgramme } from "./_composants/fiche-programme";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...PROGRAMMES.map((p) => ({ slug: p.slug })), { slug: RECASEMENT_AIBD.slug }];
}

/** Description honnête, faite des données de la fiche (aucun chiffre écrit ici). */
function description(p: Programme): string {
  return `${p.nom}. ${p.chapeau.texte} ${p.statut.texte} Prix sur demande, par WhatsApp.`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (p) return metaPage(p.nom, description(p));
  if (slug === RECASEMENT_AIBD.slug) return metaPage(RECASEMENT_AIBD.nom, RECASEMENT_AIBD.fiche.texte);
  return {};
}

export default async function FicheTerrain({ params }: Params) {
  const { slug } = await params;
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (p) return <FicheProgramme programme={p} />;
  if (slug === RECASEMENT_AIBD.slug) return <FicheOffre />;
  notFound();
}
