import Link from "next/link";
import {
  EnvelopeIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  PhoneIcon,
  TiktokLogoIcon,
  WhatsappLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./logo";
import { CONTACT, WA_DEFAULT } from "@/lib/site";
import { PROGRAMMES } from "@/lib/data";
import { container } from "./ui";

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-line bg-surface">
      <div className={`${container} grid gap-12 py-14 md:grid-cols-12`}>
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-muted">
            Transformer la terre, construire l&apos;avenir. Terrains sécurisés, aménagement et construction au
            Sénégal.
          </p>
          <ul className="mt-6 flex gap-2" aria-label="Réseaux sociaux">
            {[
              { href: CONTACT.socials.instagram, label: "Instagram", Icon: InstagramLogoIcon },
              { href: CONTACT.socials.tiktok, label: "TikTok", Icon: TiktokLogoIcon },
              { href: CONTACT.socials.youtube, label: "YouTube", Icon: YoutubeLogoIcon },
              { href: CONTACT.socials.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-ink/30 hover:text-ink"
                >
                  <Icon size={18} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Programmes" className="md:col-span-3">
          <h2 className="text-sm font-semibold text-ink">Programmes</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {PROGRAMMES.map((p) => (
              <li key={p.slug}>
                <Link href={`/terrains/${p.slug}`} className="text-muted transition-colors hover:text-ink">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Saloum Immo" className="md:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Saloum Immo</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {[
              ["/terrains", "Terrains"],
              ["/construire", "Construire"],
              ["/diaspora", "Diaspora"],
              ["/guide-foncier", "Guide foncier"],
              ["/a-propos", "À propos"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-muted transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold text-ink">Nous joindre</h2>
          <ul className="mt-4 space-y-3 text-[15px] text-muted">
            <li>
              <a href={WA_DEFAULT} target="_blank" rel="noopener" className="flex items-center gap-2.5 hover:text-ink">
                <WhatsappLogoIcon size={18} aria-hidden className="text-accent" />
                <span className="tnum">{CONTACT.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={CONTACT.landlineHref} className="flex items-center gap-2.5 hover:text-ink">
                <PhoneIcon size={18} aria-hidden className="text-accent" />
                <span className="tnum">{CONTACT.landlineDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 hover:text-ink">
                <EnvelopeIcon size={18} aria-hidden className="text-accent" />
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon size={18} aria-hidden className="mt-0.5 shrink-0 text-accent" />
              <span>
                {CONTACT.address}
                <br />
                {CONTACT.hours}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className={`${container} flex flex-col gap-2 py-5 text-sm text-muted md:flex-row md:items-center md:justify-between`}>
          <p>© {year} Saloum Immo. Tous droits réservés.</p>
          <p>Mentions légales · Confidentialité</p>
        </div>
      </div>
    </footer>
  );
}
