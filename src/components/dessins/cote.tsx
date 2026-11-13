import type { CSSProperties } from "react";
import type { GroupeCotes, LigneCote } from "@/content/programmes";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Plaque } from "./plaque";

/** Longueur arbitraire d'une cote ouverte (valeur non chiffrée), hors échelle (3.5). */
const LONGUEUR_OUVERTE = 8;

/** --u, en px : mobile, tablette (761 px), bureau (1 101 px). Voir dessins.css. */
const U = { mobile: 15, tab: 20, desk: 22 };

/** Chasse d'un caractère de Plex Mono en text-1 (13 px × 0,6 em), et padding de la valeur. */
const CHASSE = 7.8;
const PADDING_VALEUR = 16;

/**
 * Où poser la valeur d'une cote : sur la ligne (3.5), ou au-dessus quand la ligne
 * est trop courte pour la porter. Une cote pleine garde 10 px de trait de chaque
 * côté de la valeur, après les obliques (6 px dedans) ; une cote ouverte, 24 px de
 * tirets. « toujours » : au-dessus à toutes les largeurs ; « tab » : sous 1 101 px ;
 * « mobile » : sous 761 px ; undefined : toujours sur la ligne.
 *
 * Jamais d'échelle doublée pour faire tenir la valeur : une unité vaut 1 km ou 1 min
 * partout (2.4), Sakina City (3 km) fait 3 unités.
 */
function placeValeur(ligne: LigneCote, unites: number): "toujours" | "tab" | "mobile" | undefined {
  const texte = ligne.valeur === null ? (ligne.libelleOuvert ?? "") : ligne.valeur.texte;
  const marge = ligne.valeur === null ? 2 * 24 : 2 * (6 + 10);
  const besoin = texte.length * CHASSE + PADDING_VALEUR + marge;
  if (unites * U.desk < besoin) return "toujours";
  if (unites * U.tab < besoin) return "tab";
  if (unites * U.mobile < besoin) return "mobile";
  return undefined;
}

function unites(ligne: LigneCote): number {
  return ligne.valeur === null ? LONGUEUR_OUVERTE : (ligne.mesure ?? LONGUEUR_OUVERTE);
}

/**
 * Une ligne de cote : |<---- 3 km ---->| puis la destination.
 * Trait plein : valeur publiée, longueur mesure × --u (3.5).
 * Tirets sans traits d'extrémité : valeur non chiffrée, longueur arbitraire
 * (8 unités), qui peut raccourcir si la place manque.
 */
function Ligne({ ligne }: { ligne: LigneCote }) {
  const ouverte = ligne.valeur === null;
  return (
    <>
      <span className="cote-dim" style={{ "--len": unites(ligne) } as CSSProperties}>
        <span className="cote-val">{typo(ouverte ? (ligne.libelleOuvert ?? "") : ligne.valeur!.texte)}</span>
      </span>
      {ligne.plaque ? <Plaque>{ligne.vers}</Plaque> : <span className="cote-end">{ligne.vers}</span>}
    </>
  );
}

/**
 * Cote (3.5) ou cotes depuis la même origine, à la même échelle (1 unité = 1 km
 * ou 1 min). Le groupe est une image : l'aria-label dit la phrase.
 */
export function Cotes({ groupe, className }: { groupe: GroupeCotes; className?: string }) {
  if (groupe.lignes.length === 1) {
    const ligne = groupe.lignes[0];
    return (
      <div
        role="img"
        aria-label={groupe.ariaLabel}
        data-haut={placeValeur(ligne, unites(ligne))}
        className={cx("cote", ligne.valeur === null && "cote-open", className)}
      >
        <span className="cote-end">{groupe.origine}</span>
        <Ligne ligne={ligne} />
      </div>
    );
  }
  return (
    <div role="img" aria-label={groupe.ariaLabel} className={cx("cotes", className)}>
      <span className="cotes-o">{groupe.origine}</span>
      <span className="cotes-rows">
        {groupe.lignes.map((ligne) => (
          <span
            key={ligne.vers}
            data-haut={placeValeur(ligne, unites(ligne))}
            className={cx("cote", ligne.valeur === null && "cote-open")}
          >
            <Ligne ligne={ligne} />
          </span>
        ))}
      </span>
    </div>
  );
}

/** Nom de la spécification (3.5) : une cote seule est un groupe d'une ligne. */
export const Cote = Cotes;
