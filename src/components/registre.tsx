import { REGISTRE, type LigneRegistre } from "@/content/registre";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Section } from "./section";

/** Le tableau seul : Date, Travaux, Lieu, Source, Mesure. Blanc sur latérite. */
export function RegistreTable({ lignes, titreId }: { lignes: LigneRegistre[]; titreId?: string }) {
  return (
    <table className="reg" aria-labelledby={titreId}>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Travaux</th>
          <th scope="col">Lieu</th>
          <th scope="col">Source</th>
          <th scope="col" className="r">
            Mesure
          </th>
        </tr>
      </thead>
      <tbody>
        {lignes.map((l) => (
          <tr key={l.id}>
            <td className="d">{l.date.texte}</td>
            <td className="w">{typo(l.travaux.texte)}</td>
            <td className={cx("p", !l.lieu && "nd")}>{l.lieu ? typo(l.lieu.texte) : "Non publié"}</td>
            <td className="s">
              {l.sources.map((s) =>
                s.href ? (
                  <a key={s.libelle} href={s.href}>
                    {s.libelle}
                  </a>
                ) : (
                  <span key={s.libelle}>{s.libelle}</span>
                ),
              )}
            </td>
            <td className="m">
              {!l.mesure ? (
                <span className="none">
                  <span className="sr-only">Pas de mesure publiée</span>
                </span>
              ) : "mot" in l.mesure ? (
                <span className="none">{l.mesure.mot}</span>
              ) : (
                <>
                  <b>{l.mesure.valeur.texte}</b>
                  {`\u00a0${l.mesure.unite}`}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Registre des travaux (3.13), sur la latérite : une ligne par chantier daté,
 * chacune avec sa source. Remplace les compteurs. Titre en H2.
 * Fiches programme : passer `lignes={lignesDuProgramme(slug)}` et un autre titre.
 */
export function Registre({
  lignes = REGISTRE,
  id,
  titre = "Registre des travaux",
  titreId = "t-registre",
  intro = "Chaque ligne renvoie à sa publication d’origine. Quand le lieu n’a pas été publié, la case le dit.",
}: {
  lignes?: LigneRegistre[];
  id?: string;
  titre?: string;
  titreId?: string;
  intro?: string;
}) {
  if (lignes.length === 0) return null;
  return (
    <Section id={id} labelledBy={titreId} surface="laterite" rythme="registre">
      <div className="mb-2 items-end gap-x-6 border-t-2 border-white pt-4 tab:mb-10 tab:pt-5 desk:grid desk:grid-cols-12">
        <h2 id={titreId} className="text-6 leading-title font-bold tracking-tight stretch-title desk:col-span-6">
          {typo(titre)}
        </h2>
        <p className="mt-3 text-3 leading-body text-white/90 desk:col-[8/span_5] desk:mt-0">{typo(intro)}</p>
      </div>
      <RegistreTable lignes={lignes} titreId={titreId} />
    </Section>
  );
}
