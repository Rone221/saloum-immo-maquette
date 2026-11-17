"use client";

import { useId, useRef, useState } from "react";
import { LigneCartouche } from "@/components/ligne-cartouche";
import { TextLink } from "@/components/text-link";
import type { EtatDemande } from "@/content/demo/demandes";
import { DEMANDES, MENTIONS } from "@/content/demo/textes";
import { cx } from "@/lib/base";
import { SUJETS } from "@/lib/demandes";
import { typo } from "@/lib/format";
import { useDemandes, type DemandeAdmin } from "./demandes-contexte";
import { BOUTON, BOUTON_CONTOUR, BOUTON_PLEIN, jourEtHeure } from "./outils";
import { Carre, NoteDemo, TeteBloc } from "./pieces";

type Filtre = "toutes" | EtatDemande;

/** Le texte d'une demande d'exemple passe par typo() ; celui du visiteur reste tel qu'il l'a écrit. */
const ecrit = (d: DemandeAdmin, texte: string) => (d.origine === "exemple" ? typo(texte) : texte);

/** La fiche d'une demande ouverte : ce qui a été saisi, en lignes de cartouche, puis le geste. */
function FicheDemande({ d, onEtat }: { d: DemandeAdmin; onEtat: (etat: EtatDemande) => void }) {
  const t = DEMANDES.fiche;
  const { vivant } = useDemandes();
  const { jour, heure } = jourEtHeure(d.date);
  return (
    <div className="demande-fiche sur-calque">
      <dl className="m-0 border-t border-fort">
        <LigneCartouche empilee cle={t.recue}>
          <span className="mesure text-fort">{typo(`${jour}, ${heure}`)}</span>
        </LigneCartouche>
        <LigneCartouche empilee cle={t.nom}>
          {ecrit(d, d.nom)}
        </LigneCartouche>
        <LigneCartouche empilee cle={t.telephone}>
          {d.origine === "navigateur" ? (
            // Le numéro qu'un visiteur a laissé : un lien pour le rappeler.
            <a
              href={`tel:${d.telephone.replace(/[^\d+]/g, "")}`}
              className="mesure text-fort underline decoration-1 underline-offset-4 transition-surface hover:text-accent hover:decoration-2"
            >
              {d.telephone}
            </a>
          ) : (
            <span className="mesure text-fort">{typo(d.telephone)}</span>
          )}
        </LigneCartouche>
        <LigneCartouche empilee cle={t.objet}>
          {typo(SUJETS[d.sujet])}
        </LigneCartouche>
        <LigneCartouche empilee cle={t.message}>
          {d.message ? (
            <span className="whitespace-pre-line">{ecrit(d, d.message)}</span>
          ) : (
            <span className="text-doux">{typo(DEMANDES.sansMessage)}</span>
          )}
        </LigneCartouche>
        <LigneCartouche empilee cle={t.origine}>
          <span className="text-doux">{typo(t.origines[d.origine])}</span>
        </LigneCartouche>
      </dl>
      <div className="demande-gestes">
        {d.etat === "nouvelle" ? (
          <button type="button" disabled={!vivant} onClick={() => onEtat("traitee")} className={cx(BOUTON, BOUTON_PLEIN)}>
            {typo(t.traiter)}
          </button>
        ) : (
          <button type="button" disabled={!vivant} onClick={() => onEtat("nouvelle")} className={cx(BOUTON, BOUTON_CONTOUR)}>
            {typo(t.rouvrir)}
          </button>
        )}
        <p className="text-small text-doux">{typo(t.memoire)}</p>
      </div>
    </div>
  );
}

/**
 * Le registre des demandes : une ligne par demande, la date en marge, le nom, l'objet,
 * le début du message, l'état avec son carré (plein, en latérite : nouvelle ; en
 * contour : traitée). Une ligne s'ouvre sur sa fiche, où on la marque traitée.
 *
 * Deux sources, dites sur chaque ligne : les demandes d'exemple, inventées, et celles
 * envoyées depuis la fiche de la page Contact dans ce navigateur. Ces dernières
 * s'effacent d'un geste, au pied du registre : après quelques essais, il ne garde pas
 * le nom et le numéro de qui a essayé.
 *
 * Chaque ligne est un <details> : elle s'ouvre au clic, au clavier, et sans script.
 * Une seule à la fois (même nom). L'état ne s'enregistre nulle part : il tient tant
 * que l'espace client reste ouvert (components/admin/demandes-contexte.tsx).
 */
