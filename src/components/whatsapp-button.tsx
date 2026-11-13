import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";

export type TailleBouton = "md" | "s";

/** Gabarit commun aux boutons WhatsApp et Appeler (3.3). */
export function classesBouton(taille: TailleBouton, pleineLargeur: boolean) {
  return cx(
    "inline-flex items-center justify-center rounded-1 border-[1.5px] py-2 text-center font-semibold leading-snug transition-surface",
    taille === "md" ? "min-h-13 px-5.5 text-3" : "min-h-11.5 px-4.5 text-2",
    pleineLargeur && "w-full tab:w-auto",
  );
}

const TONS = {
  trait: "border-trait bg-trait text-white hover:border-ink hover:bg-ink active:border-ink active:bg-ink",
  inv: "border-white bg-white text-trait hover:border-ink hover:bg-ink hover:text-white active:border-ink active:bg-ink active:text-white",
};

type Props = {
  /** Contient toujours le mot « WhatsApp » : « Demander les lots sur WhatsApp ». */
  label: string;
  /**
   * Nom accessible, quand deux boutons d'une page ont le même libellé (« Demander
   * sur WhatsApp, Bayakh »). Commence par le libellé visible (WCAG 2.5.3).
   */
  ariaLabel?: string;
  /** Texte pré-rempli, affiché sous le bouton. Le même texte part dans le lien. */
  message?: string;
  /** true : « Message à compléter » (gabarit avec [champs]). */
  template?: boolean;
  size?: TailleBouton;
  /** inv : bouton blanc sur le fond bleu du contact. */
  tone?: "trait" | "inv";
  /** ligne : bouton et message côte à côte dès 761 px (offre datée). */
  layout?: "pile" | "ligne";
  /** Pleine largeur sous 761 px (par défaut, dans un bloc d'action). */
  pleineLargeur?: boolean;
  /**
   * false : le message n'est pas rendu ici, l'appelant pose lui-même un
   * <MessagePreview> avec le même texte (contact : message sous les deux boutons).
   */
  apercu?: boolean;
  /** Classes du bloc d'action (marges). */
  className?: string;
};

/** Bouton WhatsApp et le message qu'il enverra (3.3). Aucun logo. */
export function WhatsAppButton({
  label,
  ariaLabel,
  message,
  template = false,
  size = "md",
  tone = "trait",
  layout = "pile",
  pleineLargeur = true,
  apercu = true,
  className,
}: Props) {
  const texte = message ? typo(message) : undefined;
  if (!apercu) {
    return (
      <a href={waHref(texte)} aria-label={ariaLabel} className={cx(classesBouton(size, pleineLargeur), TONS[tone], className)}>
        {typo(label)}
      </a>
    );
  }
  return (
    <div
      className={cx(
        layout === "ligne" && "tab:flex tab:flex-wrap tab:items-center tab:gap-x-6 tab:gap-y-2",
        className,
      )}
    >
      <a href={waHref(texte)} aria-label={ariaLabel} className={cx(classesBouton(size, pleineLargeur), TONS[tone])}>
        {typo(label)}
      </a>
      {texte ? (
        <MessagePreview texte={texte} template={template} tone={tone} className={layout === "ligne" ? "tab:mt-0" : undefined} />
      ) : null}
    </div>
  );
}

/** Le message pré-rédigé, sous le bouton (3.3). */
export function MessagePreview({
  texte,
  template = false,
  tone = "trait",
  className,
}: {
  texte: string;
  template?: boolean;
  tone?: "trait" | "inv";
  className?: string;
}) {
  return (
    <p className={cx("mt-2.5 max-w-[32em] text-2 leading-caption", tone === "inv" ? "text-white/90" : "text-ink-2", className)}>
      <span
        className={cx(
          "mb-0.5 block font-mono text-1 leading-label font-medium",
          tone === "inv" ? "text-white" : "text-trait",
        )}
      >
        {template ? "Message à compléter" : "Message envoyé"}
      </span>
      {typo(`« ${texte} »`)}
    </p>
  );
}
