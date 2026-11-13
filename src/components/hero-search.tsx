"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { ZONES } from "@/lib/data";
import { btnPrimary, selectBase } from "./ui";

export const BUDGETS = [
  { value: "5000000", label: "Jusqu'à 5 M FCFA" },
  { value: "10000000", label: "Jusqu'à 10 M FCFA" },
  { value: "20000000", label: "Jusqu'à 20 M FCFA" },
];

export function HeroSearch() {
  const router = useRouter();
  const [zone, setZone] = useState("");
  const [statut, setStatut] = useState("");
  const [budget, setBudget] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (zone) q.set("zone", zone);
    if (statut) q.set("statut", statut);
    if (budget) q.set("budget", budget);
    const qs = q.toString();
    router.push(`/terrains${qs ? `?${qs}` : ""}`);
  }

  const select = selectBase;

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Rechercher un terrain"
      className="rounded-2xl border border-line bg-surface p-4 shadow-[0_24px_60px_-32px_rgb(13_26_43/0.35)] sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <label htmlFor="hs-zone" className="text-[13px] font-medium text-ink-2">
            Zone
          </label>
          <select id="hs-zone" value={zone} onChange={(e) => setZone(e.target.value)} className={select}>
            <option value="">Toutes</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="hs-statut" className="text-[13px] font-medium text-ink-2">
            Statut juridique
          </label>
          <select id="hs-statut" value={statut} onChange={(e) => setStatut(e.target.value)} className={select}>
            <option value="">Tous</option>
            <option value="titre-foncier">Titre foncier</option>
            <option value="bail">Bail</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="hs-budget" className="text-[13px] font-medium text-ink-2">
            Budget
          </label>
          <select id="hs-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={select}>
            <option value="">Tous</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className={`${btnPrimary} mt-4 w-full`}>
        <MagnifyingGlassIcon size={18} weight="bold" aria-hidden />
        Voir les terrains
      </button>
    </form>
  );
}
