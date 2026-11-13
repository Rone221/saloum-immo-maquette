"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ListIcon, XIcon, WhatsappLogoIcon, PhoneIcon } from "@phosphor-icons/react";
import { Logo } from "./logo";
import { NAV, WA_DEFAULT, CONTACT } from "@/lib/site";
import { btnPrimary, btnSecondary, container } from "./ui";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75">
      <div className={`${container} flex h-[68px] items-center justify-between gap-6`}>
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                    isActive(item.href) ? "bg-surface-2 text-ink" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={WA_DEFAULT} target="_blank" rel="noopener" className={`${btnPrimary} hidden md:inline-flex`}>
            <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
            WhatsApp
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon size={20} aria-hidden /> : <ListIcon size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-mobile" className="border-t border-line bg-bg lg:hidden">
          <nav aria-label="Navigation mobile" className={`${container} py-4`}>
            <ul className="divide-y divide-line">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center justify-between py-3.5 font-display text-xl font-semibold ${
                      isActive(item.href) ? "text-accent" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-3 pb-2">
              <a href={CONTACT.phoneHref} className={btnSecondary}>
                <PhoneIcon size={18} aria-hidden />
                Appeler
              </a>
              <a href={WA_DEFAULT} target="_blank" rel="noopener" className={btnPrimary}>
                <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
                WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
