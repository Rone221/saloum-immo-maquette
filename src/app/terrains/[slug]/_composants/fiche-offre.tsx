import { BoutonWhatsApp } from "@/components/boutons";
import { EnTete } from "@/components/en-tete";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { DOCUMENTS } from "@/content/foncier";
import { LIBELLES } from "@/content/messages";
import { PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { cx } from "@/lib/base";
import { T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { VignetteTerrain } from "@/components/vignette-terrain";
import { ARIANE } from "./fiche-programme";

/**
 * Offre datée Recasement AIBD (revue 2) : une page courte, sans photo (aucune n'est
 * publiée). L'offre en tête avec sa date, ce qu'est un bail en carte (la seule
 * reprise admise hors de la page Foncier), puis les programmes en vente en vignettes.
 */
export function FicheOffre() {
  const bail = DOCUMENTS.find((d) => d.cle === "bail")!;
  return (
    <Section labelledBy="t-page" rythme="ouverture">
      <EnTete ariane={ARIANE} titre={RECASEMENT_AIBD.nom} chapeau={RECASEMENT_AIBD.fiche.texte} className="entree">
        <p className="mt-5 inline-flex bg-ink px-3 py-2 text-small leading-none font-semibold text-white">
          {typo(RECASEMENT_AIBD.etiquette)}
        </p>
        <div>
          <BoutonWhatsApp label={LIBELLES.recasementAibd} message={RECASEMENT_AIBD.message} className="mt-8 desk:mt-10" />
        </div>
      </EnTete>

      {/* Au bureau, le bail à gauche et les programmes en vente à droite, en colonne. */}
      <div className="mt-16 grid gap-y-14 desk:mt-24 desk:grid-cols-12 desk:items-start desk:gap-x-6">
        <section aria-labelledby="t-bail" className="reveler border border-rule p-6 tab:p-8 desk:col-span-7">
          <h2 id="t-bail" className={cx(T2, "flex items-center gap-4")}>
            <span aria-hidden="true" className="size-3.5 flex-none bg-borne" />
            {typo("Ce qu’est un bail")}
          </h2>
          <p className="mt-5">{typo(`${bail.definition.texte} ${bail.aSavoir.texte}`)}</p>
          <p className="mt-4 font-semibold">{typo(`Niveau de sécurité : ${bail.niveau.texte.toLowerCase()}.`)}</p>
          <p className="mt-2">
            <TextLink href="/foncier/">Comprendre le foncier</TextLink>
          </p>
        </section>

        <section aria-labelledby="t-programmes" className="desk:col-span-4 desk:col-start-9">
          <h2 id="t-programmes" className={T3}>
            Les programmes en vente
          </h2>
          <ul className="mt-5 grid gap-3 tab:grid-cols-3 desk:grid-cols-1">
            {PROGRAMMES.map((p, i) => (
              <li key={p.slug} className={i === 1 ? "reveler-2" : i === 2 ? "reveler-3" : "reveler"}>
                <VignetteTerrain href={p.href} nom={p.nom} detail={p.statut.texte} photo={p.photo} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Section>
  );
}
