import type { ReactNode } from "react";
import { typo } from "@/lib/format";

/** Une espace telle que typo() la laisse : simple, insécable ou fine insécable. */
const ESPACE = "[ \\u00A0\\u202F]";
const MOIS = "janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre";
/** Les unités que le site écrit après un nombre. */
const UNITES = "hectares?|parcelles?|poteaux|m²|km|min";

/**
 * Ce qui se mesure ou se date dans une phrase, du plus long au plus court : une date
 * entière (« 20 novembre 2025 »), un mois et son année (« avril 2025 »), un nombre et
 * son unité (« 9 hectares », « 53 parcelles »), une année seule (« 2015 »).
 * Construite depuis une chaîne : les classes de lettres (\p{L}) et le regard en arrière
 * ne passent pas dans une expression littérale avec la cible de compilation du projet.
 */
const MESURES = new RegExp(
  [
    `(?:1er|\\d{1,2})${ESPACE}(?:${MOIS})${ESPACE}\\d{4}`,
    `(?<![\\p{L}])(?:${MOIS})${ESPACE}\\d{4}`,
    `\\d+(?:${ESPACE}\\d{3})*${ESPACE}(?:${UNITES})(?![\\p{L}])`,
    `(?<![\\d/])(?:19|20)\\d{2}(?![\\d/])`,
  ].join("|"),
  "gu",
);

/**
 * Une phrase du contenu, avec ses mesures et ses dates dans la voix technique
 * (direction v4, « Lettres » : `mesure-phrase`, graisse 500 pour ne pas crier). La
 * phrase n'est pas réécrite : elle passe par typo(), puis chaque mesure est enveloppée
 * telle qu'elle est écrite, et ne se coupe pas en fin de ligne.
 *
 *   <PhraseMesuree texte={t.mesure.suite} />
 *
 * Pour une clé de registre (une date seule, un grand chiffre), pas besoin : elle se
 * compose en `mesure` par l'appelant.
 */
export function PhraseMesuree({ texte }: { texte: string }) {
  const phrase = typo(texte);
  const morceaux: ReactNode[] = [];
  let fait = 0;
  for (const m of phrase.matchAll(MESURES)) {
    const debut = m.index ?? 0;
    if (debut > fait) morceaux.push(phrase.slice(fait, debut));
    morceaux.push(
      <span key={debut} className="mesure-phrase whitespace-nowrap">
        {m[0]}
      </span>,
    );
    fait = debut + m[0].length;
  }
  if (fait < phrase.length) morceaux.push(phrase.slice(fait));
  return <>{morceaux}</>;
}
