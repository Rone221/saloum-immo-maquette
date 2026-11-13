import { SERVICES, type Service } from "@/content/services";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { TextLink } from "./text-link";

/**
 * Nomenclature des huit services publiés (3.14), libellés verbatim, numérotés
 * 01 à 08 en mono trait. Encart : deux colonnes de quatre dès 761 px, chaque
 * rangée à la hauteur de son contenu (repeat(4, auto), pas des rangées égales).
 * Pleine largeur (page Aménager) : les notes publiées et le lien vers l'étape.
 */
export function Nomenclature({
  services = SERVICES,
  titre = "Ce que fait Saloum Immo",
  variante = "encart",
  titreId,
  titreH2 = false,
  className,
}: {
  services?: Service[];
  titre?: string;
  variante?: "encart" | "pleine";
  titreId?: string;
  /**
   * true : l'étiquette est le titre (H2) de sa section. Page Aménager : la section des
   * services s'ouvre sur l'étiquette seule, pas sur une ouverture classique de plus (3.4).
   */
  titreH2?: boolean;
  className?: string;
}) {
  const pleine = variante === "pleine";
  const Titre = titreH2 ? "h2" : "p";
  return (
    <div className={className}>
      <Titre
        id={titreId}
        className="mb-1 border-b-[1.5px] border-ink pb-2.5 font-mono text-1 leading-caption font-medium text-ink-2"
      >
        {titre}
      </Titre>
      <ol className="tab:grid tab:grid-flow-col tab:grid-rows-[repeat(4,auto)] tab:gap-x-6">
        {services.map((s) => (
          <li
            key={s.numero}
            className={cx(
              "grid grid-cols-[34px_minmax(0,1fr)] gap-2 border-b border-rule py-2 tab:py-2.25",
              pleine ? "text-3 leading-body" : "text-2 leading-caption",
            )}
          >
            <span className="font-mono text-1 leading-body font-semibold text-trait">{s.numero}</span>
            <span>
              {typo(s.libelle)}
              {pleine && s.note ? <span className="block text-2 leading-caption text-ink-2">{typo(s.note)}</span> : null}
              {pleine && s.etape ? (
                <span className="block">
                  <TextLink href={s.etape}>{`Voir l’étape ${s.etape.replace("#etape-", "")}`}</TextLink>
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
