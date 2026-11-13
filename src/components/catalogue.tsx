"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowCounterClockwiseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { IMG_ALT, LAND_STATUSES, OFFERS, ZONES, type Offer } from "@/lib/data";
import { fcfaShort, unsplash, waLink } from "@/lib/site";
import { BUDGETS } from "./hero-search";
import { btnPrimary, btnSecondary, selectBase } from "./ui";

const TYPES = [
  { value: "lotissement", label: "Parcelles en lotissement" },
  { value: "grande-surface", label: "Grandes surfaces" },
  { value: "maison", label: "Maisons" },
];

const SURFACES = [
  { value: "0-160", label: "Jusqu'à 160 m²" },
  { value: "160-260", label: "160 à 260 m²" },
  { value: "260-1000", label: "Plus de 260 m²" },
  { value: "ha", label: "En hectares" },
];

type Sort = "pertinence" | "prix" | "surface";

function matchSurface(o: Offer, s: string) {
  if (!s) return true;
  if (s === "ha") return o.unit === "ha";
  if (o.unit === "ha") return false;
  const [min, max] = s.split("-").map(Number);
  return o.surface > min && o.surface <= max;
}

export function Catalogue() {
  const sp = useSearchParams();
  const [zone, setZone] = useState(sp.get("zone") ?? "");
  const [statut, setStatut] = useState(sp.get("statut") ?? "");
  const [budget, setBudget] = useState(sp.get("budget") ?? "");
  const [type, setType] = useState(sp.get("type") ?? "");
  const [surface, setSurface] = useState("");
  const [sort, setSort] = useState<Sort>("pertinence");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const active = [zone, statut, budget, type, surface].filter(Boolean).length;

  const results = useMemo(() => {
    const max = budget ? Number(budget) : null;
    const list = OFFERS.filter(
      (o) =>
        (!zone || o.programme.zone === zone) &&
        (!statut || o.programme.status === statut) &&
        (!type || o.programme.kind === type) &&
        matchSurface(o, surface) &&
        (max === null || (o.price !== null && o.price <= max)),
    );
    if (sort === "prix") {
      return [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }
    if (sort === "surface") {
      const m2 = (o: Offer) => (o.unit === "ha" ? o.surface * 10_000 : o.surface);
      return [...list].sort((a, b) => m2(a) - m2(b));
    }
    return list;
  }, [zone, statut, budget, type, surface, sort]);

  function reset() {
    setZone("");
    setStatut("");
    setBudget("");
    setType("");
    setSurface("");
  }

  const criteria = [
    zone && `zone ${zone}`,
    statut && LAND_STATUSES[statut as keyof typeof LAND_STATUSES]?.label.toLowerCase(),
    budget && `budget max ${fcfaShort(Number(budget))}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          className={btnSecondary}
          aria-expanded={filtersOpen}
          aria-controls="filtres"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <FunnelIcon size={18} aria-hidden />
          Filtres{active ? ` (${active})` : ""}
        </button>
        <SortSelect id="tri-mobile" sort={sort} setSort={setSort} />
      </div>

      <div
        id="filtres"
        className={`${filtersOpen ? "grid" : "hidden"} mt-4 gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:mt-0 lg:grid lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-end`}
      >
        <Field id="f-zone" label="Zone">
          <select id="f-zone" value={zone} onChange={(e) => setZone(e.target.value)} className={selectBase}>
            <option value="">Toutes</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-statut" label="Statut juridique">
          <select id="f-statut" value={statut} onChange={(e) => setStatut(e.target.value)} className={selectBase}>
            <option value="">Tous</option>
            <option value="titre-foncier">Titre foncier</option>
            <option value="bail">Bail</option>
            <option value="deliberation">Délibération</option>
          </select>
        </Field>
        <Field id="f-type" label="Type de bien">
          <select id="f-type" value={type} onChange={(e) => setType(e.target.value)} className={selectBase}>
            <option value="">Tous</option>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-surface" label="Surface">
          <select id="f-surface" value={surface} onChange={(e) => setSurface(e.target.value)} className={selectBase}>
            <option value="">Toutes</option>
            {SURFACES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-budget" label="Budget">
          <select id="f-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={selectBase}>
            <option value="">Tous</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          onClick={reset}
          disabled={!active}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-accent transition-opacity disabled:opacity-40"
        >
          <ArrowCounterClockwiseIcon size={16} aria-hidden />
          Réinitialiser
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-semibold text-ink tnum">{results.length}</span>{" "}
          {results.length > 1 ? "offres correspondent" : "offre correspond"} à votre recherche
        </p>
        <div className="hidden lg:block">
          <SortSelect id="tri" sort={sort} setSort={setSort} />
        </div>
      </div>

      {results.length ? (
        <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((o, i) => (
            <li key={o.id}>
              <OfferCard o={o} eager={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
            <MagnifyingGlassIcon size={22} aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold text-ink">Aucune offre ne correspond pour l&apos;instant</h2>
          <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted">
            Élargissez la zone ou le budget. Ou confiez-nous votre recherche : de nouvelles parcelles arrivent
            chaque mois.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className={btnSecondary}>
              Réinitialiser
            </button>
            <a
              href={waLink(
                `Bonjour Saloum Immo, je cherche un terrain${criteria ? ` (${criteria})` : ""}. Pouvez-vous me prévenir des nouvelles offres ?`,
              )}
              target="_blank"
              rel="noopener"
              className={btnPrimary}
            >
              <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function SortSelect({ id, sort, setSort }: { id: string; sort: Sort; setSort: (s: Sort) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-muted">
        Trier
      </label>
      <select
        id={id}
        value={sort}
        onChange={(e) => setSort(e.target.value as Sort)}
        className={`${selectBase} h-10 w-auto min-w-[150px]`}
      >
        <option value="pertinence">Pertinence</option>
        <option value="prix">Prix croissant</option>
        <option value="surface">Surface croissante</option>
      </select>
    </div>
  );
}

function OfferCard({ o, eager = false }: { o: Offer; eager?: boolean }) {
  const p = o.programme;
  const s = LAND_STATUSES[p.status];
  const title =
    p.kind === "maison"
      ? `Maison de ${o.surface} m²`
      : o.unit === "ha"
        ? `${o.surface === 1 ? "Lot d'un hectare" : `Lot de ${o.surface} hectares`}`
        : `Parcelle de ${o.surface} m²`;
  const price =
    o.price !== null ? fcfaShort(o.price) : p.kind === "grande-surface" ? "Prix sur étude" : "Prix sur demande";
  const perM2 = o.price !== null && o.unit === "m²" ? Math.round(o.price / o.surface / 500) * 500 : null;

  return (
    <Link href={`/terrains/${p.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2">
        <Image
          src={unsplash(o.image, 900)}
          alt={IMG_ALT[o.image] ?? ""}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 48vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-bold tracking-tight text-ink">{title}</h3>
        <p className="shrink-0 font-semibold text-ink tnum">{price}</p>
      </div>
      <p className="mt-1 text-sm text-muted">{p.name}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span
          className={`inline-flex h-7 items-center rounded-full px-2.5 text-[13px] font-semibold ${
            p.status === "titre-foncier"
              ? "bg-accent-soft text-accent"
              : p.status === "bail"
                ? "bg-surface-2 text-ink"
                : "bg-reserved-soft text-reserved"
          }`}
        >
          {s.label}
        </span>
        <span className="flex items-center gap-1.5 text-muted">
          <MapPinIcon size={15} aria-hidden />
          {p.zone}
        </span>
        {perM2 ? <span className="text-muted tnum">{new Intl.NumberFormat("fr-FR").format(perM2)} FCFA/m²</span> : null}
      </div>
      {o.available !== null ? (
        <p className="mt-3 text-sm font-medium text-accent tnum">
          {o.available} {o.available > 1 ? "lots disponibles" : "lot disponible"}
        </p>
      ) : null}
    </Link>
  );
}

export function CatalogueSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="hidden h-[86px] rounded-2xl bg-surface-2 lg:block" />
      <div className="mt-8 h-5 w-64 rounded-full bg-surface-2" />
      <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/3] rounded-2xl bg-surface-2" />
            <div className="mt-4 h-5 w-2/3 rounded-full bg-surface-2" />
            <div className="mt-2 h-4 w-1/3 rounded-full bg-surface-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
