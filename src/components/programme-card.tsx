import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { availableLots, IMG_ALT, priceFrom, type Programme } from "@/lib/data";
import { fcfaShort, unsplash } from "@/lib/site";
import { StatusBadge } from "./status-badge";

export function surfacesLabel(p: Programme) {
  const s = p.offers.map((o) => o.surface);
  const unit = p.offers[0]?.unit ?? "m²";
  if (s.length === 1) return `${s[0]} ${unit}`;
  return `${Math.min(...s)} à ${Math.max(...s)} ${unit}`;
}

export function priceLabel(p: Programme) {
  const from = priceFrom(p);
  if (from) return `Dès ${fcfaShort(from)}`;
  return p.kind === "grande-surface" ? "Prix sur étude" : "Prix sur demande";
}

export function ProgrammeCard({
  p,
  size = "md",
  priority = false,
}: {
  p: Programme;
  size?: "lg" | "md";
  priority?: boolean;
}) {
  const avail = availableLots(p);
  return (
    <Link href={`/terrains/${p.slug}`} className="group flex h-full flex-col">
      <div
        className={`relative overflow-hidden rounded-2xl bg-surface-2 ${
          size === "lg" ? "aspect-[4/3] lg:aspect-auto lg:min-h-[420px] lg:flex-1" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={unsplash(p.image, size === "lg" ? 1600 : 900)}
          alt={IMG_ALT[p.image] ?? ""}
          fill
          preload={priority}
          sizes={size === "lg" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 28vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={`font-display font-bold tracking-tight text-ink ${size === "lg" ? "text-2xl" : "text-lg"}`}
          >
            {p.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPinIcon size={15} aria-hidden />
            {p.zone}, {p.locality}
          </p>
        </div>
        <StatusBadge status={p.status} />
      </div>
      {size === "lg" ? <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted">{p.tagline}</p> : null}
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4 text-sm">
        <span className="font-semibold text-ink tnum">{priceLabel(p)}</span>
        <span className="flex items-center gap-1.5 text-muted">
          {avail !== null ? (
            <span className="tnum">
              {avail} lots libres · {surfacesLabel(p)}
            </span>
          ) : (
            <span>{surfacesLabel(p)}</span>
          )}
          <ArrowUpRightIcon
            size={16}
            aria-hidden
            className="text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
