import { MESSAGES } from "@/content/messages";
import { OFFRE_PROPRIETAIRES } from "@/content/services";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Nomenclature } from "./nomenclature";
import { InlineLink } from "./text-link";
import { WhatsAppButton } from "./whatsapp-button";

/**
 * Encart propriétaires (3.14), ancre #proprietaires : la seule question de la
 * page, l'offre datée (lien vers la publication), le bouton avec le message à
 * compléter, et la nomenclature des huit services à droite.
 */
export function OwnerBox({
  niveau = 3,
  titreId = "t-proprietaires",
  nomenclature = true,
  className,
}: {
  niveau?: 2 | 3;
  titreId?: string;
  /**
   * false : sans la nomenclature (quand elle est posée ailleurs en pleine largeur).
   * "desk" : seulement dès 1 101 px, là où elle est à droite du texte (page Aménager,
   * qui la reprend en pleine largeur plus bas).
   */
  nomenclature?: boolean | "desk";
  className?: string;
}) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <aside
      id="proprietaires"
      aria-labelledby={titreId}
      className={cx(
        // html porte déjà scroll-padding-top (en-tête + 8 px) : 8 px de plus font en-tête + 16 px.
        "scroll-mt-2 border-[1.5px] border-ink bg-paper px-4.5 py-6 tab:grid tab:grid-cols-12 tab:gap-x-6 tab:gap-y-8 tab:p-10",
        className,
      )}
    >
      <div className={cx("tab:col-span-full", nomenclature && "desk:col-[1/span_5]")}>
        <Titre id={titreId} className="mb-3 text-5 leading-snug font-bold stretch-sub">
          {typo("Vous avez un terrain ou des hectares ?")}
        </Titre>
        <p className="max-w-[32em] text-3 leading-body text-ink-2">
          Nous l’aménageons aussi pour les propriétaires.{" "}
          <InlineLink href={OFFRE_PROPRIETAIRES.lien!}>{OFFRE_PROPRIETAIRES.texte}</InlineLink> Dites-nous où se trouve
          le terrain et sa surface.
        </p>
        <WhatsAppButton
          label="Décrire mon terrain sur WhatsApp"
          message={MESSAGES.proprietaire.texte}
          template
          className="mt-5.5 tab:mt-7"
        />
      </div>
      {nomenclature ? (
        <Nomenclature
          className={cx(
            "mt-7 tab:col-span-full tab:mt-0 desk:col-[7/span_6]",
            nomenclature === "desk" && "hidden desk:block",
          )}
        />
      ) : null}
    </aside>
  );
}
