"use client";

import { useId, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { CaseCartouche, Cartouche } from "@/components/cartouche";
import type { Part, PeriodeTrafic } from "@/content/demo/trafic";
import { MENTIONS, TABLEAU } from "@/content/demo/textes";
import { dateLongue, typo } from "@/lib/format";
import { decimale, jourMois, nombre, pourCent } from "./outils";
import { NoteDemo, TeteBloc } from "./pieces";
import { Profil } from "./profil";

const sansAbonnement = () => () => {};

/** Une tuile du cartouche : la clé en étiquette, le nombre en grand dans la voix des mesures, une ligne dessous. */
function Tuile({ cle, valeur, suite }: { cle: string; valeur: number; suite: string }) {
  return (
    <CaseCartouche cle={cle} className="admin-tuile">
      <p className="mesure admin-tuile-nombre text-fort">{nombre(valeur)}</p>
      <p className="mt-2 text-small text-doux">{typo(suite)}</p>
    </CaseCartouche>
  );
}

/**
 * Un classement : une page, un canal ou un appareil par ligne, son nombre, sa part.
 * Un vrai tableau. Sous chaque ligne, une cote : sa longueur est la mesure de la ligne
 * sur la plus grande de la liste. C'est la cote du journal de chantier, ici à
 * l'échelle : elle fait le travail d'une barre, en un trait.
 */
function Classement({
  legende,
  colonnes,
  lignes,
}: {
  legende: string;
  colonnes: { nom: string; valeur: string; part: string };
  lignes: Part[];
}) {
  return (
    <table role="table" className="classement">
      <caption className="sr-only">{typo(`${legende} ${MENTIONS.chiffres}`)}</caption>
      <thead role="rowgroup">
        <tr role="row" className="classement-tete">
          <th role="columnheader" scope="col" className="etiquette text-doux">
            {typo(colonnes.nom)}
          </th>
          <th role="columnheader" scope="col" className="etiquette text-doux">
            {typo(colonnes.valeur)}
          </th>
          <th role="columnheader" scope="col" className="etiquette text-doux">
            {typo(colonnes.part)}
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {lignes.map((l) => (
          // --mesure : sans unité. La feuille de style en fait une longueur.
          <tr role="row" key={l.nom} className="classement-ligne" style={{ "--mesure": l.mesure.toFixed(3) } as CSSProperties}>
            <th role="rowheader" scope="row">
              <span className="font-semibold text-fort">{typo(l.nom)}</span>
              {l.detail ? <span className="mesure-phrase text-small text-doux">{l.detail}</span> : null}
            </th>
            <td role="cell" className="mesure text-fort">
              {nombre(l.valeur)}
            </td>
            <td role="cell" className="mesure-phrase text-doux">
              {pourCent(l.part)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Le trafic du tableau de bord : la période, puis tout ce qu'elle règle. Le cartouche
 * des quatre compteurs, le profil des visites par jour, les pages les plus vues, la
 * provenance, les appareils. Une seule période pour tous les blocs : leurs nombres
 * s'accordent, ils sortent de la même série (content/demo/trafic.ts).
 *
 * Tout est inventé pour la démonstration. Le bandeau le dit en permanence ; une ligne
 * le redit une fois, sous le profil, là où les chiffres se lisent d'abord. Les
 * classements ne la répètent pas : leur légende, lue par un lecteur d'écran, la garde.
 *
 * Les blocs se rangent dans une grille de douze colonnes, deux de front au bureau, le
 * large et l'étroit en quinconce : pages (7) et provenance (5), puis appareils (5) et
 * le bloc suivant (7). `children` : les blocs de la page qui ne dépendent pas de la
 * période (les dernières demandes, les contenus), à la suite dans la même grille.
 *
 * Sans script, la période par défaut s'affiche, entière ; le choix reste éteint.
 */
export function TableauTrafic({
  periodes,
  parDefaut,
  children,
}: {
  periodes: PeriodeTrafic[];
  parDefaut: string;
  children?: ReactNode;
}) {
  const t = TABLEAU;
  const id = useId();
  const [cle, setCle] = useState(parDefaut);
  const vivant = useSyncExternalStore(
    sansAbonnement,
    () => true,
    () => false,
  );
  const p = periodes.find((x) => x.cle === cle) ?? periodes[0];

  return (
    <>
      {/* La période : au-dessus de tout ce qu'elle règle. */}
      <div className="admin-reglage">
        <p className="admin-periode">
          {typo(`${t.periode.du} `)}
          <span className="mesure-phrase text-fort">{typo(jourMois(p.debut))}</span>
          {typo(` ${t.periode.au} `)}
          <span className="mesure-phrase text-fort">{typo(dateLongue(p.fin))}</span>
        </p>
        <fieldset className="segments" disabled={!vivant}>
          <legend className="sr-only">{typo(t.periode.legende)}</legend>
          <div className="segments-rang">
            {periodes.map((x) => (
              <label key={x.cle} className="segment">
                <input type="radio" name={`${id}-periode`} value={x.cle} checked={x.cle === p.cle} onChange={() => setCle(x.cle)} />
                <span>{typo(x.libelle)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="admin-grille">
        <section aria-labelledby="b-trafic" className="admin-bloc">
          <TeteBloc numero="01" nom={t.trafic.nom} quantite={p.libelle} id="b-trafic" />
          <Cartouche aria-label={t.trafic.nom} className="mt-6 grid-cols-2 desk:mt-7 desk:grid-cols-4">
            <Tuile cle={t.trafic.tuiles.visites} valeur={p.visites} suite={`${nombre(p.moyenne)} ${t.trafic.parJour}`} />
            <Tuile
              cle={t.trafic.tuiles.visiteurs}
              valeur={p.visiteurs}
              suite={`${Math.round((p.visiteurs / p.visites) * 100)} ${t.trafic.surCent}`}
            />
            <Tuile
              cle={t.trafic.tuiles.pagesVues}
              valeur={p.pagesVues}
              suite={`${decimale(p.pagesVues / p.visites)} ${t.trafic.parVisite}`}
            />
            <Tuile
              cle={t.trafic.tuiles.whatsapp}
              valeur={p.clicsWhatsApp}
              suite={`${t.trafic.uneSur} ${Math.round(p.visites / p.clicsWhatsApp)}`}
            />
          </Cartouche>
          {/* key : une période, un dessin. La lecture en cours ne passe pas d'une série à l'autre. */}
          <Profil key={p.cle} serie={p.serie} moyenne={p.moyenne} sommet={p.sommet} />
          <NoteDemo className="mt-4">{MENTIONS.chiffres}</NoteDemo>
        </section>

        <section aria-labelledby="b-pages" className="admin-bloc admin-large">
          <TeteBloc numero="02" nom={t.pages.nom} quantite={`${p.pages.length} ${t.pages.quantite}`} id="b-pages" />
          <Classement legende={t.pages.legende} colonnes={t.pages.colonnes} lignes={p.pages} />
        </section>

        <section aria-labelledby="b-provenance" className="admin-bloc admin-etroit">
          <TeteBloc numero="03" nom={t.provenances.nom} quantite={`${p.provenances.length} ${t.provenances.quantite}`} id="b-provenance" />
          <Classement legende={t.provenances.legende} colonnes={t.provenances.colonnes} lignes={p.provenances} />
        </section>

        <section aria-labelledby="b-appareils" className="admin-bloc admin-etroit">
          <TeteBloc numero="04" nom={t.appareils.nom} quantite={`${p.appareils.length} ${t.appareils.quantite}`} id="b-appareils" />
          <Classement legende={t.appareils.legende} colonnes={t.appareils.colonnes} lignes={p.appareils} />
        </section>

        {children}
      </div>
    </>
  );
}
