import type { OffreDatee } from "@/content/programmes";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Swatch } from "./dessins/swatch";
import { TextLink } from "./text-link";
import { TexteFait } from "./texte";
import { WhatsAppButton } from "./whatsapp-button";

/**
 * Offre datée (3.10) : une offre dont seule la date ancienne est connue.
 * Échantillon du statut, étiquette mono, nom en gras et texte, bouton WhatsApp
 * taille s et son message sur la même ligne. Le prix n'apparaît qu'avec sa date.
 * Le bouton demande la disponibilité, jamais « Réserver ».
 * Sert aussi aux « Autres sites publiés » (échantillon « non publié », en tirets).
 */
export function DatedOffer({
  offre,
  titreId,
  as: Balise = "aside",
  lienFiche = false,
  className,
}: {
  offre: OffreDatee;
  titreId?: string;
  as?: "aside" | "article" | "div";
  /** Ajoute « Voir l'offre » vers la page de l'offre, quand elle existe. */
  lienFiche?: boolean;
  className?: string;
}) {
  const id = titreId ?? `t-${offre.slug}`;
  return (
    <Balise
      aria-labelledby={id}
      className={cx(
        "grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-6 gap-y-2 border-t-[1.5px] border-b border-t-ink border-b-rule py-6.5 tab:grid-cols-[44px_220px_minmax(0,1fr)] tab:items-start",
        className,
      )}
    >
      <Swatch statut={offre.statut} />
      <p className="font-mono text-1 leading-caption font-medium text-ink-2 tab:pt-1">{typo(offre.etiquette)}</p>
      <div className="col-span-full mt-1.5 tab:col-span-1 tab:mt-0">
        <p className="max-w-[46em] text-3 leading-body">
          <strong id={id} className="font-bold">
            {typo(offre.titre)}
          </strong>{" "}
          <TexteFait fait={offre.texte} />
        </p>
        <WhatsAppButton
          label={offre.bouton}
          ariaLabel={offre.boutonAria}
          message={offre.message}
          size="s"
          layout="ligne"
          className="mt-4"
        />
        {lienFiche && offre.href ? <TextLink href={offre.href}>{`Voir l’offre ${offre.nom}`}</TextLink> : null}
      </div>
    </Balise>
  );
}
