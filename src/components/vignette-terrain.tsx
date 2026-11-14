import Link from "next/link";
import type { PhotoId } from "@/content/photos";
import { typo } from "@/lib/format";
import { Photo } from "./photo";
import { Fleche } from "./reperes";

/** Une petite carte vers un autre terrain : vignette, nom, statut, flèche. */
export function VignetteTerrain({ href, nom, detail, photo }: { href: string; nom: string; detail: string; photo?: PhotoId }) {
  return (
    <Link
      href={href}
      className="group flex h-full items-center gap-4 border border-rule bg-paper p-3 pr-5 transition-colors duration-300 hover:border-trait"
    >
      {photo ? (
        <span className="relative block size-18 flex-none overflow-hidden bg-paper-2">
          <Photo id={photo} fill decorative sizes="72px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </span>
      ) : (
        <span aria-hidden="true" className="quadrillage block size-18 flex-none" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold transition-colors group-hover:text-trait">{nom}</span>
        <span className="block text-small text-ink-2">{typo(detail)}</span>
      </span>
      <Fleche className="text-trait" />
    </Link>
  );
}
