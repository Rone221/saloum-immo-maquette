// Mentions légales. Seuls la raison sociale, le téléphone et l'e-mail sont connus
// (content/site.ts). Le siège exact, le NINEA, le RCCM, le directeur de la
// publication et l'hébergeur doivent venir de Saloum Immo : ils s'écrivent « À
// fournir », rien n'est inventé.
//
// PAS PUBLIÉE : la page n'est pas publiée tant qu'elle contient un champ vide. Le
// dossier s'appelle _mentions-legales : un dossier préfixé par « _ » est privé, Next
// n'en fait pas de route. Pour publier : remplir les lignes `manque` de
// content/pages/mentions-legales.ts, puis renommer le dossier en mentions-legales et
// ajouter le lien dans le pied (components/pied.tsx).

import type { Metadata } from "next";
import { EnTete } from "@/components/en-tete";
import { Faits } from "@/components/faits";
import { Section } from "@/components/section";
import { EDITEUR, HEBERGEMENT, type LigneMention } from "@/content/pages/mentions-legales";
import { EMAIL, MOBILE, RAISON_SOCIALE } from "@/content/site";
import { cx } from "@/lib/base";
import { ENTRE_BLOCS, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

const DESCRIPTION = `Éditeur du site : ${RAISON_SOCIALE.texte}. Téléphone ${MOBILE.long}, e-mail ${EMAIL.adresse}.`;

// robots écrit ici et pas seulement dans le layout : la page ne s'indexe pas tant
// qu'une mention manque.
export const metadata: Metadata = metaPage("Mentions légales", DESCRIPTION, { robots: { index: false, follow: false } });

function lignes(l: LigneMention[]) {
  return l.map((x) => ({
    libelle: x.libelle,
    valeur:
      "manque" in x ? (
        <span className="text-ink-2">À fournir.</span>
      ) : x.lien ? (
        <a href={x.lien} className="text-trait underline underline-offset-4">
          {typo(x.valeur.texte)}
        </a>
      ) : (
        typo(x.valeur.texte)
      ),
  }));
}

export default function MentionsLegales() {
  return (
    <Section labelledBy="t-page" rythme="ouverture">
      <EnTete titre="Mentions légales" chapeau={`Le site est édité par ${RAISON_SOCIALE.texte}.`} />
      <div className={cx(ENTRE_BLOCS, "grid gap-y-12 desk:grid-cols-2 desk:gap-x-12")}>
        <section aria-labelledby="t-editeur">
          <h2 id="t-editeur" className={T3}>
            Éditeur du site
          </h2>
          <Faits className="mt-5" lignes={lignes(EDITEUR)} />
        </section>
        <section aria-labelledby="t-hebergement">
          <h2 id="t-hebergement" className={T3}>
            Hébergement
          </h2>
          <Faits className="mt-5" lignes={lignes(HEBERGEMENT)} />
        </section>
      </div>
    </Section>
  );
}
