// Une rubrique de contenus de l'espace client de démonstration (direction v4, section
// 7) : ses fiches, et la fiche ouverte, en champs. Une route, cinq pages générées à
// l'export (dynamicParams = false) : programmes, chantiers, videos, coordonnees, photos.
//
// Les valeurs sont les vrais contenus du site, lus dans src/content par
// components/admin/rubriques.ts. Un fait tiré d'une publication la cite, avec sa date.
// On peut modifier un champ et enregistrer : rien n'est gardé, un message le dit.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Editeur } from "@/components/admin/editeur";
import { TeteEcran } from "@/components/admin/pieces";
import { rubriqueAdmin } from "@/components/admin/rubriques";
import { CONTENUS, RUBRIQUES } from "@/content/demo/textes";

type Params = { params: Promise<{ rubrique: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return RUBRIQUES.map((r) => ({ rubrique: r.cle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { rubrique } = await params;
  const r = RUBRIQUES.find((x) => x.cle === rubrique);
  return r ? { title: `${r.nom} · ${CONTENUS.titre}` } : {};
}

export default async function Rubrique({ params }: Params) {
  const { rubrique } = await params;
  const r = rubriqueAdmin(rubrique);
  if (!r) notFound();
  return (
    <div className="admin-page">
      <TeteEcran titre={r.nom} chapeau={`${r.contenu}.`} ariane={{ href: "/admin/contenus/", libelle: CONTENUS.titre }} />
      <Editeur rubrique={r} />
    </div>
  );
}
