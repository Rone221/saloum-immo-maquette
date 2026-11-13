// Fiches programme (spécification 7.3) : /terrains/lac-town/, /terrains/sakina-city/,
// /terrains/sicap-keur-massar/ et l'offre datée /terrains/recasement-aibd/.
// Une route, quatre pages générées à l'export (dynamicParams = false).
//
// Faits à valider avec le client, affichés sur ces pages :
// - Lac Town : rattachement de la photo 2580 (légendée sans nom de lieu) ;
//   surfaces 150 à 450 m² et équipements (eau, électricité, lampadaires avec
//   caméras), dits à l'oral dans la vidéo du 21.05.2026 ;
// - Sicap Keur Massar : nom « Paradise City » (cité sous le titre, jamais en titre) ;
//   disponibilité actuelle des lots publiés en 2026 ; rattachement probable de la
//   vue drone 2616 ; droit à l'image de la collaboratrice du reel du 27.10.2026 ;
// - Recasement AIBD : disponibilité en 2026 (offre d'avril 2025) ;
// - toutes les fiches : formulation de la liste « Avant d'acheter, vérifiez avec nous ».
//
// Sakina City n'a aucune ligne au registre (le terrassement de 3 ha à Kounoune
// n'est pas rattaché au programme) : pas de bloc « Ce qui a été fait ici ».

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PROGRAMMES,
  RECASEMENT_AIBD,
  type LibelleFiche,
  type OffreDatee,
  type Programme,
} from "@/content/programmes";
import { metaPage } from "@/lib/meta";
import { FicheOffre } from "./_composants/fiche-offre";
import { FicheProgramme } from "./_composants/fiche-programme";

type Params = { params: Promise<{ slug: string }> };

/** Les offres datées qui ont leur propre page. */
const OFFRES: OffreDatee[] = [RECASEMENT_AIBD];

export const dynamicParams = false;

export function generateStaticParams() {
  return [...PROGRAMMES.map((p) => ({ slug: p.slug })), ...OFFRES.map((o) => ({ slug: o.slug }))];
}

const SUR_DEMANDE = "Prix sur demande, par WhatsApp.";

/** « Près du Lac Rose » devient « près du Lac Rose », après une virgule. */
const minuscule = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Valeur d'une ligne de fiche, sans les accents graves des références. */
function ligne(p: Programme, libelle: LibelleFiche): string {
  return (p.fiche.find((l) => l.libelle === libelle)?.valeur.texte ?? "").replace(/`/g, "");
}

/** Description honnête, faite des données de la fiche (aucun chiffre écrit ici). */
function description(p: Programme): string {
  if (p.slug === "lac-town") {
    return `${p.nom}, ${minuscule(p.catalogue.lieu.texte)}. ${ligne(p, "Déjà fait")} ${p.statutTexte.texte}. ${SUR_DEMANDE}`;
  }
  if (p.slug === "sakina-city") {
    return `${p.nom}, ${p.catalogue.lieu.texte}. ${ligne(p, "Parcelles")} ${ligne(p, "Titre")} ${SUR_DEMANDE}`;
  }
  return `${p.nom}, ${minuscule(p.catalogue.lieu.texte)}. ${p.catalogue.surfaces.texte}. ${p.chapeau.texte} ${ligne(p, "Déjà fait")} ${SUR_DEMANDE}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = PROGRAMMES.find((x) => x.slug === slug);
  const o = OFFRES.find((x) => x.slug === slug);
  const titre = p?.nom ?? o?.nom;
  if (!titre) return {};
  return metaPage(titre, p ? description(p) : `${o!.titre} ${o!.texte.texte} Disponibilité à demander.`);
}

export default async function FicheTerrain({ params }: Params) {
  const { slug } = await params;
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (p) return <FicheProgramme programme={p} />;
  const o = OFFRES.find((x) => x.slug === slug);
  if (o) return <FicheOffre offre={o} />;
  notFound();
}
