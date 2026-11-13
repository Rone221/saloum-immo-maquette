// Terrains (recherche/allegement.md, partie 3) : une rangée par programme, photo
// à gauche, faits à droite ; l'offre AIBD datée, sans photo, en une colonne ; les
// deux autres sites publiés ; une ligne vers le foncier. Plus de tableau
// comparatif : le même contenu aurait été donné deux fois. Le détail de chaque
// programme vit sur sa fiche.
//
// Jamais sur cette page : Kounoune 2 (peut-être Sakina City) ni son prix de 2024.

import type { Metadata } from "next";
import Link from "next/link";
import { BoutonWhatsApp } from "@/components/boutons";
import { EnTete } from "@/components/en-tete";
import { Faits } from "@/components/faits";
import { Photo, plafond } from "@/components/photo";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { LIBELLES } from "@/content/messages";
import { AUTRES_SITES, PROGRAMMES, RECASEMENT_AIBD, type Programme } from "@/content/programmes";
import { cx } from "@/lib/base";
import { COLONNE, SOUS_TITRE, T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import { waHref } from "@/lib/whatsapp";

const TITRE = "Terrains disponibles";

export const metadata: Metadata = metaPage(
  "Terrains disponibles",
  "Sakina City, Sicap Keur Massar et Lac Town, autour de Dakar, et l’offre Recasement AIBD d’avril 2025. Statut foncier, surfaces publiées et travaux déjà faits. Prix sur demande, par WhatsApp.",
);

/** Lien d'un titre de rangée : 44 px de haut au moins. */
const LIEN_TITRE = "inline-flex min-h-11 items-center decoration-2 underline-offset-6 hover:text-trait hover:underline";

/**
 * Une rangée : la photo toujours à gauche (5 colonnes, 553 × 369 au bureau), les
 * faits à droite. Sur mobile, la photo va bord à bord.
 */
function Rangee({ programme: p }: { programme: Programme }) {
  const titreId = `t-${p.slug}`;
  const photo = p.photoRangee ?? p.photo;
  return (
    <article aria-labelledby={titreId} className="grid gap-y-6 tab:grid-cols-12 tab:items-center tab:gap-x-6">
      {/* La photo double le lien du nom : hors de la tabulation, alt vide. */}
      <Link
        href={p.href}
        tabIndex={-1}
        aria-hidden="true"
        className="-mx-gutter block tab:col-span-6 tab:mx-0 desk:col-span-5"
        style={plafond(photo)}
      >
        <span className="relative block aspect-[3/2] overflow-hidden bg-paper-2">
          <Photo
            id={photo}
            fill
            decorative
            sizes="(min-width: 1440px) 553px, (min-width: 1101px) 39vw, (min-width: 761px) 47vw, 100vw"
            className="object-cover"
          />
        </span>
      </Link>
      <div className={cx(COLONNE, "tab:col-span-6 desk:col-span-6 desk:col-start-7")}>
        <h2 id={titreId} className={T2}>
          <Link href={p.href} className={LIEN_TITRE}>
            {p.nom}
          </Link>
        </h2>
        <p className="mt-3 text-ink-2">{typo(p.lieu.texte)}</p>
        <p className="font-semibold">{typo(p.statut.texte)}</p>
        <Faits
          className="mt-6"
          lignes={[
            { libelle: "Surfaces", valeur: typo(p.surfaces.texte) },
            { libelle: "Déjà fait", valeur: typo(p.dejaFait.texte) },
            { libelle: "Prix", valeur: "Sur demande." },
          ]}
        />
        <BoutonWhatsApp
          label={LIBELLES.programme}
          ariaLabel={`${LIBELLES.programme}, ${p.nom}`}
          message={p.message}
          variante="contour"
          className="mt-7"
        />
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
      />

      <div className="mt-10 flex flex-col gap-14 tab:mt-14 tab:gap-20 desk:gap-24">
        {PROGRAMMES.map((p) => (
          <Rangee key={p.slug} programme={p} />
        ))}

        {/* L'offre datée, sans photo, en une colonne : le prix n'apparaît qu'avec sa date. */}
        <article aria-labelledby="t-aibd" className={COLONNE}>
          <h2 id="t-aibd" className={T2}>
            <Link href={RECASEMENT_AIBD.href} className={LIEN_TITRE}>
              {RECASEMENT_AIBD.nom}
            </Link>
          </h2>
          <p className={SOUS_TITRE}>{typo(RECASEMENT_AIBD.terrains.texte)}</p>
          <BoutonWhatsApp
            label={LIBELLES.recasementAibd}
            message={RECASEMENT_AIBD.message}
            variante="contour"
            className="mt-7"
          />
        </article>
      </div>

      {/* Les autres sites publiés : « Demander » en fin de phrase, sur chaque ligne. */}
      <section aria-labelledby="t-autres" className={cx(COLONNE, "mt-20 tab:mt-24 desk:mt-32")}>
        <h2 id="t-autres" className={T3}>
          Autres sites publiés
        </h2>
        <ul className="mt-3">
          {AUTRES_SITES.map((s) => (
            <li key={s.nom}>
              {typo(s.texte.texte)}{" "}
              <a
                href={waHref(typo(s.message))}
                aria-label={`${LIBELLES.autreSite} sur WhatsApp, ${s.nom}`}
                className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-trait underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                {LIBELLES.autreSite}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* La ligne vers le foncier, à part, sous les autres sites. */}
      <p className="mt-12">
        <TextLink href="/foncier/">Avant de verser quoi que ce soit, voyez quels documents vérifier</TextLink>
      </p>
    </Section>
  );
}
