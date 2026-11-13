import type { OffreDatee, Programme } from "@/content/programmes";
import type { Fait, StatutFoncier } from "@/content/types";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { StatutEnLigne } from "./dessins/swatch";
import { Lien } from "./text-link";
import { TexteFait } from "./texte";
import { TITRE_COLONNE } from "./ticks";

export type LienProgramme = {
  nom: string;
  href: string;
  statut: StatutFoncier;
  /** Mot à côté de l'échantillon. */
  statutTexte: string;
  /** Lieu publié, sous le nom (Diaspora). */
  lieu?: Fait;
};

/** Un programme ou une offre datée, en ligne de liste. `lieu` : ajoute le lieu publié. */
export function versLien(p: Programme | OffreDatee, { lieu = false }: { lieu?: boolean } = {}): LienProgramme {
  const programme = "statutTexte" in p ? p : null;
  return {
    nom: p.nom,
    href: p.href ?? "/terrains/",
    statut: p.statut,
    statutTexte: programme ? programme.statutTexte.texte : (p as OffreDatee).etiquette,
    lieu: lieu && programme ? programme.catalogue.lieu : undefined,
  };
}

const VARIANTES = {
  /** Titre à gauche (col. 1 à 3), lignes à droite : comme « À regarder avant d'appeler ». */
  gauche: {
    bloc: "border-t border-ink pt-4.5 desk:grid desk:grid-cols-12 desk:gap-x-6",
    titre: "text-5 leading-snug font-bold stretch-sub desk:col-span-3",
    liste: "mt-3 desk:col-[4/-1] desk:mt-0",
    ligne: "grid min-h-14 gap-x-6 gap-y-2.5 py-3.5 tab:grid-cols-2 tab:items-center tab:py-4",
  },
  /** En colonne, à côté des Ticks (fiches) : même titre qu'eux. */
  colonne: {
    bloc: "",
    titre: TITRE_COLONNE,
    liste: "",
    ligne: "flex min-h-14 flex-col justify-center gap-1.5 py-3 tab:py-3.5",
  },
};

/**
 * Liste de liens vers les fiches (7.3, point 7 ; 7.5, point 5) : le nom souligné,
 * le lieu publié s'il est donné, l'échantillon du statut et son mot. Pas de prix,
 * pas de disponibilité.
 */
export function ListeProgrammes({
  liens,
  titre,
  titreId,
  niveau = 2,
  variante = "colonne",
  className,
}: {
  liens: LienProgramme[];
  titre: string;
  titreId: string;
  niveau?: 2 | 3;
  variante?: keyof typeof VARIANTES;
  className?: string;
}) {
  const v = VARIANTES[variante];
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <div className={cx(v.bloc, className)}>
      <Titre id={titreId} className={v.titre}>
        {typo(titre)}
      </Titre>
      <ul aria-labelledby={titreId} className={v.liste}>
        {liens.map((l) => (
          <li key={l.href}>
            <Lien href={l.href} className={cx("group border-b border-rule", v.ligne)}>
              <span className="flex flex-col gap-0.5">
                <span className="self-start text-4 leading-snug font-bold text-trait underline decoration-1 underline-offset-5 stretch-sub group-hover:decoration-2">
                  {l.nom}
                </span>
                {l.lieu ? (
                  <span className="text-2 leading-caption text-ink-2">
                    <TexteFait fait={l.lieu} />
                  </span>
                ) : null}
              </span>
              <StatutEnLigne statut={l.statut} texte={l.statutTexte} className="text-2 leading-snug font-semibold" />
            </Lien>
          </li>
        ))}
      </ul>
    </div>
  );
}
