import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BulldozerIcon,
  CertificateIcon,
  CompassIcon,
  HouseIcon,
  MapTrifoldIcon,
  ReceiptIcon,
  SealCheckIcon,
  StampIcon,
  VideoCameraIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { HeroSearch } from "@/components/hero-search";
import { LandStatusTabs } from "@/components/land-status-tabs";
import { ProgrammeCard } from "@/components/programme-card";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { btnOnPanel, btnGhostOnPanel, btnSecondary, container, h2, lead } from "@/components/ui";
import { FAQ_HOME, IMG, IMG_ALT, NEWS, PROGRAMMES } from "@/lib/data";
import { unsplash, WA_DEFAULT } from "@/lib/site";

const GARANTIES = [
  {
    Icon: CertificateIcon,
    title: "Le statut juridique, affiché avant tout",
    text: "Titre foncier ou bail : chaque terrain indique son statut et les documents qui vont avec.",
  },
  {
    Icon: StampIcon,
    title: "Vérification chez votre notaire",
    text: "Vous choisissez le notaire. Il contrôle l'état des droits avant le moindre versement.",
  },
  {
    Icon: CompassIcon,
    title: "Bornage par un géomètre agréé",
    text: "Les limites de votre parcelle sont posées sur le terrain et reportées sur un plan signé.",
  },
  {
    Icon: ReceiptIcon,
    title: "Chaque paiement a son reçu",
    text: "Virement ou mobile money, jamais d'espèces sans trace. Votre dossier reste complet.",
  },
];

const CHAINE = [
  { Icon: MapTrifoldIcon, title: "Choisir", text: "Visite sur place ou en vidéo, plan du lotissement en main." },
  { Icon: SealCheckIcon, title: "Sécuriser", text: "Documents vérifiés, acte chez le notaire, bornage contradictoire." },
  { Icon: BulldozerIcon, title: "Aménager", text: "Terrassement, voirie, adduction d'eau et électricité." },
  { Icon: CompassIcon, title: "Concevoir", text: "Plans d'architecte et rendus 3D de votre future maison." },
  { Icon: HouseIcon, title: "Construire", text: "Chantier suivi par notre équipe, photos à chaque étape." },
];

