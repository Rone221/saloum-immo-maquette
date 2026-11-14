// Terrains (revue 2) : une grande carte par programme (photo à gauche, faits à droite),
// l'offre AIBD en ticket daté, les deux autres sites publiés en petites cartes, et
// l'encart vers le foncier. Le détail de chaque programme vit sur sa fiche.
//
// Jamais sur cette page : Kounoune 2 (peut-être Sakina City) ni son prix de 2024.

import type { Metadata } from "next";
import Link from "next/link";
import { BoutonWhatsApp } from "@/components/boutons";
import { CARTE, CarteOffre, TraitCarte, classePhotoCarte } from "@/components/carte-programme";
import { EnTete } from "@/components/en-tete";
import { Faits } from "@/components/faits";
import { Photo, cadreNaturel, sizesRecadree } from "@/components/photo";
import { BadgeStatut, Borne, Fleche } from "@/components/reperes";
import { Section } from "@/components/section";
import { LIBELLES } from "@/content/messages";
import { PHOTOS } from "@/content/photos";
import { AUTRES_SITES, PROGRAMMES, type Programme } from "@/content/programmes";
import { cx } from "@/lib/base";
import { T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import { waHref } from "@/lib/whatsapp";

const TITRE = "Terrains disponibles";

export const metadata: Metadata = metaPage(
  "Terrains disponibles",
  "Sakina City, Sicap Keur Massar et Lac Town, autour de Dakar, et l’offre Recasement AIBD d’avril 2025. Statut foncier, surfaces publiées et travaux déjà faits. Prix sur demande, par WhatsApp.",
);

/** Largeurs du cadre photo d'une grande carte : 5 colonnes sur 12, 566 px au bureau. */
const SIZES_CADRE = "(min-width: 1440px) 566px, (min-width: 761px) 40vw, 100vw";

/**
 * Grande carte d'un programme : la photo à gauche (5 colonnes, 566 px au bureau), le
 * statut en badge, les faits à droite. Le cadre garde son ratio, centré sur la hauteur
 * du texte : il ne s'étire plus, et la photo n'est jamais agrandie au-delà de son
 * fichier. Une photo plafonnée (2413-droite, 600 px) prend son propre ratio, sans zoom
 * au survol : elle est dessinée à la largeur du cadre. Les autres sont recadrées en 3:2.
 * Le nom mène à la fiche et s'étend sur la carte ; WhatsApp reste au-dessus.
 */
function CarteLarge({ programme: p }: { programme: Programme }) {
  const titreId = `t-${p.slug}`;
  const photo = p.photoRangee ?? p.photo;
  const plafonnee = Boolean(PHOTOS[photo].largeurMax);
  return (
    <article aria-labelledby={titreId} className={cx(CARTE, "reveler tab:grid tab:grid-cols-12")}>
      <TraitCarte />
      <div
        className={cx("relative w-full overflow-hidden bg-paper-2 tab:col-span-5 tab:self-center", !plafonnee && "aspect-[3/2]")}
        style={plafonnee ? cadreNaturel(photo) : undefined}
      >
        <Photo
          id={photo}
          fill
          decorative
          sizes={
            plafonnee
              ? "(min-width: 1440px) 566px, (min-width: 761px) 40vw, (min-width: 642px) 600px, 100vw"
              : sizesRecadree(photo, 3 / 2, SIZES_CADRE)
          }
          className={classePhotoCarte(photo)}
        />
        <BadgeStatut foncier={p.foncier} texte={p.statut.texte} className="absolute top-3 left-3" />
      </div>
      <div className="flex flex-col p-5 tab:col-span-7 tab:p-8 desk:p-10">
        {/* Pas de numéro : dans l'ordre du statut foncier, il se lirait comme un rang de sécurité. */}
        <p className="flex items-center gap-2 text-small text-ink-2">
          <Borne />
          {typo(p.lieu.texte.replace(/\.$/, ""))}
        </p>
        <h2 id={titreId} className={cx(T2, "mt-3")}>
          <Link href={p.href} className="transition-colors after:absolute after:inset-0 after:z-[1] group-hover:text-trait">
            {p.nom}
          </Link>
        </h2>
        <Faits
          className="mt-5"
          lignes={[
            { libelle: "Surfaces", valeur: typo(p.surfaces.texte) },
            { libelle: "Déjà fait", valeur: typo(p.dejaFait.texte) },
            { libelle: "Prix", valeur: "Sur demande." },
          ]}
        />
        <div className="mt-8 flex flex-col items-start gap-3 desk:flex-row desk:items-center desk:gap-6">
          {/* Colonne étroite en tablette : le bouton prend la largeur, le lien passe dessous. */}
          <BoutonWhatsApp
            label={LIBELLES.programme}
            ariaLabel={`${LIBELLES.programme}, ${p.nom}`}
            message={p.message}
            bloc={false}
            className="relative z-[2] w-full desk:w-auto"
          />
          <span aria-hidden="true" className="inline-flex items-center gap-2 font-semibold transition-colors group-hover:text-trait">
            Voir la fiche <Fleche />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Terrains() {
  return (
    <Section labelledBy="t-page" rythme="ouverture">
      <EnTete
        titre={TITRE}
        chapeau="Trois programmes en vente autour de Dakar, et une offre datée. Prix sur demande, par WhatsApp."
        className="entree"
      />

      <div className="mt-10 flex flex-col gap-8 tab:mt-14 desk:gap-10">
        {PROGRAMMES.map((p) => (
          <CarteLarge key={p.slug} programme={p} />
        ))}
        <CarteOffre whatsapp className="reveler" />
      </div>

      {/* Les autres sites publiés : deux petites cartes, « Demander » sur WhatsApp. */}
      <section aria-labelledby="t-autres" className="mt-20 tab:mt-24 desk:mt-28">
        <h2 id="t-autres" className={T3}>
          Autres sites publiés
        </h2>
        <ul className="mt-5 grid gap-4 tab:grid-cols-2 tab:gap-6">
          {AUTRES_SITES.map((s, i) => (
            <li key={s.nom} className={i === 1 ? "reveler-2" : "reveler"}>
              {/* Pas d'aria-label : le nom du lien est tout son texte, seule mention de ce site. */}
              <a
                href={waHref(typo(s.message))}
                className="group flex h-full flex-col border border-rule bg-paper p-5 transition-colors duration-300 hover:border-trait tab:p-6"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Borne />
                  {s.nom}
                </span>
                <span className="mt-2 text-ink-2">{typo(s.texte.texte)}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-trait">
                  {LIBELLES.autreSite} sur WhatsApp <Fleche />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* L'encart vers le foncier : une bordure orange à gauche, comme une borne. */}
      <Link
        href="/foncier/"
        className="group reveler mt-12 flex flex-col gap-2 border-l-4 border-borne bg-paper-2 px-6 py-6 transition-colors duration-300 hover:bg-ink hover:text-white tab:flex-row tab:items-center tab:justify-between tab:px-8"
      >
        <span className="text-h3 leading-snug font-semibold">
          {typo("Avant de verser quoi que ce soit, voyez quels documents vérifier")}
        </span>
        <span className="inline-flex items-center gap-2 font-semibold text-trait group-hover:text-white">
          Comprendre le foncier <Fleche />
        </span>
      </Link>
    </Section>
  );
}