export function RegistreDemandes() {
  const t = DEMANDES;
  const id = useId();
  const { demandes, nouvelles, vivant, changerEtat, effacerNavigateur } = useDemandes();
  const [filtre, setFiltre] = useState<Filtre>("toutes");
  /** La demande dont on vient de changer l'état : elle reste à l'écran, même hors du filtre, tant qu'on n'en change pas. */
  const [gardee, setGardee] = useState<string | null>(null);
  const [annonce, setAnnonce] = useState("");
  /** Le pied du registre : il reste quand le bouton « Effacer » part. */
  const pied = useRef<HTMLDivElement>(null);

  const comptes: Record<Filtre, number> = { toutes: demandes.length, nouvelle: nouvelles, traitee: demandes.length - nouvelles };
  const filtres: Array<{ cle: Filtre; libelle: string }> = [
    { cle: "toutes", libelle: t.filtres.toutes },
    { cle: "nouvelle", libelle: t.filtres.nouvelles },
    { cle: "traitee", libelle: t.filtres.traitees },
  ];
  const liste = demandes.filter((d) => filtre === "toutes" || d.etat === filtre || d.id === gardee);
  /** Combien de demandes viennent de ce navigateur. */
  const duNavigateur = demandes.filter((d) => d.origine === "navigateur").length;

  const effacer = () => {
    setAnnonce(duNavigateur > 1 ? t.duNavigateur.effacees : t.duNavigateur.effacee);
    setGardee(null);
    effacerNavigateur();
    // Le bouton part avec les demandes. Le focus se pose sur le pied du registre, qui
    // reste : sans cela, au clavier, il repartirait du haut de la page.
    pied.current?.focus();
  };

  return (
    <section aria-labelledby="b-registre" className="admin-bloc">
      <TeteBloc
        numero="01"
        nom={t.registre}
        quantite={`${demandes.length} demandes · ${nouvelles} ${nouvelles > 1 ? t.filtres.nouvelles.toLowerCase() : t.etats.nouvelle.toLowerCase()}`}
        id="b-registre"
      />

      <fieldset className="segments mt-6" disabled={!vivant}>
        <legend className="sr-only">{typo(t.filtres.legende)}</legend>
        <div className="segments-rang">
          {filtres.map((f) => (
            <label key={f.cle} className="segment">
              <input
                type="radio"
                name={`${id}-filtre`}
                value={f.cle}
                checked={filtre === f.cle}
                onChange={() => {
                  setFiltre(f.cle);
                  setGardee(null);
                }}
              />
              <span>
                {typo(f.libelle)} <span className="mesure-phrase segment-compte">{comptes[f.cle]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Les têtes de colonne, pour l'œil : chaque ligne dit déjà tout à qui l'écoute. */}
      <div aria-hidden="true" className="registre-tete etiquette text-doux">
        <span>{typo(t.colonnes.date)}</span>
        <span>{typo(t.colonnes.nom)}</span>
        <span>{typo(t.colonnes.objet)}</span>
        <span>{typo(t.colonnes.message)}</span>
        <span>{typo(t.colonnes.etat)}</span>
      </div>

      {liste.length ? (
        <ol className="registre">
          {liste.map((d) => {
            const { jour, heure } = jourEtHeure(d.date);
            return (
              <li key={d.id}>
                <details name={`${id}-demande`} className="demande" data-etat={d.etat}>
                  <summary className="demande-ligne">
                    <span className="demande-date">
                      <span className="mesure text-fort">{typo(jour)}</span>
                      <span className="text-small text-doux">{heure}</span>
                    </span>
                    <span className="demande-nom">
                      <span className="font-semibold text-fort [overflow-wrap:anywhere]">{ecrit(d, d.nom)}</span>
                      <span className={cx("etiquette", d.origine === "navigateur" ? "text-accent" : "text-doux")}>
                        {typo(t.origines[d.origine])}
                      </span>
                    </span>
                    <span className="demande-objet">{typo(SUJETS[d.sujet])}</span>
                    <span className="demande-extrait text-doux">{d.message ? ecrit(d, d.message) : typo(t.sansMessage)}</span>
                    <span className="admin-etat demande-etat etiquette" data-etat={d.etat}>
                      <Carre plein={d.etat === "nouvelle"} />
                      <span>{typo(t.etats[d.etat])}</span>
                    </span>
                    <span aria-hidden="true" className="demande-chevron" />
                  </summary>
                  <FicheDemande
                    d={d}
                    onEtat={(etat) => {
                      changerEtat(d.id, etat);
                      setGardee(d.id);
                      setAnnonce(etat === "traitee" ? t.fiche.traitee : t.fiche.rouverte);
                    }}
                  />
                </details>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="registre-vide">{typo(t.vide[filtre])}</p>
      )}

      <p role="status" className="sr-only">
        {typo(annonce)}
      </p>

      <NoteDemo className="mt-5">{MENTIONS.demandes}</NoteDemo>
      {/* Le pied du registre, dans son cadre en pointillé : ce que ce navigateur garde.
          Rien encore : comment faire arriver une demande. Sinon : leur compte, et le
          geste qui les efface. tabIndex : il reçoit le focus quand le bouton part. */}
      <div ref={pied} tabIndex={-1} className="registre-essai">
        {duNavigateur ? (
          <>
            <p id={`${id}-navigateur`}>
              {typo(duNavigateur > 1 ? t.duNavigateur.plusieurs.replace("{n}", String(duNavigateur)) : t.duNavigateur.une)}
            </p>
            <button type="button" onClick={effacer} aria-describedby={`${id}-navigateur`} className={cx(BOUTON, BOUTON_CONTOUR)}>
              {typo(duNavigateur > 1 ? t.duNavigateur.effacerPlusieurs : t.duNavigateur.effacerUne)}
            </button>
          </>
        ) : (
          <>
            <p>{typo(t.essai)}</p>
            <TextLink href="/contact/#demande">{t.lienFiche}</TextLink>
          </>
        )}
      </div>
    </section>
  );
}