export default function Home() {
  const [featured, ...others] = PROGRAMMES.filter((p) => p.kind !== "maison");

  return (
    <>
      {/* Hero : une décision claire, trouver un terrain sûr. */}
      <section className="relative overflow-hidden">
        <div className={`${container} grid items-center gap-10 pb-16 pt-10 md:pt-14 lg:min-h-[calc(100dvh-110px)] lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-20`}>
          <div className="motion-safe:animate-[fadeUp_.8s_cubic-bezier(.16,1,.3,1)_both]">
            <h1 className="font-display text-[2.3rem] font-extrabold leading-[1.02] tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.6rem]">
              Votre terrain au Sénégal, sans mauvaise surprise.
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
              Parcelles bornées, statut juridique affiché, documents vérifiés par votre notaire. Visite sur place ou en
              vidéo.
            </p>
            <div className="mt-8 max-w-[560px]">
              <HeroSearch />
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-2 transition-colors hover:text-accent"
              >
                <WhatsappLogoIcon size={18} weight="fill" className="text-accent" aria-hidden />
                Une question ? Écrivez-nous sur WhatsApp
              </a>
            </div>
          </div>
          <div className="relative motion-safe:animate-[fadeIn_1.1s_ease-out_both]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={unsplash(IMG.aerialLotissement, 1800)}
                alt={IMG_ALT[IMG.aerialLotissement]}
                fill
                preload
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres réels issus des communications de Saloum Immo. */}
      <section aria-label="Saloum Immo en chiffres" className="border-y border-line bg-surface">
        <dl className={`${container} grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4`}>
          {[
            ["78", "parcelles à Kounoune 2"],
            ["342", "parcelles tracées sur 9 ha"],
            ["29 ha", "disponibles à Bayakh"],
            ["2021", "année de création"],
          ].map(([n, l]) => (
            <div key={l} className="md:border-l md:border-line md:pl-8 md:first:border-l-0 md:first:pl-0">
              <dt className="sr-only">{l}</dt>
              <dd>
                <span className="block font-display text-4xl font-extrabold tracking-tight text-ink tnum">{n}</span>
                <span className="mt-1 block text-sm text-muted">{l}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Programmes : un grand + trois secondaires. */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={h2}>Nos programmes en cours</h2>
            <p className={`${lead} mt-4`}>Des lotissements que nous aménageons nous-mêmes, du bornage à l&apos;eau courante.</p>
          </div>
          <Link href="/terrains" className={btnSecondary}>
            Voir les terrains
            <ArrowRightIcon size={16} aria-hidden />
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-[1.35fr_1fr]">
          <Reveal className="h-full">
            <ProgrammeCard p={featured} size="lg" />
          </Reveal>
          <div className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-1">
            {others.slice(0, 2).map((p, i) => (
              <Reveal key={p.slug} delay={0.08 * (i + 1)}>
                <ProgrammeCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
        {others[2] ? (
          <Reveal className="mt-12">
            <Link
              href={`/terrains/${others[2].slug}`}
              className="group grid items-center gap-6 overflow-hidden rounded-2xl border border-line bg-surface p-3 sm:grid-cols-[240px_1fr_auto] sm:pr-8"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl sm:aspect-[4/3]">
                <Image src={unsplash(others[2].image, 600)} alt={IMG_ALT[others[2].image] ?? ""} fill sizes="240px" className="object-cover" />
              </div>
              <div className="px-2 sm:px-0">
                <p className="text-sm font-semibold text-accent">Investisseurs et promoteurs</p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">{others[2].name}</h3>
                <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted">{others[2].tagline} Vente par lots d&apos;un hectare ou en bloc.</p>
              </div>
              <span className="mx-2 mb-2 inline-flex items-center gap-2 text-sm font-semibold text-ink sm:m-0">
                Étudier le projet
                <ArrowRightIcon size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ) : null}
      </section>

      {/* Garanties : image + liste. */}
      <section className="bg-surface py-20 md:py-28">
        <div className={`${container} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
          <Reveal className="relative order-last lg:order-first">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src={unsplash(IMG.geometre, 1400)} alt={IMG_ALT[IMG.geometre]} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Sécurité foncière</p>
              <h2 className={`${h2} mt-3`}>Acheter un terrain sans craindre la double vente</h2>
              <p className={`${lead} mt-4`}>
                Au Sénégal, la confiance se prouve sur papier. Voici ce que nous faisons à chaque vente.
              </p>
            </Reveal>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {GARANTIES.map(({ Icon, title, text }, i) => (
                <li key={title}>
                  <Reveal delay={0.06 * i}>
                    <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                      <Icon size={22} aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">{title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pédagogie foncière : leur contenu Instagram le plus fort, rendu interactif. */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal className="max-w-3xl">
          <h2 className={h2}>Titre foncier, bail ou délibération ?</h2>
          <p className={`${lead} mt-4`}>Trois statuts, trois niveaux de sécurité. Comprenez ce que vous achetez avant de signer.</p>
        </Reveal>
        <Reveal className="mt-10">
          <LandStatusTabs />
        </Reveal>
      </section>

      {/* La chaîne complète : leur vrai différenciant. */}
      <section className="border-y border-line bg-surface py-20 md:py-28">
        <div className={container}>
          <Reveal className="max-w-3xl">
            <h2 className={h2}>De la parcelle à la maison, avec une seule équipe</h2>
            <p className={`${lead} mt-4`}>
              Nous ne vendons pas seulement des terrains. Nous les rendons constructibles, puis nous construisons avec vous.
            </p>
          </Reveal>
          <ol className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:gap-0 md:overflow-visible md:px-0">
            {CHAINE.map(({ Icon, title, text }, i) => (
              <li
                key={title}
                className="relative min-w-[78%] snap-start rounded-2xl border border-line bg-bg p-6 sm:min-w-[44%] md:min-w-0 md:rounded-none md:border-0 md:border-l md:bg-transparent md:px-6 md:py-2 md:first:border-l-0 md:first:pl-0"
              >
                <Reveal delay={0.07 * i}>
                  <Icon size={28} aria-hidden className="text-accent" />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[IMG.terrassement, IMG.toiture, IMG.villa2].map((id, i) => (
              <Reveal key={id} delay={0.06 * i} className={i === 1 ? "sm:translate-y-6" : ""}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={unsplash(id, 900)} alt={IMG_ALT[id]} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-16">
            <Link href="/construire" className="inline-flex items-center gap-2 text-[15px] font-semibold text-accent underline-offset-4 hover:underline">
              Découvrir l&apos;aménagement et la construction
              <ArrowRightIcon size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Entrée dédiée diaspora. */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl bg-panel text-panel-ink lg:grid-cols-[1.1fr_1fr]">
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-panel-muted">Diaspora</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance md:text-[2.5rem]">
                Vous vivez à l&apos;étranger ? Achetez en gardant le contrôle.
              </h2>
              <ul className="mt-8 space-y-4 text-[15px] leading-relaxed text-panel-muted">
                <li className="flex gap-3">
                  <VideoCameraIcon size={22} aria-hidden className="mt-0.5 shrink-0 text-panel-ink" />
                  Visite vidéo en direct sur la parcelle, à votre heure.
                </li>
                <li className="flex gap-3">
                  <StampIcon size={22} aria-hidden className="mt-0.5 shrink-0 text-panel-ink" />
                  Signature sur place ou par procuration notariée.
                </li>
                <li className="flex gap-3">
                  <ReceiptIcon size={22} aria-hidden className="mt-0.5 shrink-0 text-panel-ink" />
                  Paiements par virement, reçus et dossier partagé.
                </li>
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/diaspora" className={btnOnPanel}>
                  Acheter à distance
                  <ArrowRightIcon size={16} aria-hidden />
                </Link>
                <a href={WA_DEFAULT} target="_blank" rel="noopener" className={btnGhostOnPanel}>
                  <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="relative min-h-[280px]">
              <Image src={unsplash(IMG.dakarCote, 1400)} alt={IMG_ALT[IMG.dakarCote]} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Preuves d'activité : leurs vraies actualités. */}
      <section className="bg-surface py-20 md:py-28">
        <div className={container}>
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className={h2}>Sur nos chantiers</h2>
            <a href="https://www.youtube.com/@saloumimobat" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-[15px] font-semibold text-accent underline-offset-4 hover:underline">
              Toutes nos vidéos
              <ArrowRightIcon size={16} aria-hidden />
            </a>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <article className="group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image src={unsplash(NEWS[0].image, 1400)} alt={IMG_ALT[NEWS[0].image] ?? ""} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-16 place-items-center rounded-full bg-surface/90 text-accent shadow-lg backdrop-blur transition-transform group-hover:scale-105">
                      <VideoCameraIcon size={28} weight="fill" aria-hidden />
                    </span>
                  </span>
                </div>
                <p className="mt-5 text-sm text-muted">
                  {NEWS[0].kind}, {NEWS[0].date}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">{NEWS[0].title}</h3>
              </article>
            </Reveal>
            <ul className="divide-y divide-line">
              {NEWS.slice(1).map((n, i) => (
                <li key={n.title} className="py-5 first:pt-0">
                  <Reveal delay={0.06 * i}>
                    <article className="grid grid-cols-[112px_1fr] items-center gap-5">
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <Image src={unsplash(n.image, 300)} alt={IMG_ALT[n.image] ?? ""} fill sizes="112px" className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">
                          {n.kind}, {n.date}
                        </p>
                        <h3 className="mt-1 font-display text-lg font-bold leading-snug tracking-tight text-ink">{n.title}</h3>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ + relance. */}
      <section className={`${container} grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
        <Reveal>
          <h2 className={h2}>Les questions qu&apos;on nous pose le plus</h2>
          <p className={`${lead} mt-4`}>Une autre question ? Un conseiller vous répond sur WhatsApp.</p>
          <a href={WA_DEFAULT} target="_blank" rel="noopener" className={`${btnSecondary} mt-8`}>
            <WhatsappLogoIcon size={18} weight="fill" className="text-accent" aria-hidden />
            WhatsApp
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <Faq items={FAQ_HOME} />
        </Reveal>
      </section>
    </>
  );
}
