"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircleIcon, CircleNotchIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { waLink } from "@/lib/site";
import { btnPrimary, btnSecondary, inputBase, selectBase } from "./ui";

type Variant = "visite" | "diaspora" | "devis" | "contact";

const SUBMIT: Record<Variant, string> = {
  visite: "Réserver une visite",
  diaspora: "Réserver une visite vidéo",
  devis: "Demander un devis",
  contact: "Envoyer",
};

const INDICATIFS = ["+221", "+33", "+39", "+34", "+1", "+44", "+32", "+41", "+49", "+212", "+225"];

const PAYS = ["France", "Italie", "Espagne", "États-Unis", "Canada", "Royaume-Uni", "Belgique", "Suisse", "Allemagne", "Côte d'Ivoire", "Maroc", "Autre"];

type Errors = Partial<Record<"nom" | "tel" | "pays" | "date", string>>;

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-aide`} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-erreur`} className="text-[13px] font-medium text-reserved">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LeadForm({
  variant,
  programme,
  defaultSujet,
}: {
  variant: Variant;
  programme?: string;
  defaultSujet?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [prenom, setPrenom] = useState("");
  const [mode, setMode] = useState<"place" | "video">(variant === "diaspora" ? "video" : "place");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nom = String(fd.get("nom") ?? "").trim();
    const tel = String(fd.get("tel") ?? "").replace(/\D/g, "");
    const next: Errors = {};
    if (nom.length < 2) next.nom = "Indiquez votre nom pour que l'on sache qui rappeler.";
    if (tel.length < 8) next.tel = "Numéro trop court. Vérifiez les chiffres saisis.";
    if (variant === "diaspora" && !fd.get("pays")) next.pays = "Choisissez votre pays pour caler l'horaire.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(`${variant}-${first}`)?.focus();
      return;
    }
    setPrenom(nom.split(" ")[0]);
    setState("sending");
    await new Promise((r) => setTimeout(r, 900));
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
          <CheckCircleIcon size={26} weight="fill" aria-hidden />
        </span>
        <p className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">Merci {prenom}, c&apos;est noté.</p>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
          Un conseiller Saloum Immo vous rappelle pour confirmer{" "}
          {variant === "devis" ? "votre projet" : variant === "contact" ? "votre demande" : "le jour et l'heure de la visite"}.
          Pour aller plus vite, écrivez-nous directement.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={waLink(
              `Bonjour Saloum Immo, je viens de faire une demande sur le site${programme ? ` pour ${programme}` : ""}. Je m'appelle ${prenom}.`,
            )}
            target="_blank"
            rel="noopener"
            className={btnPrimary}
          >
            <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
            WhatsApp
          </a>
          <button type="button" onClick={() => setState("idle")} className={btnSecondary}>
            Nouvelle demande
          </button>
        </div>
        <p className="mt-5 text-[13px] text-muted">Maquette : l&apos;envoi est simulé.</p>
      </div>
    );
  }

  const id = (k: string) => `${variant}-${k}`;
  const describedBy = (k: keyof Errors) => (errors[k] ? `${id(k)}-erreur` : undefined);

  return (
    <form
      onSubmit={onSubmit}
      onChange={(e) => {
        const name = (e.target as unknown as { name?: string }).name as keyof Errors;
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
      }}
      noValidate
      className="grid gap-5 rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      {programme ? (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent">Programme : {programme}</p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("nom")} label="Nom complet" error={errors.nom}>
          <input
            id={id("nom")}
            name="nom"
            autoComplete="name"
            className={inputBase}
            aria-invalid={!!errors.nom}
            aria-describedby={describedBy("nom")}
          />
        </Field>
        <Field id={id("tel")} label="Téléphone WhatsApp" error={errors.tel}>
          <div className="flex min-w-0 gap-2">
            <label htmlFor={id("indicatif")} className="sr-only">
              Indicatif
            </label>
            <div className="w-[100px] shrink-0">
              <select
                id={id("indicatif")}
                name="indicatif"
                defaultValue={variant === "diaspora" ? "+33" : "+221"}
                className={selectBase}
              >
                {INDICATIFS.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
            <input
              id={id("tel")}
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              className={`${inputBase} min-w-0`}
              aria-invalid={!!errors.tel}
              aria-describedby={describedBy("tel")}
            />
          </div>
        </Field>
      </div>

      {variant === "visite" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className="text-sm font-medium text-ink">Type de visite</legend>
            <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
              {(
                [
                  ["place", "Sur place"],
                  ["video", "En vidéo"],
                ] as const
              ).map(([v, l]) => (
                <label
                  key={v}
                  className={`grid h-9 cursor-pointer place-items-center rounded-full text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    mode === v ? "bg-surface text-ink shadow-[0_1px_2px_rgb(13_26_43/0.12)]" : "text-ink-2"
                  }`}
                >
                  <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} className="sr-only" />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
          <Field id={id("date")} label="Date souhaitée" hint="Du lundi au samedi.">
            <input id={id("date")} name="date" type="date" className={inputBase} aria-describedby={`${id("date")}-aide`} />
          </Field>
        </div>
      ) : null}

      {variant === "diaspora" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("pays")} label="Pays de résidence" error={errors.pays}>
            <select
              id={id("pays")}
              name="pays"
              defaultValue=""
              className={selectBase}
              aria-invalid={!!errors.pays}
              aria-describedby={describedBy("pays")}
            >
              <option value="" disabled>
                Choisir
              </option>
              {PAYS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field id={id("creneau")} label="Créneau préféré" hint="À votre heure locale.">
            <select id={id("creneau")} name="creneau" className={selectBase} aria-describedby={`${id("creneau")}-aide`}>
              <option>En semaine, le soir</option>
              <option>En semaine, à midi</option>
              <option>Le samedi</option>
              <option>Le dimanche</option>
            </select>
          </Field>
        </div>
      ) : null}

      {variant === "devis" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("travaux")} label="Type de travaux">
            <select id={id("travaux")} name="travaux" className={selectBase}>
              <option>Terrassement</option>
              <option>Viabilisation</option>
              <option>Adduction d&apos;eau</option>
              <option>Plans et 3D</option>
              <option>Construction de maison</option>
              <option>Lotissement complet</option>
            </select>
          </Field>
          <Field id={id("lieu")} label="Localisation du terrain">
            <input id={id("lieu")} name="lieu" placeholder="Ex. Sangalkam" className={inputBase} />
          </Field>
        </div>
      ) : null}

      {variant === "contact" ? (
        <Field id={id("sujet")} label="Sujet">
          <select id={id("sujet")} name="sujet" defaultValue={defaultSujet ?? "achat"} className={selectBase}>
            <option value="achat">Acheter un terrain</option>
            <option value="maison">Acheter une maison</option>
            <option value="diaspora">Acheter depuis l&apos;étranger</option>
            <option value="travaux">Aménagement ou construction</option>
            <option value="partenariat">Promoteur, collectivité ou institution</option>
            <option value="autre">Autre demande</option>
          </select>
        </Field>
      ) : null}

      <Field id={id("message")} label="Message (facultatif)">
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          className={`${inputBase} h-auto resize-y py-3`}
          placeholder={variant === "devis" ? "Surface du terrain, délai souhaité, budget..." : "Votre budget, vos questions..."}
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-muted">
          Vos coordonnées servent uniquement à vous recontacter.
        </p>
        <button type="submit" disabled={state === "sending"} className={`${btnPrimary} sm:min-w-[220px]`}>
          {state === "sending" ? <CircleNotchIcon size={18} className="animate-spin" aria-hidden /> : null}
          {state === "sending" ? "Envoi..." : SUBMIT[variant]}
        </button>
      </div>
    </form>
  );
}
