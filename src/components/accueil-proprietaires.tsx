import { LIBELLES, MESSAGES } from "@/content/messages";
import { METHODE } from "@/content/pages/accueil";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { BoutonWhatsApp } from "./boutons";
import { EnTeteSection } from "./en-tete-section";
import { TitreCote } from "./mot-cote";
import { CadrePhoto } from "./photo";
import { Section, type Surface } from "./section";

/**
 * Accueil, le bloc des propriétaires, après la méthode : « Vous avez un terrain ou des
 * hectares ? ». La photo 2542 en grand (le terrain nu au premier plan, la latérite
 * livrée sur la voie tracée, les piquets), sa légende à deux colonnes, puis la question,
 * ce qu'il faut nous dire et le bouton WhatsApp des propriétaires.
 *
 * Sur le calque : il suit la planche au bleu de la méthode (entre deux bleus, du clair).
 * Avec `numero`, le bloc s'ouvre par son en-tête de section ; sans lui, il continue la
 * section d'avant et commence par sa photo.
 *
 * `bascule` : la photo penche de 2° au pointeur. Une seule grande photo par page le
 * fait : passer `bascule={false}` si une autre le fait déjà.
 */
export function AccueilProprietaires({
  numero,
  nom = "Propriétaires",
  quantite,
  surface = "calque",
  bascule = true,
  className,
}: {
  /** La borne de la section. Absente : pas d'en-tête de section. */
  numero?: string;
  nom?: string;
  /** La quantité vraie de l'en-tête, si la page en compte une. */
  quantite?: string;
  surface?: Extract<Surface, "sable" | "calque">;
  bascule?: boolean;
  className?: string;
}) {
  return (
    <Section id="proprietaires" labelledBy="t-proprietaires" surface={surface} className={className}>
      {numero ? <EnTeteSection numero={numero} nom={nom} quantite={quantite} /> : null}
      <div className={cx("grid gap-y-8 desk:grid-cols-12 desk:items-center desk:gap-x-6", numero && SOUS_BORNE)}>
        {/* 2542 fait 2 560 px de large : en 3:2 au bureau, elle perd un peu de ciel et de
            sol, et garde le camion, la voie et le terrain nu. */}
        <CadrePhoto
          id="2542"
          bascule={bascule}
          bord
          ratio="aspect-[4/3] desk:aspect-[3/2]"
          sizes="(min-width: 1440px) 668px, (min-width: 1101px) 48vw, 100vw"
          className="apparait [&_figcaption]:text-balance desk:col-span-6"
        />
        {/* La colonne de texte prend la moitié droite, en retrait de 64 px : le titre y
            tient sur deux lignes dès 1 120 px, comme les autres titres de la page. */}
        <div className="desk:col-span-6 desk:col-start-7 desk:pl-16">
          <h2 id="t-proprietaires" className={T2}>
            <TitreCote texte={METHODE.proprietaires.titre} mot="hectares" />
          </h2>
          <p className={cx(CHAPEAU, "mt-5 max-w-[32rem] desk:mt-6")}>{typo(METHODE.proprietaires.texte.texte)}</p>
          <BoutonWhatsApp className="mt-8 desk:mt-10" label={LIBELLES.proprietaire} message={MESSAGES.proprietaire.texte} />
        </div>
      </div>
    </Section>
  );
}
