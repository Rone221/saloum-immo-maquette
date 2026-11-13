"use client";

import { useMemo, useState } from "react";
import { CursorClickIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { fcfa, waLink } from "@/lib/site";
import { btnPrimary } from "./ui";

type LotStatus = "libre" | "reserve" | "vendu";
type Lot = { n: number; surface: number; price: number | null; status: LotStatus; x: number; y: number; w: number; h: number };
type Amenity = { label: string; x: number; y: number; w: number; h: number };

export type PlotPlanProps = {
  slug: string;
  name: string;
  total: number;
  doubles: number;
  soldRatio: number;
  reservedRatio: number;
  offers: { surface: number; price: number | null }[];
  onSite: string[];
};

// Générateur déterministe : le même programme donne toujours le même plan.
function rng(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const UNIT = 34;
const ROW = 50;
const PER_ROW = 7;
const GAP = 26;
const PAD = 18;
const COLS = 3;
const BW = UNIT * PER_ROW;
const BH = ROW * 2;

function buildPlan(p: PlotPlanProps) {
  const rand = rng(p.slug);
  const small = p.offers[0];
  const big = p.offers[p.offers.length - 1];
  const mids = p.offers.slice(1, -1);

  // File des lots : quelques doubles répartis régulièrement.
  const queue: { w: 1 | 2 }[] = [];
  const step = p.doubles ? Math.floor(p.total / p.doubles) : Infinity;
  let doublesLeft = p.doubles;
  for (let i = 0; i < p.total; i++) {
    if (doublesLeft > 0 && i % step === step - 1) {
      queue.push({ w: 2 });
      doublesLeft--;
    } else queue.push({ w: 1 });
  }

  // Statuts tirés dans les proportions exactes du programme, pour coller aux chiffres affichés ailleurs.
  const sold = Math.round(p.total * p.soldRatio);
  const reserved = Math.round(p.total * p.reservedRatio);
  const statuses: LotStatus[] = [
    ...Array<LotStatus>(sold).fill("vendu"),
    ...Array<LotStatus>(reserved).fill("reserve"),
    ...Array<LotStatus>(p.total - sold - reserved).fill("libre"),
  ];
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }

  const lots: Lot[] = [];
  let block = 0;
  let n = 1;
  while (queue.length) {
    const bx = PAD + (block % COLS) * (BW + GAP);
    const by = PAD + Math.floor(block / COLS) * (BH + GAP);
    for (let r = 0; r < 2 && queue.length; r++) {
      let x = 0;
      while (x < PER_ROW && queue.length) {
        let idx = 0;
        if (queue[0].w === 2 && x === PER_ROW - 1) {
          idx = queue.findIndex((q) => q.w === 1);
          if (idx === -1) break;
        }
        const [item] = queue.splice(idx, 1);
        const offer = item.w === 2 ? big : mids.length && rand() < 0.35 ? mids[0] : small;
        const status = statuses[n - 1];
        lots.push({
          n: n++,
          surface: offer.surface,
          price: offer.price,
          status,
          x: bx + x * UNIT,
          y: by + r * ROW,
          w: item.w * UNIT,
          h: ROW,
        });
        x += item.w;
      }
    }
    block++;
  }

  // Équipements sur les emplacements de blocs restants.
  const amenities: Amenity[] = [];
  const slotsInGrid = Math.ceil(block / COLS) * COLS;
  let free = slotsInGrid - block;
  let rows = Math.ceil(block / COLS);
  if (p.onSite.length && free === 0) {
    free = COLS;
    rows += 1;
  }
  if (p.onSite.length) {
    const startSlot = rows * COLS - free;
    const perSlot = Math.ceil(p.onSite.length / free);
    p.onSite.forEach((label, i) => {
      const slot = startSlot + Math.floor(i / perSlot);
      const inSlot = i % perSlot;
      const countInSlot = Math.min(perSlot, p.onSite.length - Math.floor(i / perSlot) * perSlot);
      const sx = PAD + (slot % COLS) * (BW + GAP);
      const sy = PAD + Math.floor(slot / COLS) * (BH + GAP);
      const w = (BW - (countInSlot - 1) * 6) / countInSlot;
      amenities.push({ label, x: sx + inSlot * (w + 6), y: sy, w, h: BH });
    });
  }

  const width = PAD * 2 + COLS * BW + (COLS - 1) * GAP;
  const height = PAD * 2 + rows * BH + (rows - 1) * GAP;
  return { lots, amenities, width, height, rows };
}

const FILL: Record<LotStatus, string> = {
  libre: "var(--accent)",
  reserve: "var(--reserved)",
  vendu: "var(--sold)",
};

const STATUS_LABEL: Record<LotStatus, string> = {
  libre: "Disponible",
  reserve: "Réservé",
  vendu: "Vendu",
};

export function PlotPlan(props: PlotPlanProps) {
  const plan = useMemo(() => buildPlan(props), [props]);
  const [selected, setSelected] = useState<number | null>(null);
  const [onlyFree, setOnlyFree] = useState(false);
  const lot = plan.lots.find((l) => l.n === selected) ?? null;

  const counts = plan.lots.reduce(
    (acc, l) => ({ ...acc, [l.status]: acc[l.status] + 1 }),
    { libre: 0, reserve: 0, vendu: 0 } as Record<LotStatus, number>,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-2">
            {(Object.keys(FILL) as LotStatus[]).map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span aria-hidden className="size-3 rounded-[4px]" style={{ background: FILL[s], opacity: s === "vendu" ? 0.7 : 1 }} />
                {STATUS_LABEL[s]} <span className="text-muted tnum">({counts[s]})</span>
              </li>
            ))}
          </ul>
          <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-ink-2">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Lots libres seulement
          </label>
        </div>
        <div className="no-scrollbar overflow-x-auto rounded-xl bg-surface-2">
          <svg
            viewBox={`0 0 ${plan.width} ${plan.height}`}
            className="block h-auto w-full min-w-[640px]"
            role="group"
            aria-label={`Plan indicatif du lotissement ${props.name}`}
          >
            {/* voirie : le fond sert de route, les blocs sont posés dessus */}
            {Array.from({ length: plan.rows - 1 }).map((_, i) => (
              <text
                key={i}
                x={plan.width / 2}
                y={PAD + (i + 1) * (BH + GAP) - GAP / 2 + 4}
                textAnchor="middle"
                className="fill-[var(--muted)] text-[10px] font-medium uppercase tracking-[0.2em]"
              >
                {i === 0 ? "Voie principale" : "Voie secondaire"}
              </text>
            ))}
            {plan.amenities.map((a) => (
              <g key={a.label}>
                <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={8} fill="var(--surface)" stroke="var(--line)" strokeDasharray="4 4" />
                <text x={a.x + a.w / 2} y={a.y + a.h / 2 + 4} textAnchor="middle" className="fill-[var(--ink-2)] text-[11px] font-semibold">
                  {a.label}
                </text>
              </g>
            ))}
            {plan.lots.map((l) => {
              const dim = onlyFree && l.status !== "libre";
              const isSel = selected === l.n;
              const actionable = l.status === "libre";
              return (
                <g
                  key={l.n}
                  role={actionable ? "button" : undefined}
                  tabIndex={actionable ? 0 : undefined}
                  aria-label={`Lot ${l.n}, ${l.surface} m², ${STATUS_LABEL[l.status].toLowerCase()}`}
                  aria-pressed={actionable ? isSel : undefined}
                  onClick={() => setSelected(l.n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(l.n);
                    }
                  }}
                  className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--ink)] [&:focus-visible>rect]:stroke-[2.5]"
                  style={{ opacity: dim ? 0.18 : 1, transition: "opacity .25s" }}
                >
                  <title>{`Lot ${l.n}, ${l.surface} m², ${STATUS_LABEL[l.status].toLowerCase()}`}</title>
                  <rect
                    x={l.x + 1.5}
                    y={l.y + 1.5}
                    width={l.w - 3}
                    height={l.h - 3}
                    rx={4}
                    fill={FILL[l.status]}
                    fillOpacity={l.status === "vendu" ? 0.55 : l.status === "reserve" ? 0.85 : 0.92}
                    stroke={isSel ? "var(--ink)" : "transparent"}
                    strokeWidth={isSel ? 2.5 : 0}
                    className="transition-[fill-opacity] hover:[fill-opacity:1]"
                  />
                  {l.w >= UNIT ? (
                    <text
                      x={l.x + l.w / 2}
                      y={l.y + l.h / 2 + 4}
                      textAnchor="middle"
                      className={`pointer-events-none text-[11px] font-semibold tnum ${
                        l.status === "libre" ? "fill-[var(--accent-ink)]" : "fill-[var(--ink)]"
                      }`}
                    >
                      {l.n}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
        <p className="px-1 pt-3 text-[13px] text-muted">
          Plan indicatif. Le plan de lotissement officiel est remis avec le dossier de réservation.
        </p>
      </div>

      <div aria-live="polite" className="border-t border-line bg-bg/60 px-4 py-4 sm:px-5">
        {lot ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <dl className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[15px]">
              <div>
                <dt className="text-[13px] text-muted">Lot</dt>
                <dd className="font-display text-xl font-bold text-ink">N° {lot.n}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-muted">Surface</dt>
                <dd className="font-semibold text-ink">{lot.surface} m²</dd>
              </div>
              <div>
                <dt className="text-[13px] text-muted">Prix</dt>
                <dd className="font-semibold text-ink">{lot.price ? fcfa(lot.price) : "Sur demande"}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-muted">Statut</dt>
                <dd className="flex items-center gap-2 font-semibold text-ink">
                  <span aria-hidden className="size-2.5 rounded-full" style={{ background: FILL[lot.status] }} />
                  {STATUS_LABEL[lot.status]}
                </dd>
              </div>
            </dl>
            {lot.status === "libre" ? (
              <a
                href={waLink(
                  `Bonjour Saloum Immo, je suis intéressé(e) par le lot ${lot.n} (${lot.surface} m²) du programme ${props.name}. Est-il toujours disponible ?`,
                )}
                target="_blank"
                rel="noopener"
                className={btnPrimary}
              >
                <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
                WhatsApp
              </a>
            ) : (
              <p className="text-sm text-ink-2">Ce lot n&apos;est plus disponible. Choisissez un lot bleu.</p>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-3 text-[15px] text-ink-2">
            <CursorClickIcon size={20} aria-hidden className="shrink-0 text-accent" />
            Cliquez sur un lot bleu pour afficher sa surface et son prix, puis réservez-le sur WhatsApp.
          </p>
        )}
      </div>
    </div>
  );
}
