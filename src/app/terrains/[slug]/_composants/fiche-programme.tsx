import { BoutonWhatsApp } from "@/components/boutons";
import { EnTete } from "@/components/en-tete";
import { Faits } from "@/components/faits";
import { Cadre } from "@/components/photo";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { Videos } from "@/components/videos";
import { LIBELLES } from "@/content/messages";
import { PROGRAMMES, RECASEMENT_AIBD, type Programme } from "@/content/programmes";
import { cx } from "@/lib/base";
import { NOTE, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";

/** Fil d'Ariane des fiches. */
export const ARIANE = { href: "/terrains/", libelle: "Terrains" };

/**
 * La grande photo de la fiche : pleine largeur (1 360 × 600 au bureau, 3:2 sur
 * mobile, bord à bord). Sakina City : deux photos de même hauteur, côte à côte dès
 * 761 px. Le panneau 2534 à 440 px de large au plus (au-delà, son texte se lit),
 * la voirie 2413-droite à 600 px au plus : 437 × 325 et 600 × 325 au bureau.
 */
function Visuel({ p }: { p: Programme }) {
  if (p.photoFiche) {
    return (
      <div className="mt-10 grid max-w-[66.3125rem] gap-y-8 tab:grid-cols-[437fr_600fr] tab:items-start tab:gap-x-6 desk:mt-14">
        <Cadre
          id={p.photo}
          preload
          legende
          bord
          ratio="aspect-[4/3] tab:aspect-[437/325]"
          sizes="(min-width: 1440px) 437px, (min-width: 761px) 40vw, 100vw"
        />
        <Cadre
          id={p.photoFiche}
          ratio="aspect-[846/458]"
          legende
          bord
          sizes="(min-width: 1440px) 600px, (min-width: 761px) 55vw, 100vw"
        />
      </div>
    );
  }
  return (
    <Cadre
      id={p.photo}
      preload
      legende
      bord
      ratio="aspect-[3/2] tab:aspect-[2/1] desk:aspect-[1360/600]"
      sizes="(min-width: 1440px) 1360px, 100vw"
      className="mt-10 desk:mt-14"
    />
  );
}

/**
 * Fiche d'un programme : en-tête (fil d'Ariane, nom, chapeau, statut en mots), la
 * grande photo, le tableau de faits et WhatsApp ; à côté, en colonne courte, les
 * vidéos, la ligne vers le foncier et les autres terrains.
 */
export function FicheProgramme({ programme: p }: { programme: Programme }) {
  const autres = [
    ...PROGRAMMES.filter((x) => x.slug !== p.slug).map((x) => ({ href: x.href, nom: x.nom })),
    { href: RECASEMENT_AIBD.href, nom: RECASEMENT_AIBD.nom },
  ];
  return (
    <Section labelledBy="t-page" rythme="ouverture">
      {/* Le statut foncier en tête, une fois : le tableau ne le redit pas. */}
      <EnTete ariane={ARIANE} titre={p.nom} chapeau={p.chapeau.texte}>
        <p className="mt-4 font-semibold">{typo((p.statutFiche ?? p.statut).texte)}</p>
      </EnTete>

      <Visuel p={p} />

      <div className="mt-12 grid gap-y-16 desk:mt-16 desk:grid-cols-12 desk:gap-x-6">
        <div className="desk:col-span-7">
          <Faits lignes={p.fiche.map((l) => ({ libelle: l.libelle, valeur: typo(l.valeur.texte) }))} />
          {p.noteFiche ? <p className={cx(NOTE, "mt-5")}>{typo(p.noteFiche.texte)}</p> : null}
          {p.lots ? (
            <section aria-labelledby="t-lots" className="mt-10">
              <h2 id="t-lots" className={T3}>
                {p.lots.titre}
              </h2>
              <ul className="mt-3 tabular-nums">
                {p.lots.lignes.map((l) => (
                  <li key={l.texte}>{typo(l.texte)}</li>
                ))}
              </ul>
              <p className="mt-3 text-ink-2">{typo(p.lots.avertissement.texte)}</p>
            </section>
          ) : null}
          <BoutonWhatsApp
            label={LIBELLES.programme}
            message={p.message}
            variante="contour"
            className="mt-8"
          />
        </div>

        <div className="flex flex-col gap-10 tab:grid tab:grid-cols-2 tab:gap-x-6 desk:col-span-4 desk:col-start-9 desk:flex">
          <Videos cles={p.videos} />
          <section aria-labelledby="t-autres">
            <h2 id="t-autres" className={T3}>
              Autres terrains
            </h2>
            <ul className="mt-3">
              {autres.map((a) => (
                <li key={a.href}>
                  <TextLink href={a.href}>{a.nom}</TextLink>
                </li>
              ))}
            </ul>
          </section>
          <p className="tab:col-span-2">
            <TextLink href="/foncier/">Avant d’acheter, vérifiez les documents avec nous</TextLink>
          </p>
        </div>
      </div>
    </Section>
  );
}
