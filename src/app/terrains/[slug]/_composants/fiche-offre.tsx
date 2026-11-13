import { ContactBand } from "@/components/contact-band";
import { Gauge, Swatch } from "@/components/dessins/swatch";
import { Fiche } from "@/components/fiche";
import { versLien } from "@/components/liste-programmes";
import { PageHead } from "@/components/page-head";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { TexteFait } from "@/components/texte";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { DOCUMENTS, SOURCE_DEFINITIONS, type Document } from "@/content/foncier";
import { PROGRAMMES, type OffreDatee } from "@/content/programmes";
import { STATUT_FONCIER_MOT } from "@/content/types";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import {
  BandeAvantAchat,
  COL_FICHE,
  COL_VISUEL,
  LEGENDE,
  LIGNE,
  RETOUR,
  RYTHME_OUVERTURE,
} from "./communs";

/**
 * Encadré « Ce qu'est un bail » (7.3, Recasement AIBD) : la ligne du tableau des
 * documents (3.15) pour ce statut, sa jauge, sa source, et le lien vers /foncier/.
 * Cadre 1,5 px encre, comme l'encart propriétaires.
 */
function Encadre({ document: d, className }: { document: Document; className?: string }) {
  return (
    <aside
      aria-labelledby="t-statut"
      className={cx(
        "border-[1.5px] border-ink bg-paper px-4.5 py-6 tab:grid tab:grid-cols-12 tab:gap-x-6 tab:p-10",
        className,
      )}
    >
      <div className="tab:col-span-full desk:col-[1/span_5]">
        <h2 id="t-statut" className="text-5 leading-snug font-bold stretch-sub">
          {`Ce qu’est un ${d.nom.toLowerCase()}`}
        </h2>
        <p className="mt-5 mb-2.5 font-mono text-1 leading-label font-medium text-ink-2 tab:mt-7">Niveau de sécurité</p>
        <Gauge statut={d.statut} niveau={d.niveau.texte} empile />
      </div>
      <div className="mt-7 tab:col-span-full tab:mt-9 desk:col-[7/span_6] desk:mt-0">
        <p className="text-4 leading-caption">
          <TexteFait fait={d.definition} />
        </p>
        <p className="mt-3 text-3 leading-body text-ink-2">
          <TexteFait fait={d.aSavoir} />
        </p>
        <p className="mt-5 text-2 leading-caption text-ink-2">
          <TexteFait fait={SOURCE_DEFINITIONS} />
        </p>
        <TextLink href="/foncier/" className="mt-1">
          Délibération, bail, titre foncier : la différence
        </TextLink>
      </div>
    </aside>
  );
}

/**
 * Offre datée (7.3, Recasement AIBD) : ouverture classique et courte, étiquette
 * mono datée. Aucune photo n'existe : le grand échantillon du statut en tient lieu.
 * Le prix n'apparaît qu'avec sa date, le bouton demande la disponibilité.
 */
export function FicheOffre({ offre: o }: { offre: OffreDatee }) {
  const document = DOCUMENTS.find((d) => d.statut === o.statut);
  const mot = STATUT_FONCIER_MOT[o.statut];
  return (
    <>
      <Section labelledBy="t-page" rythme="aucun" className={RYTHME_OUVERTURE}>
        <PageHead
          retour={RETOUR}
          numero="01"
          titre={o.nom}
          titreId="t-page"
          intro={<p className="font-mono text-1 leading-label font-medium text-ink-2">{typo(o.etiquette)}</p>}
        />
        <div className={LIGNE}>
          <figure className={cx("m-0 flex flex-col", COL_VISUEL)}>
            {/* Le mot posé sur fond blanc, comme « TF » sur la tuile du titre (3.12).
                Lu par la légende : masqué aux lecteurs d'écran. */}
            <div className="relative aspect-video tab:aspect-[21/8] desk:aspect-auto desk:min-h-90 desk:flex-1">
              <Swatch statut={o.statut} taille="grand" className="absolute inset-0 size-full" />
              <p
                aria-hidden="true"
                className="absolute top-3 left-3 bg-paper px-2.5 text-7 leading-tight font-bold text-trait stretch-title tab:top-4.5 tab:left-5"
              >
                {mot}
              </p>
            </div>
            <figcaption className={LEGENDE}>
              {typo(`Statut foncier de l’offre : ${mot.toLowerCase()}. Hachure simple, comme dans tous nos dessins.`)}
            </figcaption>
          </figure>
          <div className={COL_FICHE}>
            {o.fiche ? <Fiche lignes={o.fiche} marge="" /> : null}
            <WhatsAppButton label={o.bouton} message={o.message} className="mt-5.5 tab:mt-7" />
          </div>
        </div>
        {document ? <Encadre document={document} className="mt-14 tab:mt-24" /> : null}
      </Section>

      {/* Pas de vidéo publiée pour cette offre. Le lien vers /foncier/ est dans l'encadré. */}
      <BandeAvantAchat
        videos={[]}
        autres={PROGRAMMES.map((x) => versLien(x))}
        titreAutres="Les programmes en vente"
        lienFoncier={false}
      />

      {/* Même message que le bouton de la fiche : même libellé. */}
      <ContactBand message={o.message} bouton={o.bouton} />
    </>
  );
}
