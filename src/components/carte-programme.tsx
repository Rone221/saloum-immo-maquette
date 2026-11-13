import Link from "next/link";
import { LIBELLES } from "@/content/messages";
import type { Programme } from "@/content/programmes";
import { T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { Photo, plafond } from "./photo";
import { TextLink } from "./text-link";

/**
 * Carte d'un programme (accueil) : photo, nom, trois lignes, WhatsApp.
 * Deux actions au plus (allegement.md, 2.9) : la fiche (photo et nom cliquables)
 * et WhatsApp, en lien texte : trois boutons identiques côte à côte feraient
 * grille de gabarit. Pas de cadre : la photo et le texte suffisent.
 * Sur mobile, la photo va bord à bord.
 */
export function CarteProgramme({ programme: p }: { programme: Programme }) {
  const titreId = `t-${p.slug}`;
  return (
    <article aria-labelledby={titreId} className="flex flex-col tab:grid tab:grid-cols-2 tab:gap-x-6 desk:flex">
      {/* La photo double le lien du nom : hors de la tabulation, alt vide. */}
      <Link
        href={p.href}
        tabIndex={-1}
        aria-hidden="true"
        className="-mx-gutter block tab:mx-0"
        style={plafond(p.photo)}
      >
        <span className="relative block aspect-[3/2] overflow-hidden bg-paper-2 tab:aspect-[4/3]">
          <Photo
            id={p.photo}
            fill
            decorative
            sizes="(min-width: 1440px) 437px, (min-width: 1101px) 31vw, (min-width: 761px) 50vw, 100vw"
            className="object-cover"
          />
        </span>
      </Link>
      <div className="flex flex-col">
        <h3 id={titreId} className={`${T3} mt-4 tab:mt-0 desk:mt-5`}>
          <Link
            href={p.href}
            className="inline-flex min-h-11 items-center decoration-[1.5px] underline-offset-4 hover:text-trait hover:underline"
          >
            {p.nom}
          </Link>
        </h3>
        <p className="text-ink-2">{typo(p.lieu.texte)}</p>
        <p className="font-semibold">{typo(p.statut.texte)}</p>
        <p className="text-ink-2">{typo(p.resume.texte)}</p>
        <p className="mt-3">
          <TextLink href={waHref(typo(p.message))} aria-label={`${LIBELLES.programme}, ${p.nom}`}>
            {LIBELLES.programme}
          </TextLink>
        </p>
      </div>
    </article>
  );
}
