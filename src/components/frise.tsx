import type { Travail } from "@/content/registre";
import { cx } from "@/lib/base";
import { moisEnLettres, typo } from "@/lib/format";

/**
 * Frise des travaux datés (revue 2) : un trait qui se trace au défilement, une borne
 * par chantier, le mois en gras, le fait dessous. Horizontale dès 761 px, verticale
 * en dessous. Pas de compteur, pas de cumul : des faits datés, un par jalon.
 * `sources` : les liens des sources sous chaque fait (page Aménager).
 */
export function Frise({
  travaux,
  sources = false,
  ton = "clair",
  className,
}: {
  travaux: Travail[];
  sources?: boolean;
  ton?: "clair" | "sombre";
  className?: string;
}) {
  const sombre = ton === "sombre";
  return (
    <ol className={cx("relative grid gap-y-8 tab:grid-cols-4 tab:gap-x-6", className)}>
      {/* Le trait : vertical sur mobile (à gauche des bornes), horizontal au-delà. */}
      <span
        aria-hidden="true"
        className={cx("trace-y absolute top-2 bottom-2 left-[5px] w-px tab:hidden", sombre ? "bg-white/40" : "bg-ink")}
      />
      <span
        aria-hidden="true"
        className={cx("trace-x absolute top-[5px] right-0 left-0 hidden h-px tab:block", sombre ? "bg-white/40" : "bg-ink")}
      />
      {travaux.map((t, i) => (
        <li
          key={t.id}
          className={cx(
            "group relative pl-8 tab:pl-0 tab:pt-9",
            i === 1 ? "reveler-2" : i >= 2 ? "reveler-3" : "reveler",
          )}
        >
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 size-[11px] border-[1.5px] border-ink bg-borne transition-transform duration-300 group-hover:scale-125"
          />
          <p className="font-semibold tabular-nums">{moisEnLettres(t.mois)}</p>
          <p className={cx("mt-1.5 tabular-nums", sombre ? "text-white/85" : "text-ink-2")}>{typo(t.texte.texte)}</p>
          {sources ? (
            <p className="mt-2 flex flex-col text-small">
              {t.sources.map((s) =>
                s.href ? (
                  <a
                    key={s.libelle}
                    href={s.href}
                    className="inline-flex min-h-11 items-center text-trait underline decoration-1 underline-offset-4 hover:decoration-2"
                  >
                    {typo(s.libelle)}
                  </a>
                ) : (
                  <span key={s.libelle} className="inline-flex min-h-11 items-center text-ink-2">
                    {typo(s.libelle)}
                  </span>
                ),
              )}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
