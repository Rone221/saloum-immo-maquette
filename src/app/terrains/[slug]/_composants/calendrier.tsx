import "./fiches.css";
import type { CSSProperties } from "react";
import { LienVideo } from "@/components/carte-video";
import { EnTeteSection } from "@/components/en-tete-section";
import { TitreCote } from "@/components/mot-cote";
import { Section } from "@/components/section";
import { QUANTITE_CALENDRIER, SECTIONS } from "@/content/pages/fiches";
import type { Jalon } from "@/content/programmes";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2 } from "@/lib/classes";
import { dateLongue, typo } from "@/lib/format";

/** Le nombre de jours entre deux dates écrites AAAA-MM-JJ. */
function jours(de: string, a: string): number {
  return Math.round((Date.parse(a) - Date.parse(de)) / 86_400_000);
}

/**
 * Les colonnes de la frise, au bureau : l'écart entre deux bornes suit le nombre de
 * jours entre leurs dates (52 jours du 30 mars au 21 mai, 34 du 21 mai au 24 juin). Un
 * signe porte une information vraie, même une distance. Après la dernière borne, plus de
 * durée : sa colonne prend la largeur du plus petit écart. Aucune colonne sous 15 rem :
 * son texte doit s'y lire.
 */
function colonnes(jalons: Jalon[]): string {
  const ecarts = jalons.slice(1).map((j, i) => Math.max(1, jours(jalons[i].date, j.date)));
  const derniere = ecarts.length ? Math.min(...ecarts) : 1;
  return [...ecarts, derniere].map((e) => `minmax(15rem, ${e}fr)`).join(" ");
}

/**
 * Le calendrier de Lac Town (direction v4, section 6), sur l'aplat de latérite : la seule
 * fois de la page. Une frise : chaque date est une borne sur un trait plein (ce qui est
 * daté est acquis), dans la voix des mesures ; dessous, ce qui s'est passé, dit par
 * l'équipe, et la vidéo qui le montre, écrite comme partout (le titre en lien, puis la
 * plateforme et la durée). Le titre dit le fait le plus fort. Après la dernière date, le
 * trait s'arrête : on n'en sait pas plus.
 */
export function Calendrier({
  numero,
  titre,
  mot,
  jalons,
}: {
  /** La borne de la section, à la suite de celles de la fiche. */
  numero: string;
  titre: string;
  /** Le mot coté du titre. */
  mot?: string;
  jalons: Jalon[];
}) {
  return (
    <Section surface="laterite" labelledBy="t-calendrier">
      <EnTeteSection numero={numero} nom={SECTIONS.calendrier} quantite={`${jalons.length} ${QUANTITE_CALENDRIER}`} />
      <h2 id="t-calendrier" className={cx(T2, SOUS_BORNE, "max-w-[12em]")}>
        {mot ? <TitreCote texte={titre} mot={mot} /> : typo(titre)}
      </h2>
      <ol className="fiche-frise mt-12 desk:mt-16" style={{ "--fiche-frise-colonnes": colonnes(jalons) } as CSSProperties}>
        {jalons.map((j) => {
          return (
            <li key={j.date} className="fiche-frise-date">
              <span aria-hidden="true" className="fiche-frise-trait se-tire" />
              <span aria-hidden="true" className="fiche-frise-borne" />
              <p className="mesure text-[1.75rem] leading-none desk:text-[clamp(1.75rem,2.5vw,2.25rem)]">
                <time dateTime={j.date}>{typo(dateLongue(j.date))}</time>
              </p>
              <p className={cx(CHAPEAU, "mt-4 max-w-[26rem] desk:mt-5")}>{typo(j.texte.texte)}</p>
              {j.video ? <LienVideo cle={j.video} className="mt-3 desk:mt-4" /> : null}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
