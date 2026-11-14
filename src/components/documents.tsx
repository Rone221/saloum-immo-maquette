import { DOCUMENTS } from "@/content/foncier";
import { cx } from "@/lib/base";
import { T3 } from "@/lib/classes";
import { typo } from "@/lib/format";

/** Couleur de la borne de chaque document : la latérite, l'orange, le bleu. */
const BORNES = { delib: "bg-laterite", bail: "bg-borne", tf: "bg-trait" } as const;

/**
 * Les trois documents du foncier en cartes (revue 2), rangés du moins au plus
 * protégé, avec l'axe au-dessus. Le niveau reste en mots, tel que publié : l'axe
 * montre un ordre, pas une note.
 *
 * `variante="accueil"` : sur fond encre, la définition seule ; le titre foncier
 * (ce que nous vendons à Sakina City et Sicap Keur Massar) en carte claire.
 * `variante="page"` : sur fond gris, tout le texte publié de chaque document.
 */
export function Documents({ variante, className }: { variante: "accueil" | "page"; className?: string }) {
  const sombre = variante === "accueil";
  return (
    <div className={className}>
      {/* L'axe : une flèche du moins au plus protégé. Sur mobile, il est vertical à gauche. */}
      <div
        aria-hidden="true"
        className={cx(
          "mb-5 hidden items-center gap-4 text-small font-semibold tab:flex",
          sombre ? "text-white/75" : "text-ink-2",
        )}
      >
        <span>Moins protégé</span>
        <span className={cx("trace-x relative h-px flex-1", sombre ? "bg-white/45" : "bg-ink-2")}>
          <span
            className={cx(
              "absolute -top-[5px] -right-px border-y-[5.5px] border-l-[9px] border-y-transparent",
              sombre ? "border-l-white/80" : "border-l-ink-2",
            )}
          />
        </span>
        <span>Plus protégé</span>
      </div>
      <p className={cx("mb-4 text-small font-semibold tab:hidden", sombre ? "text-white/75" : "text-ink-2")}>
        {typo("Du moins protégé au plus protégé :")}
      </p>

      <ol className="grid gap-4 tab:grid-cols-3 tab:gap-6">
        {DOCUMENTS.map((d, i) => {
          const fort = sombre && d.cle === "tf";
          return (
            <li
              key={d.cle}
              className={cx(
                "group relative flex flex-col border p-6 transition-[border-color,background-color,translate] duration-300 hover:-translate-y-1 desk:p-7",
                i === 1 ? "reveler-2" : i === 2 ? "reveler-3" : "reveler",
                fort
                  ? "border-white bg-paper text-ink"
                  : sombre
                    ? "border-white/25 hover:border-white/80 hover:bg-white/5"
                    : "border-rule bg-paper hover:border-trait",
              )}
            >
              {/* Pas de numéro : « 1 sur 3 » se lirait comme une note. L'ordre est dans l'axe. */}
              <h3 className={cx(T3, "flex items-center gap-3")}>
                <span aria-hidden="true" className={cx("size-3 flex-none", BORNES[d.cle])} />
                {d.nom}
              </h3>
              <p className="mt-1 font-semibold">{typo(`Niveau de sécurité : ${d.niveau.texte.toLowerCase()}.`)}</p>
              <p className={cx("mt-4", fort || !sombre ? "text-ink-2" : "text-white/80")}>{typo(d.definition.texte)}</p>
              {variante === "page" ? (
                <>
                  <p className="mt-3 text-ink-2">{typo(d.aSavoir.texte)}</p>
                  <p className="mt-auto pt-5 text-small">
                    <span className="font-semibold">{typo("Chez Saloum Immo : ")}</span>
                    {typo(d.chezNous.texte)}
                  </p>
                </>
              ) : fort ? (
                <p className="mt-auto pt-5 text-small font-semibold text-trait">{typo(`Chez Saloum Immo : ${d.chezNous.texte}`)}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
