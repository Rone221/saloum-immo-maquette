import type { ReactNode } from "react";
import { SLOGAN } from "@/content/site";
import { asset, cx } from "@/lib/base";
import { SOUS_BORNE } from "@/lib/classes";
import { typo } from "@/lib/format";
import { EnTeteSection } from "./en-tete-section";
import { TitreCote } from "./mot-cote";
import { Section } from "./section";

/** Le tour de la couronne : la devise, sans son point, puis un point médian. */
const TOUR = `${SLOGAN.texte.replace(/\.$/, "")} · `.toLocaleUpperCase("fr");
/** Rayon du cercle qui porte la devise, dans un dessin de 280 de côté. */
const RAYON = 112;
const LONGUEUR = Math.round(2 * Math.PI * RAYON);

/**
 * La devise en couronne : « Transformer la terre, construire l'avenir » tourne
 * lentement autour du monogramme (10° par seconde : un tour en 36 s ; fixe en
 * mouvement réduit). C'est leur devise, celle de l'enseigne de l'agence. Ce n'est pas
 * un cachet : pas de double cercle, aucun mot comme « certifié » ou « officiel ».
 * Le monogramme est le « SI » du logo horizontal officiel, cadré dans sa largeur,
 * jamais recoloré ni étiré.
 *
 * Le bloc coupe ce qui sort de son carré (overflow-clip). Le dessin qui tourne est un
 * carré : vers 45°, ses angles vides dépassaient du bloc, et de l'écran quand la
 * couronne est au bord. La page défilait alors de côté, par moments (1 466 px pour
 * 1 440). Rien de visible n'est rogné : la devise tient dans le cercle inscrit
 * (rayon 112 + la hauteur des lettres, pour un demi-côté de 140).
 */
export function Couronne({ className }: { className?: string }) {
  return (
    <div className={cx("relative aspect-square w-[min(17.5rem,72vw)] overflow-clip desk:w-80", className)}>
      {/* Lue une fois, en clair, par les lecteurs d'écran : le dessin la redit. */}
      <p className="sr-only">{typo(SLOGAN.texte)}</p>
      <svg viewBox="0 0 280 280" aria-hidden="true" className="couronne-tour absolute inset-0 size-full overflow-visible">
        <defs>
          <path
            id="couronne-cercle"
            d={`M140 ${140 - RAYON} a${RAYON} ${RAYON} 0 1 1 0 ${2 * RAYON} a${RAYON} ${RAYON} 0 1 1 0 ${-2 * RAYON}`}
          />
        </defs>
        <text className="mesure fill-(--r-doux) text-[15px]">
          <textPath href="#couronne-cercle" textLength={LONGUEUR} lengthAdjust="spacing">
            {TOUR}
          </textPath>
        </text>
      </svg>
      {/* L'axe d'un rond-point, en trait mixte : il ne tourne pas. */}
      <svg viewBox="0 0 280 280" aria-hidden="true" className="absolute inset-0 size-full">
        <circle cx="140" cy="140" r="84" fill="none" stroke="var(--r-axe)" strokeWidth="1" strokeDasharray="14 4 2 4" />
      </svg>
      <span className="absolute top-1/2 left-1/2 block aspect-[150/160] h-[31%] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/2269-logo-horizontal-420.png")}
          width={420}
          height={160}
          loading="lazy"
          alt=""
          className="h-full w-auto max-w-none"
        />
      </span>
    </div>
  );
}

/**
 * L'appel final (direction v4, pièce 15) : avant le pied, sur chaque page sauf Contact.
 * Sur le calque : une phrase en Besley, le bouton WhatsApp de la page, et la devise en
 * couronne. La page pose ce composant en dernier ; le pied suit, dans le layout.
 *
 *   <AppelFinal
 *     numero="08" nom="Nous écrire"
 *     phrase={APPEL.phrase} mot="terrain"
 *     bouton={<BoutonWhatsApp label={LIBELLES.question} message={MESSAGES.question.texte} />}
 *   />
 */
export function AppelFinal({
  phrase,
  mot,
  bouton,
  numero,
  nom,
  quantite,
  children,
  classeTitre,
  className,
}: {
  /** La phrase, en titre : elle vient de src/content/pages/<page>.ts. */
  phrase: string;
  /**
   * Le mot coté de la phrase, s'il y en a un. Il est sur la dernière ligne : coté plus
   * haut, sa cote est percée par une capitale accentuée de la ligne suivante
   * (« Écrivez-nous »). Dans « Une question ? Écrivez-nous. », c'est l'action qui se cote.
   */
  mot?: string;
  /** Le bouton WhatsApp de la page, avec son message. */
  bouton: ReactNode;
  /** La borne de la section, à la suite de celles de la page, et son nom. */
  numero?: string;
  nom?: string;
  quantite?: string;
  /** Une ligne de plus sous la phrase, si la page en a besoin. */
  children?: ReactNode;
  /** Sur le titre : sa largeur, quand la phrase doit se couper après sa question (« max-w-[9.5em] »). */
  classeTitre?: string;
  className?: string;
}) {
  const titreId = "t-appel";
  return (
    <Section surface="calque" labelledBy={titreId} className={className}>
      {numero && nom ? <EnTeteSection numero={numero} nom={nom} quantite={quantite} /> : null}
      <div className={cx("grid gap-y-12 desk:grid-cols-12 desk:items-center desk:gap-x-6", numero && nom && SOUS_BORNE)}>
        <div className="desk:col-span-7">
          <h2 id={titreId} className={cx("titre text-h1", classeTitre)}>
            {mot ? <TitreCote texte={phrase} mot={mot} /> : typo(phrase)}
          </h2>
          {children ? <div className="mt-5 max-w-[36rem] text-chapeau desk:mt-6">{children}</div> : null}
          <div className="mt-8 desk:mt-10">{bouton}</div>
        </div>
        <Couronne className="justify-self-center desk:col-span-4 desk:col-start-9 desk:justify-self-end" />
      </div>
    </Section>
  );
}
