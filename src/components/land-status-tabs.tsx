"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import { LAND_STATUSES, PROGRAMMES, type LandStatusKey } from "@/lib/data";

const KEYS: LandStatusKey[] = ["titre-foncier", "bail", "deliberation"];

const ADVICE: Record<LandStatusKey, string> = {
  "titre-foncier":
    "Demandez toujours un état des droits réels récent. Il prouve que le titre est au nom du vendeur et sans hypothèque.",
  bail: "Vérifiez la durée restante du bail et le coût de sa transformation en titre foncier avant de vous engager.",
  deliberation:
    "Si un vendeur vous propose une délibération, demandez le plan de régularisation et faites-le valider par votre notaire.",
};

export function LandStatusTabs() {
  const [active, setActive] = useState<LandStatusKey>("titre-foncier");
  const reduce = useReducedMotion();
  const s = LAND_STATUSES[active];
  const ours = PROGRAMMES.filter((p) => p.status === active && p.kind !== "maison");

  return (
    <div className="rounded-2xl border border-line bg-surface p-2 sm:p-3">
      <div role="tablist" aria-label="Statuts juridiques" className="grid grid-cols-3 gap-1 rounded-full bg-surface-2 p-1">
        {KEYS.map((k) => (
          <button
            key={k}
            role="tab"
            id={`tab-${k}`}
            aria-selected={active === k}
            aria-controls={`panel-${k}`}
            onClick={() => setActive(k)}
            className={`relative h-10 rounded-full px-2 text-sm font-semibold transition-colors ${
              active === k ? "text-accent-ink" : "text-ink-2 hover:text-ink"
            }`}
          >
            {active === k ? (
              <motion.span
                layoutId="status-pill"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-accent"
              />
            ) : null}
            <span className="relative">{LAND_STATUSES[k].label}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="grid gap-8 p-5 sm:p-7 md:grid-cols-[1.1fr_1fr]"
      >
        <div>
          <p className="text-sm font-semibold text-accent">{s.security}</p>
          <p className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-ink">{s.summary}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{ADVICE[active]}</p>
          {ours.length ? (
            <p className="mt-5 text-sm text-ink-2">
              Nos programmes concernés :{" "}
              {ours.map((p, i) => (
                <span key={p.slug}>
                  <Link href={`/terrains/${p.slug}`} className="font-semibold text-accent underline-offset-4 hover:underline">
                    {p.name}
                  </Link>
                  {i < ours.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl bg-surface-2 p-5 sm:p-6">
          <p className="text-sm font-semibold text-ink">Les documents à obtenir</p>
          <ul className="mt-4 space-y-3">
            {s.docs.map((d) => (
              <li key={d} className="flex items-start gap-3 text-[15px] text-ink-2">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                  <CheckIcon size={12} weight="bold" aria-hidden />
                </span>
                {d}
              </li>
            ))}
          </ul>
          <Link
            href="/guide-foncier"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            Lire le guide foncier
            <ArrowRightIcon size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
