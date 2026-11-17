"use client";

import { memo, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Lien } from "@/components/text-link";
import { EDITEUR } from "@/content/demo/textes";
import { asset, cx } from "@/lib/base";
import { T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { BOUTON, BOUTON_CONTOUR, BOUTON_PLEIN, INSECABLE } from "./outils";
import { Carre } from "./pieces";
import type { ApercuPhoto, Champ, Fiche, RubriqueAdmin } from "./rubriques";

/** Ce qui a été saisi dans une fiche : par champ, la valeur du moment. Absent : la valeur du site. */
type Saisies = Record<string, string>;

const sansAbonnement = () => () => {};
/** L'ancre de l'adresse (« #fiche-lac-town ») dit quelle fiche est ouverte. */
const abonnerAncre = (rappel: () => void) => {
  window.addEventListener("hashchange", rappel);
  return () => window.removeEventListener("hashchange", rappel);
};
const lireAncre = () => window.location.hash;
const sansAncre = () => "";

const ancreFiche = (id: string) => `fiche-${id}`;
/** L'ancre de la liste des fiches : le lien de retour, sur téléphone. */
const ANCRE_LISTE = "fiches";

/** La valeur d'un champ, et si elle a quitté celle du site. */
const valeurDe = (champ: Champ, saisies?: Saisies) => saisies?.[champ.id] ?? champ.valeur;
const modifies = (fiche: Fiche, saisies?: Saisies) =>
  saisies ? fiche.groupes.reduce((n, g) => n + g.champs.filter((c) => c.id in saisies && saisies[c.id] !== c.valeur).length, 0) : 0;

/** Un lien de source ou d'adresse : souligné, la couleur d'accent au survol. */
const LIEN = "underline decoration-1 underline-offset-4 transition-surface hover:text-accent hover:decoration-2";

/**
 * Ce qu'est une fiche, puis sa référence quand elle en a une : « Photo de chantier ·
 * 2528 ». À poser dans une étiquette. La référence est un nom de fichier : elle garde
 * sa casse et ne se coupe pas. Le point médian tient au mot d'avant : il ne commence
 * jamais une ligne.
 */
function Sorte({ fiche }: { fiche: Fiche }) {
  return (
    <>
      {fiche.sorte}
      {fiche.reference ? (
        <>
          {`${INSECABLE}· `}
          <span className="whitespace-nowrap normal-case">{fiche.reference}</span>
        </>
      ) : null}
    </>
  );
}

/**
 * L'aperçu d'une photo, sous sa légende à deux colonnes, comme sur le site : ce qu'on
 * voit à gauche, la nature de l'image à droite. Il suit la saisie : la légende, la
 * nature et le cadrage changent ici quand on change leur champ.
 *
 * Une seule photo à la fois, celle de la fiche ouverte, et seulement une fois le
 * script en route : la page écrite par le serveur ne porte aucune photo. Les règles
 * du site sur les photos (une par groupe et par page, deux pages au plus) valent pour
 * les pages publiques ; ici, c'est la réserve où on les range.
 */
function Apercu({ apercu, saisies, champs, montre }: { apercu: ApercuPhoto; saisies?: Saisies; champs: Champ[]; montre: boolean }) {
  const lire = (id: string) => {
    const champ = champs.find((c) => c.id === id);
    return champ ? valeurDe(champ, saisies) : "";
  };
  const adresse = (largeur: number) => asset(`/photos/${apercu.id}-${largeur}.webp`);
  // Le cadre fait 312 px au plus : les variantes jusqu'à 800 px suffisent, écran dense compris.
  const variantes = apercu.variantes.filter((l) => l <= 800);
  const cadrage = lire(apercu.champs.cadrage).trim();
  const legende = lire(apercu.champs.legende).trim().replace(/\.$/, "");
  return (
    <figure className="apercu">
      <span className="apercu-cadre">
        {montre ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={adresse(variantes[variantes.length - 1])}
            srcSet={variantes.map((l) => `${adresse(l)} ${l}w`).join(", ")}
            sizes="312px"
            width={apercu.largeur}
            height={apercu.hauteur}
            alt={lire(apercu.champs.alt)}
            decoding="async"
            // Un cadrage mal écrit ne casse rien : la photo revient au centre.
            style={/^\d{1,3}% \d{1,3}%$/.test(cadrage) ? { objectPosition: cadrage } : undefined}
          />
        ) : null}
      </span>
      <figcaption className="etiquette mt-3 flex items-baseline justify-between gap-x-6 text-doux">
        <span className="min-w-0 flex-1">{legende}</span>
        <span className="max-w-[46%] text-right">{lire(apercu.champs.nature)}</span>
      </figcaption>
    </figure>
  );
}

