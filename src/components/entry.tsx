import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Lien } from "./text-link";

/**
 * Grande entrée de l'ouverture (3.3). Jamais plus de deux.
 * A : fond trait. B : fond papier, bordure encre. Survol des deux : fond encre.
 * La flèche ↓ n'apparaît que si le lien mène plus bas sur la même page.
 */
export function Entry({
  href,
  titre,
  sousTitre,
  variante,
}: {
  href: string;
  titre: string;
  sousTitre: string;
  variante: "a" | "b";
}) {
  const plusBas = href.startsWith("#");
  return (
    <Lien
      href={href}
      className={cx(
        "group relative flex flex-col gap-0.5 rounded-1 border-[1.5px] py-3 pr-11 pl-4 transition-surface tab:min-h-25 tab:gap-1.5 tab:py-4.5 tab:pr-12 tab:pl-5",
        variante === "a"
          ? "border-trait bg-trait text-white hover:border-ink hover:bg-ink"
          : "border-ink bg-paper text-ink hover:bg-ink hover:text-white",
      )}
    >
      <span className="text-4 leading-snug font-650 stretch-sub">{typo(titre)}</span>
      <span
        className={cx(
          "text-2 leading-caption",
          variante === "a" ? "text-white/90" : "text-ink-2 group-hover:text-white/88",
        )}
      >
        {typo(sousTitre)}
      </span>
      {plusBas ? (
        <span aria-hidden="true" className="absolute top-3 right-4 text-4 leading-tight tab:top-3.5">
          ↓
        </span>
      ) : null}
    </Lien>
  );
}
