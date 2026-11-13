import { MOBILE } from "@/content/site";
import { cx } from "@/lib/base";
import { classesBouton, type TailleBouton } from "./whatsapp-button";

/**
 * Bouton « Appeler » (3.3), même gabarit que le bouton WhatsApp.
 * line : sur fond bleu, bordure et texte blancs ; survol fond blanc, texte trait.
 */
export function CallButton({
  label = "Appeler",
  variant = "trait",
  size = "md",
  pleineLargeur = true,
  className,
}: {
  label?: string;
  variant?: "trait" | "line";
  size?: TailleBouton;
  pleineLargeur?: boolean;
  className?: string;
}) {
  return (
    <a
      href={MOBILE.href}
      className={cx(
        classesBouton(size, pleineLargeur),
        variant === "line"
          ? "border-white text-white hover:bg-white hover:text-trait active:bg-white active:text-trait"
          : "border-trait bg-trait text-white hover:border-ink hover:bg-ink active:border-ink active:bg-ink",
        className,
      )}
    >
      {label}
    </a>
  );
}
