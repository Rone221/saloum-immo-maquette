import type { Metadata } from "next";
import { CheckIcon, WarningIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { LandStatusTabs } from "@/components/land-status-tabs";
import { Reveal } from "@/components/reveal";
import { btnPrimary, container, h2, lead } from "@/components/ui";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guide foncier",
  description:
    "Titre foncier, bail ou délibération : comprendre les statuts, repérer les arnaques et savoir quoi vérifier avant d'acheter un terrain au Sénégal.",
};

const TABLE = [
  ["Nature du droit", "Propriété privée inscrite au livre foncier", "Droit d'occupation sur un terrain de l'État", "Droit d'usage sur le domaine national"],
  ["Accordé par", "Conservation foncière", "L'État", "Le conseil municipal"],
  ["Durée", "Illimitée, transmissible", "18 à 50 ans, renouvelable", "Liée à la mise en valeur"],
  ["Hypothèque", "Oui", "Selon les termes du bail", "Non"],
  ["Peut évoluer vers", "Statut le plus abouti", "Titre foncier", "Bail, puis titre foncier"],
  ["Niveau de sécurité", "Le plus sûr", "Solide", "Fragile"],
];

const ALERTES = [
  "Un prix nettement sous le marché",
  "Une pression pour décider dans la journée",
  "Un refus de vérifier l'état des droits chez un notaire",
  "Une demande de paiement en espèces",
  "Un vendeur qui n'est pas le titulaire du document",
  "Une « attestation d'attribution » sans plan de lotissement approuvé",
];

const VERIFS = [
  "Le titre ou le bail est au nom du vendeur",
  "Un état des droits réels récent, demandé par votre notaire",
  "Un notaire que vous avez choisi vous-même",
  "Un bornage contradictoire par un géomètre agréé",
  "Des paiements traçables, chacun contre un reçu",
  "L'inscription de la vente sans attendre",
];

export default function GuidePage() {
  return (
    <>
      <section className={`${container} pt-10 md:pt-16`}>
        <div className="max-w-3xl">
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-tight text-balance text-ink sm:text-5xl">
            Acheter un terrain au Sénégal, sans se faire piéger.
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">
            Les statuts juridiques, les signaux d&apos;alerte et les vérifications à faire avant de payer. Expliqué simplement.
          </p>
        </div>
        <div className="mt-12">
          <LandStatusTabs />
        </div>
      </section>

      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <h2 className={h2}>Les trois statuts, côte à côte</h2>
        </Reveal>
        <Reveal className="mt-10">
          <div className="no-scrollbar overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
              <caption className="sr-only">Comparaison du titre foncier, du bail et de la délibération</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[22%] p-5 font-medium text-muted">
                    <span className="sr-only">Critère</span>
                  </th>
                  <th scope="col" className="bg-accent-soft p-5 font-display text-lg font-bold text-accent">Titre foncier</th>
                  <th scope="col" className="p-5 font-display text-lg font-bold text-ink">Bail</th>
                  <th scope="col" className="p-5 font-display text-lg font-bold text-ink">Délibération</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map(([k, tf, bail, delib], i) => (
                  <tr key={k} className={i < TABLE.length - 1 ? "border-b border-line" : ""}>
                    <th scope="row" className="p-5 align-top font-medium text-muted">
                      {k}
                    </th>
                    <td className="bg-accent-soft/60 p-5 align-top font-medium text-ink">{tf}</td>
                    <td className="p-5 align-top text-ink-2">{bail}</td>
                    <td className={`p-5 align-top ${i === TABLE.length - 1 ? "font-semibold text-reserved" : "text-ink-2"}`}>{delib}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <p className="mt-4 text-[13px] text-muted">
          Informations générales. Elles ne remplacent pas l&apos;avis d&apos;un notaire sur un dossier précis.
        </p>
      </section>

      <section className="border-y border-line bg-surface py-20 md:py-28">
        <div className={`${container} grid gap-14 lg:grid-cols-2 lg:gap-16`}>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-reserved-soft text-reserved">
                <WarningIcon size={22} weight="fill" aria-hidden />
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">Les signaux d&apos;alerte</h2>
            </div>
            <ul className="mt-8 space-y-4">
              {ALERTES.map((a) => (
                <li key={a} className="rounded-xl border border-line bg-bg px-5 py-4 text-[15px] font-medium text-ink">
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                <CheckIcon size={22} weight="bold" aria-hidden />
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">À vérifier avant de payer</h2>
            </div>
            <ol className="mt-8 space-y-4">
              {VERIFS.map((v, i) => (
                <li key={v} className="flex items-center gap-4 rounded-xl bg-accent-soft/50 px-5 py-4 text-[15px] font-medium text-ink">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent font-display text-sm font-bold text-accent-ink tnum">
                    {i + 1}
                  </span>
                  {v}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <div className="grid items-center gap-8 rounded-2xl border border-line bg-surface p-8 sm:p-12 lg:grid-cols-[1.4fr_auto]">
            <div>
              <h2 className={h2}>Un doute sur un terrain ?</h2>
              <p className={`${lead} mt-4`}>
                Envoyez-nous les documents qu&apos;on vous a remis. Nous vous disons gratuitement ce qu&apos;il faut vérifier.
              </p>
            </div>
            <a
              href={waLink("Bonjour Saloum Immo, j'aimerais un avis sur les documents d'un terrain qu'on me propose.")}
              target="_blank"
              rel="noopener"
              className={btnPrimary}
            >
              <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
              WhatsApp
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
