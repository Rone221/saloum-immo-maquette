"use client";

import { useState } from "react";
import { CalculatorIcon } from "@phosphor-icons/react";
import { fcfa } from "@/lib/site";

const nf = new Intl.NumberFormat("fr-FR");
const APPORTS = [30, 40, 50];
const DUREES = [6, 12, 24];

function Segmented<T extends number>({
  label,
  options,
  value,
  onChange,
  format,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  format: (v: T) => string;
}) {
  return (
    <fieldset>
      <legend className="text-[13px] font-medium text-ink-2">{label}</legend>
      <div className="mt-2 grid gap-1 rounded-full bg-surface-2 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <label
            key={o}
            className={`grid h-9 cursor-pointer place-items-center rounded-full text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
              value === o ? "bg-surface text-ink shadow-[0_1px_2px_rgb(13_26_43/0.12)]" : "text-ink-2 hover:text-ink"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              name={label}
              checked={value === o}
              onChange={() => onChange(o)}
            />
            <span className="tnum">{format(o)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function PaymentSimulator({ offers }: { offers: { surface: number; price: number }[] }) {
  const [surface, setSurface] = useState(offers[0].surface);
  const [apport, setApport] = useState(30);
  const [duree, setDuree] = useState(12);
  const price = offers.find((o) => o.surface === surface)?.price ?? offers[0].price;
  const upfront = Math.round((price * apport) / 100);
  const monthly = Math.round((price - upfront) / duree / 1000) * 1000;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
          <CalculatorIcon size={20} aria-hidden />
        </span>
        <h3 className="font-display text-xl font-bold tracking-tight text-ink">Simuler un paiement échelonné</h3>
      </div>
      <div className="mt-6 grid gap-5">
        <Segmented label="Surface" options={offers.map((o) => o.surface)} value={surface} onChange={setSurface} format={(v) => `${v} m²`} />
        <Segmented label="Apport à la réservation" options={APPORTS} value={apport} onChange={setApport} format={(v) => `${v} %`} />
        <Segmented label="Durée" options={DUREES} value={duree} onChange={setDuree} format={(v) => `${v} mois`} />
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line">
        <div className="bg-surface-2 p-4">
          <dt className="text-[13px] text-muted">Apport, en FCFA</dt>
          <dd className="mt-1 whitespace-nowrap text-lg font-bold text-ink tnum">{nf.format(upfront)}</dd>
        </div>
        <div className="bg-surface-2 p-4">
          <dt className="text-[13px] text-muted">Par mois, en FCFA</dt>
          <dd className="mt-1 whitespace-nowrap text-lg font-bold text-accent tnum">{nf.format(monthly)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        Simulation indicative sur un prix de <span className="tnum">{fcfa(price)}</span>, sans frais financiers. Les
        conditions réelles sont fixées à la réservation.
      </p>
    </div>
  );
}
