import Link from "next/link";
import { BoutonWhatsApp } from "@/components/boutons";
import { EnTete } from "@/components/en-tete";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { DOCUMENTS } from "@/content/foncier";
import { LIBELLES } from "@/content/messages";
import { PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { cx } from "@/lib/base";
import { COLONNE, SOUS_TITRE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { ARIANE } from "./fiche-programme";

/**
 * Offre datée Recasement AIBD : une page courte, typographique, sans photo (aucune
 * n'est publiée), en une colonne. L'offre en tête avec sa date, ce qu'est un bail
 * en deux phrases (la seule reprise admise hors de la page Foncier), puis les
 * programmes en vente.
 */
export function FicheOffre() {
  const bail = DOCUMENTS.find((d) => d.cle === "bail")!;
  return (
    <Section labelledBy="t-page" rythme="ouverture">
      <EnTete ariane={ARIANE} titre={RECASEMENT_AIBD.nom} chapeau={RECASEMENT_AIBD.fiche.texte}>
        <BoutonWhatsApp label={LIBELLES.recasementAibd} message={RECASEMENT_AIBD.message} className="mt-8 desk:mt-10" />
      </EnTete>

      <section aria-labelledby="t-bail" className={cx(COLONNE, "mt-20 desk:mt-28")}>
        <h2 id="t-bail" className={T2}>
          {typo("Ce qu’est un bail")}
        </h2>
        <p className={SOUS_TITRE}>{typo(`${bail.definition.texte} ${bail.aSavoir.texte}`)}</p>
        <p className="mt-4 font-semibold">{typo(`Niveau de sécurité : ${bail.niveau.texte.toLowerCase()}.`)}</p>
        <p className="mt-2">
          <TextLink href="/foncier/">Comprendre le foncier</TextLink>
        </p>
      </section>

      <p className={cx(COLONNE, "mt-16 desk:mt-20")}>
        {typo("Les programmes en vente : ")}
        {PROGRAMMES.map((p, i) => (
          <span key={p.slug}>
            {i > 0 ? ", " : null}
            <Link
              href={p.href}
              className="inline-block py-2.5 font-semibold text-trait underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              {p.nom}
            </Link>
          </span>
        ))}
        .
      </p>
    </Section>
  );
}
