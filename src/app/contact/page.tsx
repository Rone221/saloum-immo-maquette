import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRightIcon, EnvelopeIcon, MapPinIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/contact-form";
import { container } from "@/components/ui";
import { CONTACT, WA_DEFAULT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrivez à Saloum Immo sur WhatsApp, appelez-nous ou passez à notre bureau de Sangalkam.",
};

const CANAUX = [
  {
    Icon: WhatsappLogoIcon,
    title: "WhatsApp",
    value: CONTACT.phoneDisplay,
    note: "Le plus rapide, y compris depuis l'étranger.",
    href: WA_DEFAULT,
    external: true,
    primary: true,
  },
  {
    Icon: PhoneIcon,
    title: "Téléphone",
    value: CONTACT.landlineDisplay,
    note: `Ou ${CONTACT.phone2Display}`,
    href: CONTACT.landlineHref,
  },
  {
    Icon: EnvelopeIcon,
    title: "Email",
    value: CONTACT.email,
    note: "Pour les dossiers et documents.",
    href: `mailto:${CONTACT.email}`,
  },
];

export default function ContactPage() {
  return (
    <div className={`${container} pb-24 pt-10 md:pt-16`}>
      <h1 className="max-w-3xl font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-tight text-balance text-ink sm:text-5xl">
        Parlons de votre projet.
      </h1>
      <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
        Achat, visite, construction ou partenariat : choisissez le canal qui vous arrange.
      </p>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {CANAUX.map(({ Icon, title, value, note, href, external, primary }) => (
          <li key={title}>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener" : undefined}
              className={`group flex h-full flex-col justify-between gap-10 rounded-2xl p-6 transition-colors ${
                primary ? "bg-accent text-accent-ink hover:bg-accent-hover" : "border border-line bg-surface text-ink hover:border-ink/25"
              }`}
            >
              <div className="flex items-start justify-between">
                <Icon size={28} weight={primary ? "fill" : "regular"} aria-hidden />
                <ArrowUpRightIcon size={18} aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div>
                <p className={`text-sm ${primary ? "opacity-85" : "text-muted"}`}>{title}</p>
                <p className="mt-1 font-display text-xl font-bold tracking-tight tnum">{value}</p>
                <p className={`mt-2 text-sm ${primary ? "opacity-85" : "text-muted"}`}>{note}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-20 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <section aria-labelledby="formulaire">
          <h2 id="formulaire" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Nous écrire
          </h2>
          <div className="mt-6">
            <Suspense fallback={<div className="h-[520px] animate-pulse rounded-2xl bg-surface-2" />}>
              <ContactForm />
            </Suspense>
          </div>
        </section>
        <section aria-labelledby="bureau">
          <h2 id="bureau" className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Notre bureau
          </h2>
          <p className="mt-6 flex items-start gap-3 text-[15px] leading-relaxed text-ink-2">
            <MapPinIcon size={20} aria-hidden className="mt-0.5 shrink-0 text-accent" />
            <span>
              {CONTACT.address}
              <br />
              {CONTACT.city}
              <br />
              <span className="text-muted">{CONTACT.hours}</span>
            </span>
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface-2">
            <iframe
              title="Carte du bureau de Saloum Immo à Sangalkam"
              src="https://www.google.com/maps?q=Sangalkam%2C%20S%C3%A9n%C3%A9gal&z=13&output=embed"
              className="block h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
