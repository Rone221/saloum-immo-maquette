import type { ReactNode } from "react";
import { REPERES_COUPE } from "@/content/services";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Coupe de principe d'une voie aménagée (3.11), sans échelle : ce qui reste dans
 * le sol une fois les engins partis. Le titre de la section est posé dans le dessin
 * (« ouverture dans le dessin ») : en haut à gauche dès 1 101 px, au-dessus avant.
 * Sous 1 101 px, les étiquettes du dessin disparaissent et une légende en liste
 * prend le relais (3.11 la prévoit sous 761 px ; sur tablette, les étiquettes du
 * dessin tombaient à 10 px). Seul orange : les deux bornes.
 */
export function Coupe({
  numero,
  titre,
  titreId,
  intro,
  niveau = 2,
  id = "coupe",
  className,
}: {
  numero?: string;
  titre: string;
  titreId: string;
  intro?: ReactNode;
  /** 1 : la coupe ouvre la page (Aménager), titre en text-7. */
  niveau?: 1 | 2;
  /** Préfixe des identifiants du SVG (motifs, légende), unique sur la page. */
  id?: string;
  className?: string;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";
  const cap = `${id}-cap`;
  const lat = `${id}-lat`;
  const sol = `${id}-sol`;
  const libelle = (n: number) => REPERES_COUPE.find((r) => r.numero === n)!.libelle;
  return (
    <figure className={cx("coupe", className)}>
      <div className="coupe-head">
        {numero ? <span className="mb-4.5 block font-mono text-1 leading-tight font-medium">{numero}</span> : null}
        <Titre
          id={titreId}
          className={cx(
            "font-bold stretch-title",
            niveau === 1 ? "text-7 leading-title tracking-title" : "text-6 leading-title tracking-tight",
          )}
        >
          {typo(titre)}
        </Titre>
        {intro ? (
          <div className="mt-4 max-w-[30em] text-3 leading-body text-ink-2">
            {typeof intro === "string" ? <p>{typo(intro)}</p> : intro}
          </div>
        ) : null}
      </div>
      <svg viewBox="0 0 1200 520" role="img" aria-labelledby={cap}>
        <defs>
          <pattern id={lat} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="9" height="9" className="p-fond" />
            <line x1="0" y1="0" x2="0" y2="9" className="hatch" />
          </pattern>
          <pattern id={sol} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="6" r="1.4" className="dot" />
            <circle cx="15" cy="16" r="1.4" className="dot" />
          </pattern>
        </defs>
        <rect x="0" y="380" width="1200" height="140" fill={`url(#${sol})`} />
        <path className="tn" d="M0 350 C60 334 110 372 170 356 S270 336 330 362 S400 378 432 380" />
        <path className="cable" d="M930 138 Q1040 190 1150 138 Q1176 150 1200 147" />
        <path className="ground" d="M0 380 H1200" />
        <rect className="obj" x="470" y="362" width="18" height="34" />
        <path className="road" d="M488 376 Q624 356 760 376 L760 402 L488 402 Z" fill={`url(#${lat})`} />
        <rect className="obj" x="760" y="362" width="18" height="34" />
        <path className="trench" d="M818 380 L822 488 L870 488 L874 380" />
        <circle className="pipe" cx="846" cy="462" r="14" />
        <rect className="obj" x="923" y="118" width="14" height="282" />
        <path className="obj-line" d="M898 138 H962" />
        <rect className="obj" x="1143" y="118" width="14" height="282" />
        <path className="obj-line" d="M1118 138 H1182" />
        <rect className="borne" x="436" y="352" width="16" height="48" />
        <rect className="borne" x="1060" y="352" width="16" height="48" />
        <g className="leads">
          <path d="M200 268 V356" />
          <path d="M444 268 V350" />
          <path d="M624 268 V362" />
          <path d="M846 268 V446" />
          <path d="M1000 76 V158" />
        </g>
        <g className="tags">
          <rect x="182" y="232" width="36" height="36" />
          <text x="200" y="257">1</text>
          <rect x="426" y="232" width="36" height="36" />
          <text x="444" y="257">2</text>
          <rect x="606" y="232" width="36" height="36" />
          <text x="624" y="257">3</text>
          <rect x="828" y="232" width="36" height="36" />
          <text x="846" y="257">4</text>
          <rect x="982" y="40" width="36" height="36" />
          <text x="1000" y="65">5</text>
        </g>
        <g className="clbl">
          <text x="228" y="257">{libelle(1)}</text>
          <text x="472" y="257">{libelle(2)}</text>
          <text x="652" y="257">{libelle(3)}</text>
          <text x="874" y="257">{libelle(4)}</text>
          <text x="1028" y="65">{libelle(5)}</text>
          <text x="8" y="330" className="small">
            terrain naturel
          </text>
        </g>
      </svg>
      {/* Mobile et tablette : la légende du dessin, en liste. */}
      <ol className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-4 pt-1.5 pb-3 tab:grid-cols-5 tab:px-10 tab:pt-2 tab:pb-4 desk:hidden">
        {REPERES_COUPE.map((r) => (
          <li key={r.numero} className="flex items-center gap-2.5 text-2 leading-snug">
            <span
              aria-hidden="true"
              className="inline-grid size-5 flex-none place-items-center bg-ink font-mono text-1 leading-tight font-semibold text-white"
            >
              {r.numero}
            </span>
            {r.libelle}
          </li>
        ))}
      </ol>
      <figcaption id={cap} className="border-t border-rule px-4 pt-2.5 pb-3 text-2 leading-caption text-ink-2 tab:px-10 tab:pt-3 tab:pb-3.5">
        Coupe de principe d’une voie aménagée, sans échelle. Les numéros renvoient aux photos.
      </figcaption>
    </figure>
  );
}
