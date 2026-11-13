import { RESEAUX_A_PROPOS } from "@/content/pages/a-propos";
import { RELEVE_RESEAUX } from "@/content/site";
import { dateMono, typo } from "@/lib/format";

/**
 * « Sur les réseaux » (7.7), au gabarit de « À regarder avant d'appeler » (3.16) :
 * titre à gauche (col. 1 à 3), liste à droite (col. 4 à 12). Chaque ligne est un
 * lien de 56 px : le réseau, le compte, puis les chiffres relevés le 13.11.2026.
 * Sans chiffre relevé, la case est en pointillés (2.8) : rien n'a été mesuré.
 */
export function Reseaux({ titreId = "t-reseaux" }: { titreId?: string }) {
  const releve = dateMono(RELEVE_RESEAUX);
  return (
    <div className="border-t border-ink pt-4.5 desk:grid desk:grid-cols-12 desk:gap-x-6">
      <div className="desk:col-span-3">
        {/* Titre de bloc (2.3, text-5) : pas plus petit que le H3 Millennium City qui précède. */}
        <h2 id={titreId} className="text-5 leading-snug font-bold stretch-sub">
          Sur les réseaux
        </h2>
        <p className="mt-1.5 font-mono text-1 leading-label font-medium text-ink-2">Chiffres relevés le {releve}</p>
        <p className="mt-1 flex items-center gap-2.5 font-mono text-1 leading-label font-medium text-ink-2">
          <span className="dots-x block w-8.5 text-ink" aria-hidden="true" />
          {typo("Pointillés : pas de chiffre relevé")}
        </p>
      </div>
      <ul aria-labelledby={titreId} className="mt-4 desk:col-[4/-1] desk:mt-0">
        {RESEAUX_A_PROPOS.map((r) => (
          <li key={r.nom}>
            <a
              href={r.href}
              className="group grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-b border-rule py-2.5 tab:grid-cols-[136px_minmax(0,1fr)_auto] tab:gap-x-6"
            >
              <span className="col-start-1 row-start-1 font-semibold text-trait underline decoration-1 underline-offset-5 group-hover:decoration-2">
                {r.nom}
              </span>
              <span className="col-start-1 row-start-2 text-2 leading-caption text-ink-2 tab:col-start-2 tab:row-start-1">
                {typo(r.compte.texte)}
              </span>
              <span className="col-start-2 row-span-2 row-start-1 text-right tab:col-start-3 tab:row-span-1">
                {r.chiffres.length > 0 ? (
                  <span className="font-semibold">{typo(r.chiffres.map((c) => c.texte).join(", "))}</span>
                ) : (
                  <span className="inline-block w-18 align-middle text-ink-2">
                    <span className="dots-x block" aria-hidden="true" />
                    <span className="sr-only">Pas de chiffre relevé</span>
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
