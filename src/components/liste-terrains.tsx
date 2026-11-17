import type { CSSProperties } from "react";
import { RELEVE } from "@/content/pages/terrains";
import type { Programme } from "@/content/programmes";
import { cx } from "@/lib/base";
import { NOM, NOTE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { TitreCote } from "./mot-cote";
import { Fleche, Lien } from "./text-link";

/** Une étiquette n'est pas une phrase : sans point final. */
const sansPoint = (texte: string) => texte.replace(/\.$/, "");

/**
 * Le nom d'un terrain qui mène à sa fiche, et sa flèche. Une seule écriture pour toutes
 * les listes du site : celle-ci, l'index de l'accueil et le tableau de la page Terrains
 * (components/index-terrains.tsx), le registre et la planche des papiers
 * (components/terrains-autres.tsx). Le nom dans la lettre des titres, sans
 * soulignement ; la flèche dit le lien.
 *
 * La flèche tient au dernier mot : quand le nom passe sur deux lignes, elle le suit.
 * Elle n'est jamais seule sur sa ligne, ni au bout de la colonne, loin du nom. Elle se
 * pose à mi-hauteur de la ligne.
 *
 * `grand` : un nom dans le corps des programmes (NOM). Sinon, le corps d'un h3 (T3).
 * `fleche` : une classe de plus sur la flèche, pour la feuille de style de l'appelant.
 *
 * À poser dans le lien : la couleur au survol et la zone de clic restent à l'appelant.
 * Dans un lien en flex, l'envelopper d'un <span> : le nom et sa flèche font un seul bloc.
 */
export function NomFleche({ nom, grand = false, fleche }: { nom: string; grand?: boolean; fleche?: string }) {
  const texte = typo(nom);
  const coupe = texte.lastIndexOf(" ") + 1;
  return (
    <>
      {texte.slice(0, coupe)}
      <span className={cx("inline-flex items-center", grand ? "gap-4" : "gap-2.5")}>
        {texte.slice(coupe)}
        <Fleche className={cx(grand && "size-5 desk:size-6", fleche)} />
      </span>
    </>
  );
}

/**
 * Les terrains en vente, en liste (direction v4) : sous chaque fiche (« les autres
 * terrains ») et sur la page introuvable. Une ligne par programme, dans les mots de
 * l'index de l'accueil (components/index-terrains.tsx) : le nom dans la lettre des
 * titres, qui mène à la fiche ; le papier en étiquette, avec sa référence quand elle est
 * publiée ; le lieu. Un statut inconnu se montre : la cote en pointillés, sans valeur,
 * puis le conseil, en mots.
 *
 * Plus simple que l'index : ni bande ni tirage photo. La ligne entière se clique (le
 * lien du nom la couvre) ; au survol, le nom prend la couleur d'accent et sa flèche
 * avance. Les couleurs suivent la surface.
 *
 * Le statut en mots et la référence viennent du relevé de la page Terrains (RELEVE) :
 * les mêmes mots que sur l'accueil. Le lieu : programmes.ts.
 */
export function ListeTerrains({
  programmes,
  titre,
  mot,
  className,
}: {
  programmes: Programme[];
  /** Un conseil, en h2 ; sans titre, la page en porte déjà un (la 404). */
  titre?: string;
  /** Le mot coté du titre : un mot de `titre`, tel qu'il y est écrit. */
  mot?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {titre ? (
        <h2 id="t-autres" className={cx(T2, "max-w-[14em]")}>
          {mot ? <TitreCote texte={titre} mot={mot} /> : typo(titre)}
        </h2>
      ) : null}
      <ul className={cx("m-0 list-none border-t border-fort p-0", titre && "mt-10 desk:mt-14")}>
        {programmes.map((p, i) => {
          const releve = RELEVE.find((r) => r.slug === p.slug);
          const statut = releve?.statut ?? p.statutFiche ?? p.statut;
          return (
            <li
              key={p.slug}
              className="apparait group relative grid gap-y-3 border-b border-ligne py-6 tab:grid-cols-12 tab:items-baseline tab:gap-x-6 desk:py-8"
              style={{ "--rang": i } as CSSProperties}
            >
              <p className="tab:col-span-12 desk:col-span-5">
                <Lien
                  href={p.href}
                  className={cx(NOM, "inline-block transition-surface group-hover:text-accent after:absolute after:inset-0")}
                >
                  <NomFleche nom={p.nom} grand />
                </Lien>
              </p>
              <div className="tab:col-span-6 desk:col-span-4">
                {/* Le papier qu'on ignore : la cote d'une distance sans chiffre, ici sans valeur du tout. */}
                {p.foncier === "a-demander" ? (
                  <span aria-hidden="true" className="mb-2 flex h-3 w-full max-w-36 items-center text-accent">
                    <span className="h-full w-[1.5px] flex-none bg-current" />
                    <span className="pointille h-[1.5px] flex-1" />
                    <span className="h-full w-[1.5px] flex-none bg-current" />
                  </span>
                ) : null}
                <p className="etiquette text-fort">{typo(sansPoint(statut.texte))}</p>
                {releve?.reference ? (
                  <p className="mt-1.5 leading-snug">
                    <span className={NOTE}>{typo(releve.reference.cle)}</span>{" "}
                    <span className="mesure whitespace-nowrap text-fort">{typo(releve.reference.valeur.texte)}</span>
                  </p>
                ) : null}
              </div>
              <p className="etiquette text-doux tab:col-span-6 desk:col-span-3">{typo(sansPoint(p.lieu.texte))}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