/** Une ligne de la fiche : la clé à gauche, le champ à droite, puis la source et la date du fait. */
function LigneChamp({
  idChamp,
  champ,
  valeur,
  avecSources,
  onSaisie,
}: {
  idChamp: string;
  champ: Champ;
  valeur: string;
  avecSources: boolean;
  onSaisie: (valeur: string) => void;
}) {
  const t = EDITEUR;
  const modifie = valeur !== champ.valeur;
  const idAide = champ.aide ? `${idChamp}-aide` : undefined;
  const idSource = avecSources && (champ.sources?.length || champ.date) ? `${idChamp}-source` : undefined;
  const decrit = [idAide, idSource].filter(Boolean).join(" ") || undefined;
  const commun = {
    id: idChamp,
    // Ce sont les contenus du site, pas les coordonnées de qui les saisit : le navigateur n'a rien à proposer.
    autoComplete: "off",
    "aria-describedby": decrit,
    "data-rempli": valeur.trim() ? "" : undefined,
    className: cx("saisie", champ.mesure && "mesure"),
  };

  return (
    <div className="champ-admin" data-modifie={modifie ? "" : undefined} data-sources={avecSources ? "" : undefined}>
      <div className="champ-admin-cle">
        {champ.forme === "fixe" ? (
          <p className="etiquette text-doux">{champ.cle}</p>
        ) : (
          <label htmlFor={idChamp} className="etiquette">
            {champ.cle}
          </label>
        )}
        {modifie ? (
          <p className="champ-admin-modifie etiquette text-accent">
            <Carre plein />
            <span>{typo(t.modifie)}</span>
          </p>
        ) : null}
      </div>

      <div className="champ-admin-valeur">
        {champ.forme === "fixe" ? (
          // Ce qui ne se modifie pas ici : écrit, sans ligne dessous.
          <p className={cx("champ-admin-fixe", champ.mesure && "mesure")}>
            {champ.lien ? (
              <Lien href={champ.lien} className={LIEN}>
                {champ.valeur}
              </Lien>
            ) : (
              champ.valeur
            )}
          </p>
        ) : champ.forme === "texte" ? (
          <textarea
            {...commun}
            className={cx(commun.className, "saisie-lignes")}
            rows={Math.min(10, Math.max(1, Math.ceil(valeur.length / 42)))}
            value={valeur}
            onChange={(e) => onSaisie(e.target.value)}
          />
        ) : champ.forme === "choix" ? (
          <select {...commun} className={cx(commun.className, "saisie-choix")} value={valeur} onChange={(e) => onSaisie(e.target.value)}>
            {(champ.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input {...commun} type="text" value={valeur} placeholder={typo(t.vide)} onChange={(e) => onSaisie(e.target.value)} />
        )}
        {champ.aide || (champ.lien && champ.forme !== "fixe") ? (
          <p id={idAide} className="mt-1.5 text-small text-doux">
            {champ.aide}
            {champ.aide && champ.lien && champ.forme !== "fixe" ? " " : null}
            {champ.lien && champ.forme !== "fixe" ? (
              <a href={champ.lien} className={cx(LIEN, "font-medium text-fort")}>
                {typo(t.ouvrir)}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>

      {idSource ? (
        <div id={idSource} className="champ-admin-source text-small text-doux">
          {/* Sous le champ, la clé « Source », ou « Date » pour une date sans publication ;
              au bureau large, la colonne a sa tête. */}
          <p className="champ-admin-source-cle etiquette">{typo(champ.sources?.length ? t.source : t.date)}</p>
          {champ.sources?.map((s) => (
            <p key={s.texte}>
              {s.href ? (
                <a href={s.href} className={LIEN}>
                  {typo(s.texte)}
                </a>
              ) : (
                typo(s.texte)
              )}
            </p>
          ))}
          {champ.date ? <p className="mesure-phrase text-fort">{champ.date}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Une fiche, en champs : son en-tête (ce qu'elle est, son nom, son état), ses groupes,
 * puis le geste. « Enregistrer » ne garde rien : un message le dit, celui de la
 * maquette. Ce qui a été saisi reste à l'écran, en mémoire, tant que la page est
 * ouverte ; « Rétablir » remet les valeurs du site.
 */
const FormulaireFiche = memo(function FormulaireFiche({
  fiche,
  saisies,
  dit,
  ouverte,
  plusieurs,
  vivant,
  prefixe,
  onSaisie,
  onEnregistrer,
  onRetablir,
}: {
  fiche: Fiche;
  saisies?: Saisies;
  /** Le message de la maquette est affiché. */
  dit: boolean;
  ouverte: boolean;
  plusieurs: boolean;
  vivant: boolean;
  prefixe: string;
  onSaisie: (fiche: string, champ: string, valeur: string) => void;
  onEnregistrer: (fiche: string) => void;
  onRetablir: (fiche: string) => void;
}) {
  const t = EDITEUR;
  const titreId = `${prefixe}-${fiche.id}-titre`;
  const nombre = modifies(fiche, saisies);
  // La colonne « Source et date » : seulement si la fiche a de quoi la remplir.
  const avecSources = fiche.sources;
  const enregistrer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEnregistrer(fiche.id);
  };

  return (
    // data-fermee, pas `hidden` : sans script, une règle simple peut rouvrir toutes les fiches.
    // data-sources : la légende de la colonne ne se lit que sous une fiche qui la montre.
    <section
      id={ancreFiche(fiche.id)}
      tabIndex={-1}
      data-fermee={ouverte ? undefined : ""}
      data-sources={avecSources ? "" : undefined}
      aria-labelledby={titreId}
      className="fiche-admin sur-calque"
    >
      {plusieurs ? (
        <a href={`#${ANCRE_LISTE}`} className={cx("fiche-admin-retour", LIEN)}>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[1.125rem] flex-none rotate-180">
            <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {typo(t.retour)}
        </a>
      ) : null}

      <div className="fiche-admin-tete">
        <div className="min-w-0">
          <p className="etiquette text-doux">
            <Sorte fiche={fiche} />
          </p>
          <h2 id={titreId} className={cx("mt-1.5 [overflow-wrap:anywhere]", T3)}>
            {fiche.nom}
          </h2>
        </div>
        <p className="admin-etat etiquette" data-etat={nombre ? "nouvelle" : "traitee"}>
          <Carre plein={nombre > 0} />
          <span>{typo(nombre ? `${nombre} ${nombre > 1 ? t.champsModifies : t.champModifie}` : t.conforme)}</span>
        </p>
      </div>

      {/* noValidate, pas d'action : rien ne part. Le script répond au bouton. */}
      <form noValidate onSubmit={enregistrer} aria-labelledby={titreId} className="fiche-admin-corps">
        {fiche.apercu ? (
          <Apercu apercu={fiche.apercu} saisies={saisies} champs={fiche.groupes.flatMap((g) => g.champs)} montre={ouverte && vivant} />
        ) : null}

        {/* Les têtes de colonne, au bureau, pour l'œil : chaque champ a son libellé. */}
        <div aria-hidden="true" className="fiche-admin-colonnes etiquette text-doux" data-sources={avecSources ? "" : undefined}>
          <span>{typo(t.colonnes.cle)}</span>
          <span>{typo(t.colonnes.valeur)}</span>
          {avecSources ? <span>{typo(t.colonnes.source)}</span> : null}
        </div>

        {fiche.groupes.map((g) => (
          <fieldset key={g.titre} className="groupe-admin">
            <legend className="etiquette text-fort">{g.titre}</legend>
            {g.champs.map((c) => (
              <LigneChamp
                key={c.id}
                idChamp={`${prefixe}-${fiche.id}-${c.id}`}
                champ={c}
                valeur={valeurDe(c, saisies)}
                avecSources={avecSources}
                onSaisie={(valeur) => onSaisie(fiche.id, c.id, valeur)}
              />
            ))}
          </fieldset>
        ))}

        <div className="fiche-admin-gestes">
          <button type="submit" disabled={!vivant} className={cx(BOUTON, BOUTON_PLEIN)}>
            {typo(t.enregistrer)}
          </button>
          {nombre > 0 ? (
            <button type="button" aria-label={t.retablirLong} onClick={() => onRetablir(fiche.id)} className={cx(BOUTON, BOUTON_CONTOUR)}>
              {typo(t.retablir)}
            </button>
          ) : null}
          {/* Le message de la maquette : annoncé à qui ne voit pas l'écran. */}
          <p role="status" className="fiche-admin-message" data-dit={dit ? "" : undefined}>
            {dit ? typo(t.message) : null}
          </p>
        </div>
      </form>
    </section>
  );
});

/**
 * L'éditeur d'une rubrique de contenus : la liste de ses
 * fiches, et la fiche ouverte, en champs (la clé à gauche, le champ à droite, la source
 * et la date du fait quand elles existent). Les valeurs sont celles du site. Une fiche
 * sans source ni date n'a pas de troisième colonne.
 *
 * Au bureau, la liste est à gauche et la fiche à droite. Sur téléphone, on voit la
 * liste, puis la fiche qu'on ouvre, avec un lien de retour.
 *
 * La fiche ouverte est celle de l'ancre de l'adresse (#fiche-lac-town) : chaque ligne
 * de la liste est un vrai lien. Le bouton Précédent revient à la fiche d'avant, une
 * adresse copiée rouvre la même fiche, et sans script les fiches se suivent, toutes
 * visibles, les liens y mènent.
 *
 * Rien ne s'enregistre : c'est une maquette. Ce qui est saisi reste en mémoire tant
 * que l'écran est ouvert.
 */
export function Editeur({ rubrique }: { rubrique: RubriqueAdmin }) {
  const t = EDITEUR;
  const prefixe = useId().replace(/[^a-zA-Z0-9]/g, "");
  const racine = useRef<HTMLDivElement>(null);
  const plusieurs = rubrique.fiches.length > 1;
  const vivant = useSyncExternalStore(
    sansAbonnement,
    () => true,
    () => false,
  );
  const ancre = useSyncExternalStore(abonnerAncre, lireAncre, sansAncre);
  const [saisies, setSaisies] = useState<Record<string, Saisies>>({});
  const [dits, setDits] = useState<Record<string, boolean>>({});

  const demandee = rubrique.fiches.find((f) => ancre === `#${ancreFiche(f.id)}`);
  const ouverte = demandee ?? rubrique.fiches[0];
  /** Sur téléphone : la liste, ou la fiche qu'on a demandée. */
  const vue = demandee || !plusieurs ? "fiche" : "liste";

  // L'ancre change (une fiche demandée, ou le retour à la liste) : le navigateur n'a pas
  // pu y aller, la cible était encore cachée. On l'y mène, et on lui donne le focus.
  useEffect(() => {
    if (!ancre) return;
    let cible: HTMLElement | null = null;
    try {
      cible = document.getElementById(decodeURIComponent(ancre.slice(1)));
    } catch {
      return;
    }
    if (!cible || !racine.current?.contains(cible)) return;
    const haut = cible.getBoundingClientRect().top;
    const marge = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    // Déjà en vue, dans le haut de l'écran : on ne bouge pas la page.
    if (haut < marge || haut > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + haut - marge });
    cible.focus({ preventScroll: true });
    // Au bureau, la liste défile dans sa colonne : la ligne de la fiche ouverte y revient
    // en vue (une adresse copiée peut ouvrir la vingtième). On ne fait défiler que la
    // liste, pas la page : scrollIntoView déplacerait aussi l'écran.
    const liste = racine.current.querySelector<HTMLElement>(".editeur-liste");
    const ligne = liste?.querySelector<HTMLElement>(".editeur-item[aria-current]");
    if (liste && ligne && liste.scrollHeight > liste.clientHeight) {
      const cadre = liste.getBoundingClientRect();
      const boite = ligne.getBoundingClientRect();
      // Le bas de ce qu'on voit de la liste : le sien, ou celui de l'écran.
      const bas = Math.min(cadre.bottom, window.innerHeight);
      if (boite.top < cadre.top) liste.scrollTop -= cadre.top - boite.top;
      else if (boite.bottom > bas) liste.scrollTop += boite.bottom - bas;
    }
  }, [ancre]);

  const saisir = useCallback((fiche: string, champ: string, valeur: string) => {
    setSaisies((avant) => ({ ...avant, [fiche]: { ...avant[fiche], [champ]: valeur } }));
    // On reprend la saisie : le message d'avant ne vaut plus.
    setDits((avant) => (avant[fiche] ? { ...avant, [fiche]: false } : avant));
  }, []);
  const enregistrer = useCallback((fiche: string) => setDits((avant) => ({ ...avant, [fiche]: true })), []);
  const retablir = useCallback((fiche: string) => {
    setSaisies((avant) => {
      const reste = { ...avant };
      delete reste[fiche];
      return reste;
    });
    setDits((avant) => (avant[fiche] ? { ...avant, [fiche]: false } : avant));
  }, []);

  return (
    <>
      {/* Sans script, rien n'ouvre ni ne ferme une fiche : elles se suivent, toutes
          visibles. Hors de la grille de l'éditeur : la balise y prendrait une case. */}
      <noscript>
        <style>{`.editeur .editeur-fiches{display:block}.editeur .fiche-admin[data-fermee]{display:block}.editeur .fiche-admin{margin-bottom:2.5rem}.editeur .fiche-admin-retour{display:none}.editeur .editeur-legende{display:block}`}</style>
      </noscript>
      <div ref={racine} className="editeur" data-vue={vue} data-seule={plusieurs ? undefined : ""}>
        {plusieurs ? (
          <nav id={ANCRE_LISTE} tabIndex={-1} aria-label={t.liste} className="editeur-liste">
            {/* Le compte des fiches, en étiquette. Pas de borne : la liste est le seul bloc, il n'y a rien à numéroter. */}
            <p className="editeur-compte etiquette text-doux">{typo(`${rubrique.fiches.length} ${t.quantite}`)}</p>
            <ol>
              {rubrique.fiches.map((f) => {
                const nombre = modifies(f, saisies[f.id]);
                return (
                  <li key={f.id}>
                    <a href={`#${ancreFiche(f.id)}`} aria-current={f.id === ouverte.id ? "true" : undefined} className="editeur-item">
                      <span aria-hidden="true" className="editeur-item-borne" />
                      <span className="min-w-0 flex-1">
                        <span className="editeur-item-nom">
                          <span>{f.nom}</span>
                          {/* Une fiche modifiée le dit dans la liste : un carré plein, après son nom. */}
                          {nombre > 0 ? (
                            <span className="editeur-item-modifie">
                              <Carre plein />
                              <span className="sr-only">{typo(`${nombre} ${nombre > 1 ? t.champsModifies : t.champModifie}`)}</span>
                            </span>
                          ) : null}
                        </span>
                        <span className="etiquette text-doux">
                          <Sorte fiche={f} />
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <div className="editeur-fiches">
          {rubrique.fiches.map((f) => (
            <FormulaireFiche
              key={f.id}
              fiche={f}
              saisies={saisies[f.id]}
              dit={Boolean(dits[f.id])}
              ouverte={f.id === ouverte.id}
              plusieurs={plusieurs}
              vivant={vivant}
              prefixe={prefixe}
              onSaisie={saisir}
              onEnregistrer={enregistrer}
              onRetablir={retablir}
            />
          ))}
          {/* La légende de la colonne « Source et date ». La feuille de style ne la montre
              que sous une fiche ouverte qui porte cette colonne (admin.css). */}
          {rubrique.sources ? <p className="editeur-legende text-small text-doux">{typo(t.legendeSources)}</p> : null}
        </div>
      </div>
    </>
  );
}
