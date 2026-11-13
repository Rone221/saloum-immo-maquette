import Link from "next/link";

// Wordmark provisoire. Le logo officiel (monogramme « SI ») sera intégré en vectoriel.
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Saloum Immo, retour à l'accueil">
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-[10px] bg-accent font-display text-[15px] font-extrabold tracking-tight text-accent-ink"
      >
        SI
      </span>
      <span
        className={`whitespace-nowrap font-display text-[17px] font-bold leading-none tracking-tight ${onDark ? "text-panel-ink" : "text-ink"}`}
      >
        Saloum <span className={onDark ? "text-panel-muted" : "text-accent"}>Immo</span>
      </span>
    </Link>
  );
}
