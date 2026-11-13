import { Fragment } from "react";
import type { Fait } from "@/content/types";
import { dateMono, typo } from "@/lib/format";

/**
 * Affiche un texte de données avec la typographie française.
 * Un passage entre accents graves (`TF 15026/R`) sort en mono, à la taille du texte.
 */
export function Texte({ children }: { children: string }) {
  const morceaux = typo(children).split(/`([^`]+)`/);
  return (
    <>
      {morceaux.map((m, i) =>
        i % 2 === 1 ? (
          <span key={i} className="code">
            {m}
          </span>
        ) : (
          <Fragment key={i}>{m}</Fragment>
        ),
      )}
    </>
  );
}

/** Le texte d'un fait. */
export function TexteFait({ fait }: { fait: Fait }) {
  return <Texte>{fait.texte}</Texte>;
}

/**
 * Mention sous une valeur dite à l'oral : « Annoncé en vidéo, 21.05.2026 ».
 * Ne rend rien si le fait n'est pas oral.
 */
export function Said({ fait, className }: { fait: Fait; className?: string }) {
  if (!fait.oral || !fait.date) return null;
  return (
    <span className={className ?? "mt-1 block font-mono text-1 leading-label font-medium text-ink-2"}>
      Annoncé en vidéo, {dateMono(fait.date)}
    </span>
  );
}
