import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AirplaneIcon,
  ArrowLeftIcon,
  CalendarCheckIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  DropIcon,
  FileTextIcon,
  LightningIcon,
  MapPinIcon,
  MosqueIcon,
  PathIcon,
  PlantIcon,
  PlayCircleIcon,
  SoccerBallIcon,
  StorefrontIcon,
  TreeIcon,
  WavesIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LeadForm } from "@/components/lead-form";
import { PaymentSimulator } from "@/components/payment-simulator";
import { PlotPlan } from "@/components/plot-plan";
import { priceLabel, ProgrammeCard, surfacesLabel } from "@/components/programme-card";
import { StatusBadge } from "@/components/status-badge";
import { btnPrimary, btnSecondary, container } from "@/components/ui";
import {
  availableLots,
  getProgramme,
  IMG_ALT,
  LAND_STATUSES,
  PROGRAMMES,
  type Amenity,
  type WorkState,
} from "@/lib/data";
import { unsplash, waLink } from "@/lib/site";

// Seuls les programmes connus existent : un slug inconnu renvoie une vraie 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/terrains/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProgramme(slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

const AMENITY_ICON: Record<Amenity, typeof DropIcon> = {
  eau: DropIcon,
  electricite: LightningIcon,
  voirie: PathIcon,
  mosquee: MosqueIcon,
  foot: SoccerBallIcon,
  jeux: TreeIcon,
  vert: PlantIcon,
  commerce: StorefrontIcon,
  aeroport: AirplaneIcon,
  lac: WavesIcon,
  mer: WavesIcon,
};

const ON_SITE: Partial<Record<Amenity, string>> = {
  mosquee: "Mosquée",
  foot: "Terrain de foot",
  jeux: "Aire de jeux",
  vert: "Espace vert",
  commerce: "Commerces",
};

const WORK: Record<WorkState, { label: string; Icon: typeof DropIcon; cls: string }> = {
  fait: { label: "Terminé", Icon: CheckCircleIcon, cls: "text-accent" },
  "en-cours": { label: "En cours", Icon: CircleHalfIcon, cls: "text-reserved" },
  "a-venir": { label: "À venir", Icon: CircleDashedIcon, cls: "text-muted" },
};

// Le shell s'affiche tout de suite, le contenu du programme arrive en streaming (navigation instantanée).
export default function ProgrammePage({ params }: PageProps<"/terrains/[slug]">) {
  return (
    <Suspense fallback={<ProgrammeSkeleton />}>
      <ProgrammeContent params={params} />
    </Suspense>
  );
}

function ProgrammeSkeleton() {
  return (
    <div aria-hidden className={`${container} animate-pulse pb-24 pt-8`}>
      <div className="h-4 w-32 rounded-full bg-surface-2" />
      <div className="mt-8 h-7 w-40 rounded-full bg-surface-2" />
      <div className="mt-5 h-12 w-2/3 rounded-2xl bg-surface-2" />
      <div className="mt-10 grid gap-3 md:h-[520px] md:grid-cols-[2fr_1fr] md:grid-rows-2">
        <div className="aspect-[4/3] rounded-2xl bg-surface-2 md:row-span-2 md:aspect-auto" />
        <div className="hidden rounded-2xl bg-surface-2 md:block" />
        <div className="hidden rounded-2xl bg-surface-2 md:block" />
      </div>
    </div>
  );
}

