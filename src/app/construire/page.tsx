import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BulldozerIcon,
  CameraIcon,
  CubeIcon,
  DropIcon,
  FileTextIcon,
  HouseIcon,
  LightningIcon,
  MapTrifoldIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { btnOnPanel, btnPrimary, container, h2, lead } from "@/components/ui";
import { IMG, IMG_ALT } from "@/lib/data";
import { unsplash } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aménager et construire",
  description: "Terrassement, viabilisation, adduction d'eau, lotissement, plans 3D, construction et suivi de chantier au Sénégal.",
};

const AMENAGEMENT = [
  { Icon: BulldozerIcon, title: "Terrassement", text: "Déblaiement, nivellement, remblai et compactage. La base d'un ouvrage stable, maison ou route." },
  { Icon: LightningIcon, title: "Viabilisation", text: "Raccordement à l'eau, à l'électricité, à l'assainissement et à la voirie. Le terrain devient constructible." },
  { Icon: DropIcon, title: "Adduction d'eau", text: "Pose des canalisations et raccordement au réseau, comme sur notre programme de Kounoune 2." },
  { Icon: MapTrifoldIcon, title: "Lotissement", text: "Levé topographique, découpage et tracé des parcelles. 342 parcelles tracées sur 9 hectares." },
];

const CONSTRUCTION = [
  { Icon: CubeIcon, title: "Plans et 3D", text: "Plans d'architecte et rendus 3D pour voir votre maison avant de poser la première pierre." },
  { Icon: HouseIcon, title: "Construction", text: "Construction de votre maison après l'achat du terrain, sur devis détaillé par lot de travaux." },
  { Icon: CameraIcon, title: "Suivi de chantier", text: "Un interlocuteur unique et des photos à chaque étape, même depuis l'étranger." },
  { Icon: FileTextIcon, title: "Démarches", text: "Autorisation de construire, mutation, transformation du bail en titre foncier." },
];

function ServiceList({ items }: { items: typeof AMENAGEMENT }) {
  return (
    <ul className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
      {items.map(({ Icon, title, text }, i) => (
        <li key={title}>
          <Reveal delay={0.05 * i}>
            <Icon size={28} aria-hidden className="text-accent" />
            <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default function ConstruirePage() {
  return (
    <>
      <section className={`${container} grid items-center gap-10 pb-16 pt-10 md:pt-14 lg:grid-cols-2 lg:gap-14`}>
        <div>
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.4rem]">
            Un terrain prêt à bâtir, puis la maison qui va dessus.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
            Nos équipes aménagent les terrains et construisent pour les particuliers, les promoteurs et les collectivités.
          </p>
          <a href="#devis" className={`${btnPrimary} mt-8`}>
            Demander un devis
            <ArrowRightIcon size={16} aria-hidden />
          </a>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
          <Image src={unsplash(IMG.terrassement, 1600)} alt={IMG_ALT[IMG.terrassement]} fill preload sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="border-y border-line bg-surface py-20 md:py-28">
        <div className={`${container} grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20`}>
          <Reveal>
            <h2 className={h2}>Aménager le terrain</h2>
            <p className={`${lead} mt-4`}>Rendre une parcelle constructible et accessible, avec des travaux que vous pouvez suivre.</p>
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-2xl lg:block">
              <Image src={unsplash(IMG.geometre, 1000)} alt={IMG_ALT[IMG.geometre]} fill sizes="35vw" className="object-cover" />
            </div>
          </Reveal>
          <div className="lg:pt-2">
            <ServiceList items={AMENAGEMENT} />
          </div>
        </div>
      </section>

      <section className={`${container} py-20 md:py-28`}>
        <Reveal className="max-w-3xl">
          <h2 className={h2}>Construire votre maison</h2>
          <p className={`${lead} mt-4`}>Du plan à la remise des clés, avec les mêmes interlocuteurs que pour l&apos;achat de votre terrain.</p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[IMG.villa3, IMG.toiture].map((id, i) => (
            <Reveal key={id} delay={0.06 * i} className={i === 0 ? "sm:col-span-2" : ""}>
              <div className={`relative overflow-hidden rounded-2xl ${i === 0 ? "aspect-[16/9]" : "aspect-[4/5] sm:aspect-auto sm:h-full"}`}>
                <Image src={unsplash(id, i === 0 ? 1400 : 800)} alt={IMG_ALT[id]} fill sizes={i === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 100vw"} className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14">
          <ServiceList items={CONSTRUCTION} />
        </div>
      </section>

      <section className={`${container} pb-20 md:pb-28`}>
        <Reveal>
          <div className="grid gap-8 rounded-2xl bg-panel p-8 text-panel-ink sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance md:text-[2.4rem]">
                Promoteurs, collectivités, institutions
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-panel-muted md:text-base">
                Nous accompagnons vos opérations foncières de A à Z : recherche et sécurisation du foncier, lotissement,
                viabilisation complète et transmission des titres.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <Link href="/contact?sujet=partenariat" className={btnOnPanel}>
                Présenter un projet
                <ArrowRightIcon size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="devis" className="border-t border-line bg-surface py-20 md:py-28">
        <div className={`${container} grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16`}>
          <Reveal>
            <h2 className={h2}>Demander un devis</h2>
            <p className={`${lead} mt-4`}>Décrivez votre terrain et vos travaux. Nous revenons vers vous avec une estimation et une date de visite technique.</p>
          </Reveal>
          <Reveal delay={0.06}>
            <LeadForm variant="devis" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
