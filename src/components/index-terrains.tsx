import type { ReactNode } from "react";
import { LIBELLES } from "@/content/messages";
import { COLONNES_INDEX, INDEX, LEGENDE_INDEX, OFFRE_INDEX, type EtatIndex, type LigneIndex } from "@/content/pages/accueil-index";
import { RELEVE } from "@/content/pages/terrains";
import { NATURES, PHOTOS } from "@/content/photos";
import { PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { cx } from "@/lib/base";
import { NOM, NOTE, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { ApercuTerrain } from "./apercu-terrain";
import { BoutonWhatsApp } from "./boutons";
import { Cote } from "./cote";
import { NomFleche } from "./liste-terrains";
import { Photo, sizesRecadree } from "./photo";
import { Fleche, Lien } from "./text-link";
import "./index-terrains.css";

// L'index des terrains (direction v4, pièce 8) : la pièce où le lotisseur range ce
// qu'il vend. Un vrai tableau, une ligne par programme : le nom en Besley, qui mène à
// la fiche ; le lieu et le papier en étiquette ; la surface dans la voix des mesures ;
// l'état avec son carré (plein : en vente ; contour : à demander). Ce qu'on ignore se
// montre : le statut foncier de Lac Town est une cote en pointillés sans valeur, puis
// « À demander avant de payer ». Dessous, l'offre Recasement AIBD, en une ligne datée.
//
// Le nom porte sa flèche, collée à son dernier mot : sur une carte de téléphone comme
// dans le tableau, elle dit qu'il mène à la fiche. C'est l'écriture de toutes les listes
// de terrains du site (NomFleche, components/liste-terrains.tsx).
//
// Au survol et au clavier, la ligne passe au bleu de plan. Sur l'accueil, au bureau et
// au pointeur fin, le tirage de la photo du programme suit la main
// (components/apercu-terrain.tsx) : la flèche passe alors au bout de la ligne, à la
// place de la vignette. Au doigt, au clavier, sans script ou en mouvement réduit, la
// photo est une vignette dans la ligne. Dans le tableau complet, la vignette est
// toujours là, et il n'y a pas de tirage : la même photo ne vient pas deux fois, et rien
// ne couvre les colonnes qu'on compare.
//
// Tout est dans le HTML : les têtes de colonne, les cases, le texte alternatif de la
// photo et sa nature. Seuls sont cachés aux lecteurs d'écran les doublons faits pour
// l'œil (la clé d'une case sous 1 101 px, le tirage). Le tableau change d'affichage
// avec la largeur : les rôles ARIA lui gardent sa nature de tableau.
//
// La mise en forme est dans index-terrains.css.

type Mode = "index" | "complet";

/** Une étiquette n'est pas une phrase : sans point final. */
const sansPoint = (texte: string) => texte.replace(/\.$/, "");

/**
 * L'état d'une ligne : son carré, puis le mot. Le carré est un signe pour l'œil (plein :
 * en vente ; contour : à demander) ; le mot dit tout, il est le seul lu.
 *
 * Le registre de la page Terrains le reprend sous ses phrases
 * (components/terrains-autres.tsx) : le même signe dans le tableau et dessous.
 */
export function Etat({ nature, texte, className }: { nature: EtatIndex; texte: string; className?: string }) {
  return (
    <p className={cx("index-etat etiquette text-fort", className)}>
      <span aria-hidden="true" data-etat={nature} className="index-carre" />
      <span>{typo(sansPoint(texte))}</span>
    </p>
  );
}

/**
 * Une case de données. Sous 1 101 px, une ligne de cartouche : la clé à gauche, la
 * valeur à droite. Au bureau, la clé est dans l'en-tête du tableau.
 */
function Case({ nom, cle, children }: { nom: string; cle: string; children: ReactNode }) {
  return (
    <td role="cell" data-case={nom} className="index-case">
      {/* Doublon de l'en-tête de colonne, pour l'œil : les lecteurs d'écran ont l'en-tête. */}
      <span aria-hidden="true" className="index-cle etiquette text-doux">
        {typo(cle)}
      </span>
      <div className="index-valeur">{children}</div>
    </td>
  );
}

/** Le texte de l'offre, ses mesures (200 m², le prix) composées dans la voix large. */
function AvecMesures({ texte, mesures }: { texte: string; mesures: string[] }) {
  const entier = typo(texte);
  if (!mesures.length) return entier;
  const echapper = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const motif = new RegExp(`(${mesures.map((m) => echapper(typo(m))).join("|")})`);
  return entier.split(motif).map((morceau, i) =>
    i % 2 ? (
      <span key={i} className="mesure-phrase whitespace-nowrap text-fort">
        {morceau}
      </span>
    ) : (
      morceau
    ),
  );
}

/**
 * La largeur du cadre de la vignette (4:3) et de celui du tirage (3:2), pour le choix
 * des variantes : index-terrains.css donne les mêmes mesures.
 */
const SIZES_VIGNETTE = "(min-width: 761px) and (max-width: 1100px) 120px, 96px";
const SIZES_TIRAGE = "372px";

/**
 * Le bouton WhatsApp d'une ligne, en mode complet. Il porte le fond de sa surface : les
 * croisillons de la section ne passent pas derrière son libellé.
 */
const BOUTON_LIGNE = "bg-fond";

/** Une rangée : un programme. */
function Rangee({ ligne, mode, apercu }: { ligne: LigneIndex; mode: Mode; apercu: boolean }) {
  const p = PROGRAMMES.find((x) => x.slug === ligne.slug);
  const r = RELEVE.find((x) => x.slug === ligne.slug);
  if (!p || !r) return null;
  const complet = mode === "complet";
  const { photo, position } = ligne.apercu;
  return (
    <tr role="row" data-apercu={apercu ? p.slug : undefined} className="index-ligne apparait">
      <th role="rowheader" scope="row" className="index-nom">
        <Lien href={p.href} className={cx(NOM, "index-lien")}>
          <span className="index-glisse">
            <NomFleche nom={p.nom} grand fleche="index-fleche-nom" />
          </span>
          {/* Sur l'accueil, au bureau et au pointeur fin : la flèche au bout de la ligne
              remplace celle du nom (index-terrains.css). */}
          {!complet ? (
            <span aria-hidden="true" className="index-fleche">
              <Fleche />
            </span>
          ) : null}
        </Lien>
      </th>

      {/* Le lieu. Sur l'accueil, la phrase publiée, en étiquette. En mode complet, comme
          sur la fiche : le lieu en mots quand la cote ne le nomme pas, puis les
          distances publiées, en cotes. */}
      <Case nom="lieu" cle={COLONNES_INDEX.lieu}>
        {complet ? (
          <>
            {p.situation ? <p className="text-small">{typo(p.situation.texte)}</p> : null}
            <div className={cx("grid max-w-[22rem] gap-1.5", p.situation && "mt-1.5")}>
              {/* Sous 360 px, la cote se resserre : elle tient dans la colonne à 320 px. */}
              {p.cotes.map((c) => (
                <Cote
                  key={c.vers}
                  de={c.de}
                  mesure={c.mesure}
                  vers={c.vers}
                  chiffree={c.chiffree}
                  className="max-[359px]:gap-1.5"
                />
              ))}
            </div>
          </>
        ) : (
          <p className="etiquette text-doux">{typo(sansPoint(p.lieu.texte))}</p>
        )}
      </Case>

      {/* Le papier. Un statut inconnu se montre : la cote en pointillés d'une distance
          sans chiffre, ici sans valeur du tout, puis le conseil, en mots. */}
      <Case nom="papier" cle={COLONNES_INDEX.papier}>
        {p.foncier === "a-demander" ? (
          <span aria-hidden="true" className="index-cote-vide mb-2 flex h-3 w-full max-w-36 items-center text-accent">
            <span className="h-full w-[1.5px] flex-none bg-current" />
            <span className="pointille h-[1.5px] flex-1" />
            <span className="h-full w-[1.5px] flex-none bg-current" />
          </span>
        ) : null}
        <p className="etiquette text-fort">{typo(sansPoint(r.statut.texte))}</p>
        {r.reference ? (
          <p className="mt-1.5 leading-snug">
            <span className={NOTE}>{typo(r.reference.cle)}</span>{" "}
            <span className="mesure whitespace-nowrap text-fort">{typo(r.reference.valeur.texte)}</span>
          </p>
        ) : null}
      </Case>

      <Case nom="surfaces" cle={COLONNES_INDEX.surfaces}>
        <p className="mesure text-[1.375rem] leading-none whitespace-nowrap text-fort">{typo(r.surface.mesure.texte)}</p>
        <p className={cx(NOTE, "mt-1.5")}>{typo(r.surface.precision.texte)}</p>
      </Case>

      {complet ? (
        <Case nom="fait" cle={COLONNES_INDEX.dejaFait}>
          <p className="text-small">{typo(p.dejaFait.texte)}</p>
          {r.realise ? <p className="mt-1.5 text-small">{typo(r.realise.texte)}</p> : null}
        </Case>
      ) : null}

      <Case nom="etat" cle={COLONNES_INDEX.etat}>
        <Etat nature={ligne.etat.nature} texte={ligne.etat.fait.texte} />
      </Case>

      {/* Le prix se demande : le libellé court de l'intention (messages.ts), le message
          du programme. */}
      {complet ? (
        <Case nom="prix" cle={COLONNES_INDEX.prix}>
          <BoutonWhatsApp
            variante="contour"
            taille="compact"
            label={LIBELLES.programmeCourt}
            message={p.message}
            ariaLabel={`${LIBELLES.programmeCourt}, ${p.nom}`}
            className={BOUTON_LIGNE}
          />
        </Case>
      ) : null}

      {/* La photo du programme : son texte alternatif décrit la scène, sa nature est
          dite à la suite. Au pointeur fin, sur l'accueil, elle ne se montre qu'au
          clavier : le tirage suit la main. */}
      {apercu ? (
        <td role="cell" className="index-photo">
          <span className="index-vignette">
            <Photo
              id={photo}
              fill
              position={position}
              sizes={sizesRecadree(photo, 4 / 3, SIZES_VIGNETTE)}
              className="object-cover"
            />
          </span>
          <span className="sr-only">{typo(NATURES[PHOTOS[photo].nature])}</span>
        </td>
      ) : null}
    </tr>
  );
}

/**
 * Sous le tableau, l'offre Recasement AIBD, en une ligne datée : la date en tête, le
 * nom qui mène à la fiche, l'offre en clair (le prix garde sa date dans sa phrase), la
 * disponibilité avec son carré en contour. Pas de photo : il n'y en a pas de publiée.
 */
function Offre({ mode }: { mode: Mode }) {
  const complet = mode === "complet";
  return (
    <div className="index-ligne index-offre apparait">
      <p className="index-offre-date etiquette text-accent">{typo(OFFRE_INDEX.date.texte)}</p>
      <h3 className={cx(T3, "index-offre-nom")}>
        <Lien href={RECASEMENT_AIBD.href} className="index-lien">
          <span className="index-glisse">
            <NomFleche nom={RECASEMENT_AIBD.nom} fleche="index-fleche-nom" />
          </span>
          {!complet ? (
            <span aria-hidden="true" className="index-fleche">
              <Fleche />
            </span>
          ) : null}
        </Lien>
      </h3>
      <p className="index-offre-texte">
        <AvecMesures texte={OFFRE_INDEX.texte.texte} mesures={OFFRE_INDEX.mesures} />
      </p>
      <Etat nature={OFFRE_INDEX.etat.nature} texte={OFFRE_INDEX.etat.fait.texte} className="index-offre-etat" />
      {complet ? (
        <p className="index-offre-action">
          <BoutonWhatsApp
            variante="contour"
            taille="compact"
            label={RECASEMENT_AIBD.libelleWhatsApp}
            message={RECASEMENT_AIBD.message}
            className={BOUTON_LIGNE}
          />
        </p>
      ) : null}
    </div>
  );
}

/**
 * L'index des terrains, et dessous l'offre Recasement AIBD.
 *
 *   <IndexTerrains />                   l'accueil : l'index, puis l'offre datée ; le
 *                                       tirage de la photo suit le pointeur
 *   <IndexTerrains mode="complet" />    la page Terrains : en plus, le lieu en cotes,
 *                                       ce qui est déjà fait, le bouton WhatsApp ; la
 *                                       vignette dans la ligne, sans tirage
 *
 * À poser dans une <Section>, sous son en-tête de section et son titre : l'index ne
 * porte ni l'un ni l'autre. Le nom de l'offre est un h3 : le titre de la section est
 * un h2. Ne pas l'envelopper d'un bloc `apparait` : ses lignes apparaissent seules.
 */
export function IndexTerrains({
  mode = "index",
  offre = true,
  apercu = true,
  className,
}: {
  /** « complet » : la page Terrains. Par défaut, l'index de l'accueil. */
  mode?: Mode;
  /** La ligne datée de l'offre Recasement AIBD, sous le tableau. */
  offre?: boolean;
  /** Les photos : la vignette dans la ligne et, sur l'accueil, le tirage qui suit le pointeur. */
  apercu?: boolean;
  className?: string;
}) {
  const complet = mode === "complet";
  const tete = "etiquette text-doux";

  const contenu = (
    <>
      <table role="table" className="index-table">
        <caption className="sr-only">{typo(LEGENDE_INDEX[mode])}</caption>
        <thead role="rowgroup" className="index-tete">
          <tr role="row">
            <th role="columnheader" scope="col" data-case="programme" className={tete}>
              {typo(COLONNES_INDEX.programme)}
            </th>
            {/* Le lieu s'écrit sous le nom : son en-tête n'est que lu. */}
            <th role="columnheader" scope="col" className="index-lu">
              {typo(COLONNES_INDEX.lieu)}
            </th>
            <th role="columnheader" scope="col" data-case="papier" className={tete}>
              {typo(COLONNES_INDEX.papier)}
            </th>
            <th role="columnheader" scope="col" data-case="surfaces" className={tete}>
              {typo(COLONNES_INDEX.surfaces)}
            </th>
            {/* Ce qui est déjà fait porte sa clé dans sa case. */}
            {complet ? (
              <th role="columnheader" scope="col" className="index-lu">
                {typo(COLONNES_INDEX.dejaFait)}
              </th>
            ) : null}
            <th role="columnheader" scope="col" data-case="etat" className={tete}>
              {typo(COLONNES_INDEX.etat)}
            </th>
            {complet ? (
              <th role="columnheader" scope="col" className="index-lu">
                {typo(COLONNES_INDEX.prix)}
              </th>
            ) : null}
            {apercu ? (
              <th role="columnheader" scope="col" className="index-lu">
                {typo(COLONNES_INDEX.photo)}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {INDEX.map((ligne) => (
            <Rangee key={ligne.slug} ligne={ligne} mode={mode} apercu={apercu} />
          ))}
        </tbody>
      </table>
      {offre ? <Offre mode={mode} /> : null}
    </>
  );

  const classes = cx("index-terrains", className);
  // Le tirage est la pièce de l'accueil. Le tableau complet montre déjà la vignette dans
  // chaque ligne : la même photo ne revient pas sous la main, par-dessus les surfaces et
  // les travaux de la ligne voisine, qu'on vient comparer.
  if (!apercu || complet) {
    return (
      <div className={classes} data-mode={mode}>
        {contenu}
      </div>
    );
  }

  // Les tirages : une figure par programme, la photo dans un cadre 3:2 et sa légende à
  // deux colonnes, comme sous toutes les photos du site : ce qu'on voit à gauche (la
  // légende de la fiche de la photo, ou celle de l'index), la nature de l'image à
  // droite, lue dans la fiche. Ici la nature ne se coupe pas : la carte est étroite.
  // Rendus côté serveur, placés par ApercuTerrain, qui ne les monte qu'au pointeur fin.
  const tirages = INDEX.map(({ slug, apercu: a }) => {
    const vu = a.legende ?? PHOTOS[a.photo].legende;
    return (
      <figure key={slug} data-cle={slug} className="tirage-figure">
        <span className="tirage-cadre">
          <Photo
            id={a.photo}
            fill
            decorative
            position={a.position}
            sizes={sizesRecadree(a.photo, 3 / 2, SIZES_TIRAGE)}
            className="object-cover"
          />
        </span>
        <figcaption className="tirage-legende etiquette text-doux">
          <span className="tirage-vu">{vu ? typo(sansPoint(vu)) : null}</span>
          <span className="whitespace-nowrap">{typo(NATURES[PHOTOS[a.photo].nature])}</span>
        </figcaption>
      </figure>
    );
  });

  return (
    <ApercuTerrain className={classes} data-mode={mode} tirages={tirages}>
      {contenu}
    </ApercuTerrain>
  );
}
