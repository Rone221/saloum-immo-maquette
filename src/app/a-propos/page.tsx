import type { Metadata } from "next";
import Image from "next/image";
import { EyeIcon, HandshakeIcon, HeartIcon, ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import { container, h2, lead } from "@/components/ui";
import { IMG, IMG_ALT } from "@/lib/data";
import { unsplash } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: "Saloum Immo, experts en transactions foncières, viabilisation et transmission de terrains, basés à Sangalkam.",
};

// Parcours publié par Saloum Immo sur son ancien site.
const PARCOURS = [
  { year: "2003", text: "Mémorisation du Coran. Discipline et persévérance deviennent une méthode." },
  { year: "2004", text: "Premiers emplois à l'aéroport Léopold Sédar Senghor, puis chez Dakar Catering jusqu'en 2008." },
  { year: "2008", text: "Cambiste à son compte pendant sept ans. Le sens de la confiance et du chiffre." },
  { year: "2015", text: "Vente et location de voitures. L'entreprise se structure." },
  { year: "2021", text: "Création de Saloum Immo, consacrée au foncier, à l'aménagement et à la construction." },
];

const VALEURS = [
  { Icon: EyeIcon, title: "Transparence", text: "Statut, prix et documents montrés avant toute décision." },
  { Icon: ShieldCheckIcon, title: "Sécurité", text: "Bornage, vérification notariale et paiements tracés." },
  { Icon: HeartIcon, title: "Héritage", text: "Un terrain aujourd'hui, un patrimoine pour ceux qu'on aime." },
  { Icon: HandshakeIcon, title: "Proximité", text: "Un interlocuteur qui répond, sur place comme à distance." },
];

const EQUIPE = [
  { name: "Babacar Ndiaye", role: "Fondateur et PDG", initials: "BN" },
  { name: "Seydina Oumar Ndiaye", role: "Marketing et communication", initials: "SN" },
  { name: "Fadel Dieng", role: "Équipe Saloum Immo", initials: "FD" },
];

export default function AProposPage() {
  return (
    <>
      <section className={`${container} grid gap-10 pb-16 pt-10 md:pt-16 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16`}>
        <div>
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.5rem]">
            Transformer la terre, construire l&apos;avenir.
          </h1>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted">
            Saloum Immo est une société d&apos;associés basée à Sangalkam. Nous sécurisons, aménageons et transmettons des
            terrains pour les familles, les investisseurs et les institutions.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {[
            ["Création", "2021"],
            ["Siège", "Paradise City, Sangalkam"],
            ["Forme", "Société d'associés"],
            ["Équipe", "2 à 10 personnes"],
          ].map(([k, v]) => (
            <div key={k} className="bg-surface p-5">
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className="mt-1 font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${container}`}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl md:aspect-[21/9]">
          <Image src={unsplash(IMG.quartierExpansion, 2000)} alt={IMG_ALT[IMG.quartierExpansion]} fill preload sizes="100vw" className="object-cover" />
        </div>
      </section>

      <section className={`${container} grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className={h2}>Un fondateur autodidacte</h2>
          <p className={`${lead} mt-4`}>
            Babacar Ndiaye a bâti Saloum Immo pas à pas, avec une conviction : un client informé est un client protégé.
          </p>
        </Reveal>
        <ol className="space-y-0">
          {PARCOURS.map((s, i) => (
            <li key={s.year} className="grid grid-cols-[88px_1fr] gap-6 border-t border-line py-7 last:border-b">
              <Reveal delay={0.04 * i}>
                <span className="font-display text-2xl font-extrabold tracking-tight text-accent tnum">{s.year}</span>
              </Reveal>
              <Reveal delay={0.04 * i + 0.03}>
                <p className="text-[16px] leading-relaxed text-ink-2">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-surface py-20 md:py-28">
        <div className={container}>
          <Reveal>
            <h2 className={h2}>Ce qui guide notre travail</h2>
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {VALEURS.map(({ Icon, title, text }, i) => (
              <li key={title} className="bg-surface p-7">
                <Reveal delay={0.05 * i}>
                  <Icon size={28} aria-hidden className="text-accent" />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <h2 className={h2}>L&apos;équipe</h2>
        </Reveal>
        <ul className="mt-12 grid gap-8 sm:grid-cols-3">
          {EQUIPE.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={0.06 * i}>
                <div className="grid aspect-[4/5] place-items-center rounded-2xl bg-gradient-to-br from-accent-soft to-surface-2">
                  <span className="font-display text-6xl font-extrabold tracking-tight text-accent/70">{m.initials}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">{m.name}</h3>
                <p className="mt-1 text-[15px] text-muted">{m.role}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[13px] text-muted">Portraits à réaliser lors du shooting photo.</p>
      </section>
    </>
  );
}
