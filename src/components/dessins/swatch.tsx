import { STATUT_FONCIER_MOT, type StatutFoncier } from "@/content/types";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

const MOTIFS: Record<StatutFoncier, string> = {
  delib: "hatch-delib",
  bail: "hatch-bail",
  tf: "hatch-tf",
  // Ajout de la spécification : contour en tirets, sans remplissage.
  "non-publie": "bg-paper border-dashed",
};

const TAILLES = {
  /** 44 × 28 : offre datée, catalogue, liens de programmes. */
  md: "h-7 w-11",
  /** 36 × 24 : dans la clé. */
  cle: "h-6 w-9",
  /** 132 × 52 (72 × 32 sur mobile) : jauge du tableau des documents. */
  jauge: "h-8 w-18 tab:h-13 tab:w-33",
  /** Grand échantillon à la place d'une photo (offre AIBD). */
  grand: "aspect-[4/3] w-full",
};

/**
 * Échantillon du statut foncier (2.8). Toujours aria-hidden : le mot à côté porte le sens.
 */
export function Swatch({
  statut,
  taille = "md",
  className,
}: {
  statut: StatutFoncier;
  taille?: keyof typeof TAILLES;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx("inline-block flex-none border-[1.5px] border-trait", MOTIFS[statut], TAILLES[taille], className)}
    />
  );
}

/**
 * Jauge (3.7) : l'échantillon agrandi et, dessous (à côté sur mobile), le niveau
 * publié en mots. Jamais d'étoiles, de barres ou de note sur 5.
 */
export function Gauge({
  statut,
  niveau,
  empile = false,
  className,
}: {
  statut: StatutFoncier;
  niveau: string;
  /** true : niveau sous l'échantillon à toutes les largeurs (rangée de l'accueil). */
  empile?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "flex",
        empile ? "flex-col items-start gap-1.5 tab:gap-2.5" : "flex-row items-center gap-3 tab:flex-col tab:items-start tab:gap-2.5",
        className,
      )}
    >
      <Swatch statut={statut} taille="jauge" />
      <span className="font-semibold">{typo(niveau)}</span>
    </span>
  );
}

/** Échantillon et son mot, sur une ligne (catalogue, fiches, liens de programmes). */
export function StatutEnLigne({
  statut,
  texte,
  className,
}: {
  statut: StatutFoncier;
  /** Par défaut, le mot du statut (« Titre foncier »). */
  texte?: string;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <Swatch statut={statut} />
      <span>{typo(texte ?? STATUT_FONCIER_MOT[statut])}</span>
    </span>
  );
}
