import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CameraIcon,
  ChatsCircleIcon,
  FileMagnifyingGlassIcon,
  HandCoinsIcon,
  SignatureIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Faq } from "@/components/faq";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { btnPrimary, container, h2, lead } from "@/components/ui";
import { IMG, IMG_ALT } from "@/lib/data";
import { unsplash } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acheter depuis l'étranger",
  description:
    "Achetez un terrain au Sénégal depuis la France, l'Italie, l'Espagne ou les États-Unis : visite vidéo, vérification par votre notaire, paiements tracés, suivi photo.",
};

const PARCOURS = [
  { Icon: ChatsCircleIcon, title: "Échanger", text: "Un premier appel WhatsApp pour cerner votre projet, votre budget et vos délais, à l'heure de votre pays." },
  { Icon: VideoCameraIcon, title: "Visiter en vidéo", text: "Un conseiller filme la parcelle en direct : bornes, accès, voisinage. Vous posez toutes vos questions." },
  { Icon: FileMagnifyingGlassIcon, title: "Vérifier", text: "Nous vous envoyons les documents. Le notaire de votre choix contrôle l'état des droits." },
  { Icon: HandCoinsIcon, title: "Réserver", text: "Apport par virement international. Chaque versement donne lieu à un reçu au nom de la société." },
  { Icon: SignatureIcon, title: "Signer", text: "Chez le notaire pendant votre séjour, ou à distance par procuration notariée." },
  { Icon: CameraIcon, title: "Suivre", text: "Photos et vidéos datées à chaque étape : bornage, aménagement, puis construction si vous le souhaitez." },
];

const FAQ_DIASPORA = [
  {
    q: "Puis-je acheter sans venir au Sénégal ?",
    a: "Oui. La visite se fait en vidéo, la vérification des documents par votre notaire, et la signature par procuration notariée. Vous venez quand vous le souhaitez.",
  },
  {
    q: "Comment payer depuis l'étranger ?",
    a: "Par virement bancaire international sur le compte de la société. Jamais sur un compte personnel. Chaque versement est confirmé par un reçu.",
  },
  {
    q: "Qui veille sur mon terrain pendant mon absence ?",
    a: "Nous restons votre contact sur place. Vous recevez des photos datées après chaque intervention et pouvez demander une nouvelle visite vidéo à tout moment.",
  },
  {
    q: "Puis-je faire construire à distance ?",
    a: "Oui. Plans, devis, construction et suivi de chantier avec un interlocuteur unique. Les paiements sont échelonnés selon l'avancement.",
  },
];

export default function DiasporaPage() {
  return (
    <>
      <section className={`${container} pt-10 md:pt-16`}>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.5rem]">
            Achetez au Sénégal depuis l&apos;étranger, en gardant le contrôle.
          </h1>
          <div>
            <p className="max-w-[44ch] text-lg leading-relaxed text-muted">
              Visite vidéo en direct, documents vérifiés par votre notaire, paiements tracés et suivi photo du terrain.
            </p>
            <a href="#visio" className={`${btnPrimary} mt-6`}>
              <VideoCameraIcon size={18} aria-hidden />
              Réserver une visite vidéo
            </a>
          </div>
        </div>
        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl md:aspect-[21/9]">
          <Image
            src={unsplash(IMG.ouakam, 2000)}
            alt={IMG_ALT[IMG.ouakam]}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className={`${container} grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.5fr] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className={h2}>Six étapes, un seul interlocuteur</h2>
          <p className={`${lead} mt-4`}>
            Le parcours est le même pour tous nos clients de la diaspora, que vous soyez à Paris, Milan, Madrid ou New York.
          </p>
        </Reveal>
        <ol className="relative space-y-10 border-l border-line pl-8 md:pl-10">
          {PARCOURS.map(({ Icon, title, text }, i) => (
            <li key={title} className="relative">
              <span className="absolute -left-[calc(2rem+21px)] grid size-10 place-items-center rounded-full border border-line bg-bg text-accent md:-left-[calc(2.5rem+21px)]">
                <Icon size={20} aria-hidden />
              </span>
              <Reveal delay={0.04 * i}>
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h3>
                <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-muted">{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className={container}>
          <Reveal className="max-w-3xl">
            <h2 className={h2}>Ce qui vous protège quand vous êtes loin</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
            <Reveal className="md:col-span-4">
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl">
                <Image src={unsplash(IMG.geometre, 1400)} alt={IMG_ALT[IMG.geometre]} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-panel/90 via-panel/40 to-transparent p-6 pt-20 sm:p-8 sm:pt-24">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-panel-ink">Un bornage que vous voyez</h3>
                  <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-panel-muted">
                    Le géomètre pose les bornes devant la caméra. Le plan signé vous est envoyé le jour même.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal className="md:col-span-2" delay={0.06}>
              <div className="flex h-full flex-col justify-between rounded-2xl bg-accent p-6 text-accent-ink sm:p-8">
                <p className="font-display text-5xl font-extrabold tracking-tight">0</p>
                <div>
                  <h3 className="mt-8 font-display text-xl font-bold tracking-tight">paiement en espèces</h3>
                  <p className="mt-2 text-[15px] leading-relaxed opacity-85">Virements sur le compte de la société, avec reçu à chaque versement.</p>
                </div>
              </div>
            </Reveal>
            <Reveal className="md:col-span-3" delay={0.04}>
              <div className="h-full rounded-2xl border border-line bg-bg p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">Votre notaire, pas le nôtre</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  Vous choisissez librement le notaire qui vérifie le titre et rédige l&apos;acte. Nous lui transmettons le dossier complet.
                </p>
              </div>
            </Reveal>
            <Reveal className="md:col-span-3" delay={0.08}>
              <div className="h-full rounded-2xl border border-line bg-bg p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">Un dossier partagé</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  Documents, reçus et photos de chantier réunis au même endroit, consultables depuis votre téléphone.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="visio" className={`${container} grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-16`}>
        <Reveal>
          <h2 className={h2}>Réserver une visite vidéo</h2>
          <p className={`${lead} mt-4`}>
            Indiquez votre pays et vos disponibilités. Un conseiller vous propose un créneau et vous appelle en vidéo depuis le terrain.
          </p>
          <p className="mt-6 text-[15px] text-muted">
            Vous préférez commencer par les offres ?{" "}
            <Link href="/terrains" className="font-semibold text-accent underline-offset-4 hover:underline">
              Voir les terrains
            </Link>
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <LeadForm variant="diaspora" />
        </Reveal>
      </section>

      <section className={`${container} pb-24`}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <h2 className={h2}>Vos questions</h2>
          <Faq items={FAQ_DIASPORA} />
        </div>
      </section>
    </>
  );
}
