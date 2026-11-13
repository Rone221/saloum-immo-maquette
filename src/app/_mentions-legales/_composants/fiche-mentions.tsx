import { TexteFait } from "@/components/texte";
import type { LigneMention } from "@/content/pages/mentions-legales";
import { cx } from "@/lib/base";

/**
 * Fiche des mentions : le dessin de la fiche parcellaire (3.6), avec une colonne
 * de libellés plus large (« Directeur de la publication »). Une valeur que
 * Saloum Immo n'a pas encore fournie est en pointillés (2.8) : rien n'a été relevé.
 * Chaque ligne fait 44 px au moins : téléphone et e-mail sont des liens.
 */
export function FicheMentions({ lignes, className }: { lignes: LigneMention[]; className?: string }) {
  return (
    <dl className={cx("border-t-[1.5px] border-ink", className)}>
      {lignes.map((l) => (
        <div
          key={l.libelle}
          className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-3 border-b border-rule py-1.5 tab:grid-cols-[224px_minmax(0,1fr)] tab:gap-4"
        >
          <dt className="font-mono text-1 leading-label font-medium text-ink-2">{l.libelle}</dt>
          <dd className="flex min-h-11 min-w-0 items-center text-3 leading-body">
            {"manque" in l ? (
              <span className="inline-block w-18 text-ink-2">
                <span className="dots-x block" aria-hidden="true" />
                <span className="sr-only">À ajouter avant la mise en ligne</span>
              </span>
            ) : l.lien ? (
              <a
                href={l.lien}
                className="inline-flex min-h-11 items-center text-trait underline underline-offset-4 hover:decoration-2"
              >
                <TexteFait fait={l.valeur} />
              </a>
            ) : (
              <TexteFait fait={l.valeur} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