async function ProgrammeContent({ params }: { params: PageProps<"/terrains/[slug]">["params"] }) {
  const { slug } = await params;
  const p = getProgramme(slug);
  if (!p) notFound();

  const status = LAND_STATUSES[p.status];
  const avail = availableLots(p);
  const priced = p.offers.filter((o): o is { surface: number; unit: "m²"; price: number } => o.price !== null && o.unit === "m²");
  const others = PROGRAMMES.filter((x) => x.slug !== p.slug && x.kind === p.kind).slice(0, 3);
  const fallbackOthers = others.length ? others : PROGRAMMES.filter((x) => x.slug !== p.slug).slice(0, 3);
  const waMsg = `Bonjour Saloum Immo, je suis intéressé(e) par le programme ${p.name}. Pouvez-vous m'envoyer les disponibilités et le dossier ?`;
  const onSite = p.amenities.map((a) => ON_SITE[a.key]).filter((x): x is string => !!x);

  return (
    <article className="pb-24">
      <div className={`${container} pt-8`}>
        <Link href="/terrains" className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink">
          <ArrowLeftIcon size={16} aria-hidden />
          Tous les terrains
        </Link>

        <header className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={p.status} explain />
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <MapPinIcon size={16} aria-hidden />
                {p.zone}, {p.locality}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-balance text-ink md:text-[3.25rem] md:leading-[1.04]">
              {p.name}
            </h1>
            <p className="mt-3 max-w-[56ch] text-lg leading-relaxed text-muted">{p.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#visite" className={btnPrimary}>
              <CalendarCheckIcon size={18} aria-hidden />
              Réserver une visite
            </a>
            <a href={waLink(waMsg)} target="_blank" rel="noopener" className={btnSecondary}>
              <WhatsappLogoIcon size={18} weight="fill" className="text-accent" aria-hidden />
              WhatsApp
            </a>
          </div>
        </header>

        {/* Galerie : une grande image, deux secondaires, la vidéo en accès direct. */}
        <div className="mt-10 grid gap-3 md:h-[520px] md:grid-cols-[2fr_1fr] md:grid-rows-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:row-span-2 md:aspect-auto">
            <Image src={unsplash(p.image, 1800)} alt={IMG_ALT[p.image] ?? ""} fill preload sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
          </div>
          <div className="relative hidden overflow-hidden rounded-2xl md:block">
            <Image src={unsplash(p.gallery[0], 900)} alt={IMG_ALT[p.gallery[0]] ?? ""} fill loading="eager" sizes="33vw" className="object-cover" />
          </div>
          <div className="group relative hidden overflow-hidden rounded-2xl md:block">
            <Image src={unsplash(p.gallery[1], 900)} alt={IMG_ALT[p.gallery[1]] ?? ""} fill loading="eager" sizes="33vw" className="object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-panel/35">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-lg">
                <PlayCircleIcon size={20} weight="fill" className="text-accent" aria-hidden />
                Vidéo du site
              </span>
            </span>
          </div>
        </div>

        {/* Faits clés. */}
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {[
            ["Prix", priceLabel(p)],
            ["Surfaces", surfacesLabel(p)],
            [avail !== null ? "Lots disponibles" : "Statut", avail !== null ? `${avail} sur ${p.lots?.total}` : status.label],
            ["Mise à jour", p.updated],
          ].map(([k, v]) => (
            <div key={k} className="bg-surface p-5">
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className="mt-1 font-display text-lg font-bold tracking-tight text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={`${container} mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12`}>
        <div className="min-w-0 space-y-20">
          <section aria-labelledby="presentation">
            <h2 id="presentation" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Le programme
            </h2>
            <p className="mt-4 max-w-[68ch] text-[17px] leading-relaxed text-ink-2">{p.description}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {p.amenities.map((a) => {
                const Icon = AMENITY_ICON[a.key];
                return (
                  <li key={a.label} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-[15px] text-ink">
                    <Icon size={20} aria-hidden className="shrink-0 text-accent" />
                    {a.label}
                  </li>
                );
              })}
            </ul>
          </section>

          {p.lots ? (
            <section id="plan" aria-labelledby="plan-titre">
              <h2 id="plan-titre" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Plan du lotissement
              </h2>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
                Les lots en bleu sont disponibles. Sélectionnez-en un pour voir sa surface et son prix.
              </p>
              <div className="mt-8">
                <PlotPlan
                  slug={p.slug}
                  name={p.name}
                  total={p.lots.total}
                  doubles={p.lots.doubles}
                  soldRatio={p.lots.soldRatio}
                  reservedRatio={p.lots.reservedRatio}
                  offers={p.offers.map((o) => ({ surface: o.surface, price: o.price }))}
                  onSite={onSite}
                />
              </div>
            </section>
          ) : null}

          {p.works.length ? (
            <section aria-labelledby="travaux">
              <h2 id="travaux" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Avancement des travaux
              </h2>
              <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {p.works.map((w) => {
                  const s = WORK[w.state];
                  return (
                    <li key={w.label} className="flex items-center justify-between gap-4 bg-surface p-5">
                      <span className="text-[15px] font-medium text-ink">{w.label}</span>
                      <span className={`flex shrink-0 items-center gap-1.5 text-sm font-semibold ${s.cls}`}>
                        <s.Icon size={18} weight={w.state === "fait" ? "fill" : "regular"} aria-hidden />
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}

          <section aria-labelledby="documents" className="rounded-2xl bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="documents" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Statut et documents
              </h2>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-ink-2">{status.summary}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {status.docs.map((d) => (
                <li key={d} className="flex items-center gap-3 text-[15px] text-ink">
                  <FileTextIcon size={20} aria-hidden className="shrink-0 text-accent" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Copies transmises avant la réservation, pour vérification par le notaire de votre choix.{" "}
              <Link href="/guide-foncier" className="font-semibold text-accent underline-offset-4 hover:underline">
                Comprendre les statuts
              </Link>
            </p>
          </section>

          <section aria-labelledby="localisation">
            <h2 id="localisation" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Localisation
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-2">
              {p.access.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <MapPinIcon size={16} aria-hidden className="text-accent" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface-2">
              <iframe
                title={`Carte de ${p.zone}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(p.mapQuery)}&z=13&output=embed`}
                className="block h-[340px] w-full grayscale-[25%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          <section id="visite" aria-labelledby="visite-titre">
            <h2 id="visite-titre" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Réserver une visite
            </h2>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
              Sur place avec un conseiller, ou en vidéo en direct si vous êtes loin. La visite est gratuite et sans engagement.
            </p>
            <div className="mt-8">
              <LeadForm variant="visite" programme={p.name} />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[92px] lg:self-start">
          {priced.length ? (
            <PaymentSimulator offers={priced.map((o) => ({ surface: o.surface, price: o.price }))} />
          ) : (
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="font-display text-xl font-bold tracking-tight text-ink">{priceLabel(p)}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {p.kind === "grande-surface"
                  ? "Le prix dépend de la surface et du projet. Nous préparons une étude avec plan et conditions."
                  : "Le prix vous est communiqué après un premier échange et la visite du bien."}
              </p>
            </div>
          )}
          <div className="rounded-2xl bg-panel p-6 text-panel-ink">
            <p className="font-display text-xl font-bold tracking-tight">Une question sur ce programme ?</p>
            <p className="mt-2 text-[15px] leading-relaxed text-panel-muted">
              Plan officiel, documents, prochaines visites : un conseiller vous répond.
            </p>
            <a href={waLink(waMsg)} target="_blank" rel="noopener" className={`${btnPrimary} mt-5 w-full`}>
              <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
              WhatsApp
            </a>
          </div>
        </aside>
      </div>

      <section className={`${container} mt-28`} aria-labelledby="autres">
        <h2 id="autres" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Autres programmes
        </h2>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {fallbackOthers.map((o) => (
            <ProgrammeCard key={o.slug} p={o} />
          ))}
        </div>
      </section>
    </article>
  );
}
