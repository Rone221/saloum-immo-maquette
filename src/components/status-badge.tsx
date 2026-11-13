import { InfoIcon, SealCheckIcon } from "@phosphor-icons/react/dist/ssr";
import { LAND_STATUSES, type LandStatusKey } from "@/lib/data";

const tone: Record<LandStatusKey, string> = {
  "titre-foncier": "bg-accent-soft text-accent",
  bail: "bg-surface-2 text-ink",
  deliberation: "bg-reserved-soft text-reserved",
};

// Statut juridique toujours visible. Avec `explain`, l'explication s'affiche au survol et au focus clavier.
export function StatusBadge({ status, explain = false }: { status: LandStatusKey; explain?: boolean }) {
  const s = LAND_STATUSES[status];
  const chip = (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold ${tone[status]}`}
    >
      {status === "titre-foncier" ? (
        <SealCheckIcon size={15} weight="fill" aria-hidden />
      ) : null}
      {s.label}
      {explain ? <InfoIcon size={14} aria-hidden className="opacity-70" /> : null}
    </span>
  );

  if (!explain) return chip;

  return (
    <span tabIndex={0} className="group relative inline-flex rounded-full" aria-label={`${s.label}. ${s.summary}`}>
      {chip}
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-0 top-[calc(100%+8px)] z-30 w-72 rounded-2xl border border-line bg-surface p-4 text-left text-sm font-normal leading-relaxed text-ink-2 opacity-0 shadow-[0_18px_40px_-18px_rgb(13_26_43/0.35)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
      >
        <span className="mb-1 block font-semibold text-ink">
          {s.label} : {s.security.toLowerCase()}
        </span>
        {s.summary}
      </span>
    </span>
  );
}
