import { BoutonAppel, BoutonWhatsApp } from "@/components/boutons";
import { CarteVideo, type Couverture } from "@/components/carte-video";
import { EnTete } from "@/components/en-tete";
import { Cadre } from "@/components/photo";
import { Borne } from "@/components/reperes";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { VignetteTerrain } from "@/components/vignette-terrain";
import { LIBELLES } from "@/content/messages";
import { PROGRAMMES, RECASEMENT_AIBD, type Programme } from "@/content/programmes";
import type { CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { NOTE, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";

/** Fil d'Ariane des fiches. */
export const ARIANE = { href: "/terrains/", libelle: "Terrains" };

/**
 * Couverture des vidéos d'une fiche : la photo du reportage de la collaboratrice, qui
 * n'est pas ailleurs sur la page. Les autres vidéos : le quadrillage d'un plan.
 */
const COUVERTURES: Partial<Record<CleVideo, Couverture>> = {
  reelLotsSKM: { photo: "ig-DfAoxMkAbKR" },
};

/**
 * Largeurs du cadre d'une carte vidéo de la fiche : 416 px au plus (max-w-[26rem]),
 * deux par ligne dès 761 px. La capture de la collaboratrice y est dessinée à 555 px.
 */
const SIZES_VIDEO =
  "(min-width: 1376px) 416px, (min-width: 1101px) 31vw, (min-width: 912px) 416px, (min-width: 761px) 46vw, (min-width: 456px) 416px, 90vw";

/**
 * La grande photo de la fiche : pleine largeur (1 360 × 600 au bureau, 3:2 sur
 * mobile, bord à bord). Sakina City : deux photos de même hauteur, côte à côte dès
 * 761 px. Le panneau 2534 à 440 px de large au plus (au-delà, son texte se lit),
 * la voirie 2413-droite à 600 px au plus : 437 × 325 et 600 × 325 au bureau.
 */
function Visuel({ p }: { p: Programme }) {
  if (p.photoFiche) {
    return (
      <div className="entree mt-10 grid max-w-[66.3125rem] gap-y-8 [--delai:0.15s] tab:grid-cols-[437fr_600fr] tab:items-start tab:gap-x-6 desk:mt-14">
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
      className="entree mt-10 [--delai:0.15s] desk:mt-14"
    />
  );
}

/**
 * Fiche d'un programme (revue 2) : en-tête (fil d'Ariane, nom, chapeau, statut), la
 * grande photo, puis deux colonnes. À gauche, les faits en cartes, les lots, les
 * vidéos. À droite, une colonne collante : statut, prix, WhatsApp, appel, foncier.
 * Dessous, les autres terrains en vignettes.
 */
export function FicheProgramme({ programme: p }: { programme: Programme }) {
  const autres = PROGRAMMES.filter((x) => x.slug !== p.slug);
  const statut = (p.statutFiche ?? p.statut).texte;
  // Le prix n'a pas sa carte : la colonne d'action dit déjà « Prix sur demande ».
  const faits = p.fiche.filter((l) => l.libelle !== "Prix");
  return (
    <Section labelledBy="t-page" rythme="ouverture">
      {/* Le statut foncier en tête, une fois : les cartes de faits ne le redisent pas. */}
      <EnTete ariane={ARIANE} titre={p.nom} chapeau={p.chapeau.texte} className="entree">
        <p className="mt-5 inline-flex items-center gap-2.5 bg-paper-2 px-3.5 py-2.5 font-semibold">
          <span aria-hidden="true" className={cx("size-2.5 flex-none", p.foncier === "titre" ? "bg-trait" : "border-[1.5px] border-ink-2")} />
          {typo(statut)}
        </p>
      </EnTete>

      <Visuel p={p} />

      <div className="mt-12 grid gap-y-14 desk:mt-16 desk:grid-cols-12 desk:gap-x-6">
        <div className="desk:col-span-8">
          <h2 className={T3}>{typo("L’essentiel")}</h2>
          <dl className="mt-5 grid gap-4 tab:grid-cols-2">
            {faits.map((l, i) => (
              <div
                key={l.libelle}
                className={cx(
                  "border border-rule bg-paper p-5 transition-colors duration-300 hover:border-trait",
                  i % 2 === 1 ? "reveler-2" : "reveler",
                  // Une dernière carte seule sur sa ligne prend toute la largeur.
                  i === faits.length - 1 && faits.length % 2 === 1 && "tab:col-span-2",
                )}
              >
                <dt className="flex items-center gap-2 text-small font-semibold text-ink-2">
                  <Borne />
                  {l.libelle}
                </dt>
                <dd className="mt-2 tabular-nums">{typo(l.valeur.texte)}</dd>
              </div>
            ))}
          </dl>
          {p.noteFiche ? <p className={cx(NOTE, "mt-4")}>{typo(p.noteFiche.texte)}</p> : null}

          {p.lots ? (
            <section aria-labelledby="t-lots" className="reveler mt-12">
              <h2 id="t-lots" className={T3}>
                {p.lots.titre}
              </h2>
              <ul className="mt-5 grid gap-3 tabular-nums tab:grid-cols-3">
                {p.lots.lignes.map((l) => (
                  <li key={l.texte} className="border-l-4 border-borne bg-paper-2 px-4 py-3">
                    {typo(l.texte)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-ink-2">{typo(p.lots.avertissement.texte)}</p>
            </section>
          ) : null}

          {p.videos.length ? (
            <section aria-labelledby="t-videos" className="mt-14">
              <h2 id="t-videos" className={T3}>
                En vidéo
              </h2>
              <ul className="mt-5 grid gap-6 tab:grid-cols-2">
                {/* 416 px au plus, les deux cartes à la même largeur : sur mobile, la capture
                    de la collaboratrice serait sinon dessinée au-delà de ses 899 px. */}
                {p.videos.map((cle, i) => (
                  <li key={cle} className={i === 1 ? "reveler-2" : "reveler"}>
                    <CarteVideo cle={cle} couverture={COUVERTURES[cle]} sizes={SIZES_VIDEO} className="max-w-[26rem]" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* La colonne collante : tout ce qu'il faut pour passer à l'action. */}
        <aside aria-label={`Contacter Saloum Immo pour ${p.nom}`} className="desk:col-span-4">
          <div className="border border-ink p-6 desk:sticky desk:top-[calc(var(--spacing-header)+24px)] desk:p-7">
            <p className="text-small font-semibold text-ink-2">{p.nom}</p>
            <p className="mt-1 text-h3 leading-snug font-semibold">Prix sur demande</p>
            <p className="mt-2 text-ink-2">{typo("Demandez le prix et les lots disponibles sur WhatsApp.")}</p>
            <div className="mt-6 flex flex-col gap-3">
              <BoutonWhatsApp label={LIBELLES.programme} message={p.message} bloc={false} className="w-full" />
              <BoutonAppel bloc={false} className="w-full" />
            </div>
            <p className="mt-5 border-t border-rule pt-4">
              <TextLink href="/foncier/">Vérifier les documents avec nous</TextLink>
            </p>
          </div>
        </aside>
      </div>

      <section aria-labelledby="t-autres" className="mt-20 desk:mt-28">
        <h2 id="t-autres" className={T3}>
          Autres terrains
        </h2>
        <ul className="mt-5 grid gap-4 tab:grid-cols-3">
          {autres.map((a, i) => (
            <li key={a.slug} className={i === 1 ? "reveler-2" : "reveler"}>
              <VignetteTerrain href={a.href} nom={a.nom} detail={a.statut.texte} photo={a.photo} />
            </li>
          ))}
          <li className="reveler-3">
            <VignetteTerrain href={RECASEMENT_AIBD.href} nom={RECASEMENT_AIBD.nom} detail={RECASEMENT_AIBD.etiquette} />
          </li>
        </ul>
      </section>
    </Section>
  );
}
