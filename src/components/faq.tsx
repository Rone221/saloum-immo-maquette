import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

// Accordéon natif : fonctionne sans JavaScript, accessible au clavier.
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it) => (
        <details key={it.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold text-ink">
            {it.q}
            <PlusIcon
              size={20}
              aria-hidden
              className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-[68ch] pb-6 text-[15px] leading-relaxed text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
