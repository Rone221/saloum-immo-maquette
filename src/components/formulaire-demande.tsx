"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { cx } from "@/lib/base";
import { BOUTON_CONTOUR, BOUTON_FORME, BOUTON_PLEIN, BOUTON_VRAI } from "@/lib/classes";
// lib/demandes.ts : la maquette n'a ni serveur ni base. Une demande reste dans le
// navigateur ; l'espace client de démonstration la relit de là.
import { ajouterDemande, lireDemandes, SUJETS, type Demande, type SujetDemande } from "@/lib/demandes";
import { dateLongue, typo } from "@/lib/format";
import { LigneCartouche } from "./ligne-cartouche";
import { Fleche } from "./text-link";
import "./formulaire-demande.css";

/**
 * Les textes de la fiche, passés par la page : content/pages/contact.ts reste côté
 * serveur, avec ses sources (ce composant part au navigateur).
 */
export type TextesFormulaire = {
  /** Le nom de la fiche, en tête, et son état avant l'envoi. */
  fiche: string;
  aRemplir: string;
  /** Les libellés des quatre champs. */
  nom: string;
  telephone: string;
  sujet: string;
  message: string;
  /** Après le libellé d'un champ qu'on peut laisser vide. */
  facultatif: string;
  /** Sous le libellé du message : de quoi le remplir. */
  aideMessage: string;
  bouton: string;
  /** Sans script, la fiche ne peut rien garder : où écrire à la place. */
  sansScript: string;
  erreurs: {
    nom: string;
    telephone: string;
    telephoneCourt: string;
    sujet: string;
    /** Annoncé aux lecteurs d'écran : « {n} » devient le nombre de champs à corriger. */
    resumeUn: string;
    resumePlusieurs: string;
  };
  recepisse: {
    titre: string;
    /** L'état de la fiche une fois gardée dans le navigateur, puis sans stockage. */
    gardee: string;
    remplie: string;
    /** La clé de la date d'envoi. */
    envoi: string;
    /** La valeur du message quand il est vide. */
    sansMessage: string;
    /** La mention de la maquette : exigée, mot pour mot. */
    mention: string;
    /** Où la demande est gardée : la phrase, puis le lien vers l'espace client. */
    suite: string;
    lienAdmin: string;
    autre: string;
  };
};

type Champ = "nom" | "telephone" | "sujet";
type Saisie = { nom: string; telephone: string; sujet: SujetDemande | ""; message: string };
type Erreurs = Partial<Record<Champ, string>>;

const VIDE: Saisie = { nom: "", telephone: "", sujet: "", message: "" };
/** Les trois choix, dans l'ordre de lib/demandes.ts. */
const CHOIX = Object.keys(SUJETS) as SujetDemande[];
/** Espace insécable : « 14 h 05 » ne se coupe pas. */
const INSECABLE = " ";

/** Le bouton du site (lib/classes.ts), ici sur un vrai <button>, à la taille de components/boutons.tsx. */
const BOUTON = cx(BOUTON_FORME, BOUTON_VRAI, "min-h-13 w-full px-6 py-2.5 transition-bouton tab:w-auto");
const PLEIN = BOUTON_PLEIN;
const CONTOUR = BOUTON_CONTOUR;

const sansAbonnement = () => () => {};

/**
 * La date d'envoi, en lettres, à l'heure du visiteur : « 17 novembre 2026, 14 h 05 ».
 * C'est la vraie date : celle que lib/demandes.ts a posée sur la demande.
 */
function dateEnvoi(iso: string): string {
  const d = new Date(iso);
  const deux = (n: number) => String(n).padStart(2, "0");
  const jour = `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
  return `${dateLongue(jour)}, ${d.getHours()}${INSECABLE}h${INSECABLE}${deux(d.getMinutes())}`;
}

/** Ce que la saisie a de faux, champ par champ. Rien : la fiche peut partir. */
function verifier(s: Saisie, e: TextesFormulaire["erreurs"]): Erreurs {
  const fautes: Erreurs = {};
  if (!s.nom.trim()) fautes.nom = e.nom;
  const telephone = s.telephone.trim();
  // Un numéro d'ici fait neuf chiffres, un numéro de l'étranger davantage : huit au
  // moins, et rien d'autre que des chiffres, des espaces et « + ( ) . - ».
  if (!telephone) fautes.telephone = e.telephone;
  else if (telephone.replace(/\D/g, "").length < 8 || /[^\d\s+().-]/.test(telephone)) fautes.telephone = e.telephoneCourt;
  if (!s.sujet) fautes.sujet = e.sujet;
  return fautes;
}

/**
 * Le formulaire de demande (direction v4, section 7) : une fiche à champs sur ligne
 * pointillée. Nom, Téléphone ou WhatsApp, « Vous cherchez » en trois choix, Message.
 * Les conventions du plan y servent : la ligne d'un champ est en pointillé tant qu'il
 * est vide (ce qui n'est pas sûr), pleine une fois rempli (ce qui est acquis).
 *
 * C'est une maquette : rien ne part sur le réseau. À l'envoi, la demande est gardée
 * dans le navigateur (lib/demandes.ts) et la fiche devient son récépissé : la vraie
 * date d'envoi, ce qui a été saisi, et la mention « Maquette : cette demande n'est pas
 * transmise. »
 *
 * Accessibilité : chaque champ a son libellé ; une erreur est écrite sous son champ,
 * en clair, liée à lui (aria-describedby) ; à l'envoi, le premier champ en faute prend
 * le focus ; après l'envoi, le titre du récépissé le prend. Les trois choix sont de
 * vrais boutons radio : les flèches du clavier passent de l'un à l'autre.
 *
 * Sans script, la fiche ne peut rien garder : son bouton reste éteint, et une phrase
 * dit où écrire à la place. Un formulaire sans script partirait dans l'adresse de la
 * page, avec le nom et le numéro dedans.
 *
 * À poser sur n'importe quelle surface : la fiche est une feuille de calque, elle a
 * ses propres couleurs.
 */
export function FormulaireDemande({
  textes,
  lienAdmin,
  className,
}: {
  textes: TextesFormulaire;
  /** L'adresse de l'espace client de démonstration, où la demande se relit. */
  lienAdmin: string;
  className?: string;
}) {
  const id = useId();
  const [saisie, setSaisie] = useState<Saisie>(VIDE);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  /** La demande envoyée, et si le navigateur a bien voulu la garder. */
  const [recu, setRecu] = useState<{ demande: Demande; gardee: boolean } | null>(null);
  /** Le compte des fautes, annoncé aux lecteurs d'écran après un envoi refusé. */
  const [annonce, setAnnonce] = useState("");
  // Le script tourne : le bouton s'allume. Sur le serveur et sans script, il reste éteint.
  const vivant = useSyncExternalStore(
    sansAbonnement,
    () => true,
    () => false,
  );

  const champNom = useRef<HTMLInputElement>(null);
  const champTelephone = useRef<HTMLInputElement>(null);
  const premierChoix = useRef<HTMLInputElement>(null);
  const titreRecu = useRef<HTMLHeadingElement>(null);
  /** Après « une autre fiche » : le focus revient au premier champ. */
  const reprise = useRef(false);

  // Le récépissé arrive : son titre prend le focus, un lecteur d'écran le lit. La
  // fiche vide revient : le premier champ le prend.
  useEffect(() => {
    if (recu) titreRecu.current?.focus();
    else if (reprise.current) {
      reprise.current = false;
      champNom.current?.focus();
    }
  }, [recu]);

  /** Une valeur change : son erreur s'efface, on ne gronde pas quelqu'un qui corrige. */
  const changer = <C extends keyof Saisie>(champ: C, valeur: Saisie[C]) => {
    setSaisie((s) => ({ ...s, [champ]: valeur }));
    const cle: keyof Saisie = champ;
    if (cle === "message" || !erreurs[cle]) return;
    setErreurs((avant) => {
      const reste = { ...avant };
      delete reste[cle];
      return reste;
    });
  };

  const envoyer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fautes = verifier(saisie, textes.erreurs);
    setErreurs(fautes);
    const nombre = Object.keys(fautes).length;
    if (nombre) {
      setAnnonce(nombre === 1 ? textes.erreurs.resumeUn : textes.erreurs.resumePlusieurs.replace("{n}", String(nombre)));
      // Le premier champ en faute, dans l'ordre de la fiche.
      (fautes.nom ? champNom : fautes.telephone ? champTelephone : premierChoix).current?.focus();
      return;
    }
    setAnnonce("");
    const demande = ajouterDemande({
      nom: saisie.nom.trim(),
      telephone: saisie.telephone.trim(),
      sujet: saisie.sujet as SujetDemande,
      message: saisie.message.trim(),
    });
    // Stockage refusé (navigation privée) : la demande est rendue, mais pas gardée.
    setRecu({ demande, gardee: lireDemandes().some((d) => d.id === demande.id) });
  };

  const recommencer = () => {
    reprise.current = true;
    setSaisie(VIDE);
    setErreurs({});
    setRecu(null);
  };

  const idErreur = (champ: Champ) => `${id}-${champ}-erreur`;

  return (
    <div className={cx("fiche sur-calque", className)}>
      {/* L'en-tête de la fiche : son nom, et son état avec son carré (en contour : à
          remplir ; plein : c'est fait). Le mot dit tout, le carré n'est que pour l'œil. */}
      <div className="fiche-tete">
        <p id={`${id}-fiche`} className="etiquette text-fort">
          {typo(textes.fiche)}
        </p>
        <p className="fiche-etat etiquette text-fort">
          <span aria-hidden="true" className="fiche-carre" data-plein={recu ? "" : undefined} />
          <span>{typo(recu ? (recu.gardee ? textes.recepisse.gardee : textes.recepisse.remplie) : textes.aRemplir)}</span>
        </p>
      </div>

      {recu ? (
        <div className="fiche-corps">
          <h3 ref={titreRecu} tabIndex={-1} className="titre text-h3 outline-none">
            {typo(textes.recepisse.titre)}
          </h3>
          {/* Ce qui a été saisi, en lignes de cartouche. Sur téléphone, la clé passe
              au-dessus de la valeur : la date et le message gardent toute la largeur. */}
          <dl className="m-0 mt-5 border-t border-fort">
            <LigneCartouche empilee cle={textes.recepisse.envoi}>
              <span className="mesure text-fort">{typo(dateEnvoi(recu.demande.date))}</span>
            </LigneCartouche>
            <LigneCartouche empilee cle={textes.nom}>
              {recu.demande.nom}
            </LigneCartouche>
            <LigneCartouche empilee cle={textes.telephone}>
              <span className="mesure text-fort">{recu.demande.telephone}</span>
            </LigneCartouche>
            <LigneCartouche empilee cle={textes.sujet}>
              {typo(SUJETS[recu.demande.sujet])}
            </LigneCartouche>
            <LigneCartouche empilee cle={textes.message}>
              {recu.demande.message ? (
                // Le message du visiteur, avec ses retours à la ligne et la typographie
                // du site (« 150 m² » ne se coupe pas).
                <span className="whitespace-pre-line">{typo(recu.demande.message)}</span>
              ) : (
                <span className="text-doux">{typo(textes.recepisse.sansMessage)}</span>
              )}
            </LigneCartouche>
          </dl>

          {/* La mention de la maquette, dans un cadre en pointillé : ce qui n'est pas sûr.
              Ici, ce qui n'est pas parti. */}
          <div className="fiche-mention">
            <p className="font-semibold text-fort">{typo(textes.recepisse.mention)}</p>
            {recu.gardee ? (
              <p className="mt-1 text-small text-doux">
                {typo(textes.recepisse.suite)}{" "}
                <a
                  href={lienAdmin}
                  className="font-medium text-fort underline decoration-1 underline-offset-4 transition-surface hover:text-accent hover:decoration-2"
                >
                  {typo(textes.recepisse.lienAdmin)}
                </a>
              </p>
            ) : null}
          </div>

          <button type="button" onClick={recommencer} className={cx(BOUTON, CONTOUR, "mt-6")}>
            {typo(textes.recepisse.autre)}
          </button>
        </div>
      ) : (
        // noValidate : les erreurs sont les nôtres, en français, sous leur champ. Pas
        // de `action` : rien ne part, le script garde la demande.
        <form className="fiche-corps" noValidate onSubmit={envoyer} aria-labelledby={`${id}-fiche`}>
          <div className="fiche-champs">
            <div className="champ">
              <label htmlFor={`${id}-nom`} className="champ-libelle etiquette">
                {typo(textes.nom)}
              </label>
              <input
                ref={champNom}
                id={`${id}-nom`}
                name="nom"
                type="text"
                autoComplete="name"
                required
                maxLength={80}
                value={saisie.nom}
                onChange={(e) => changer("nom", e.target.value)}
                data-rempli={saisie.nom.trim() ? "" : undefined}
                aria-invalid={erreurs.nom ? true : undefined}
                aria-describedby={erreurs.nom ? idErreur("nom") : undefined}
                className="champ-saisie"
              />
              {erreurs.nom ? (
                <p id={idErreur("nom")} className="champ-erreur">
                  {typo(erreurs.nom)}
                </p>
              ) : null}
            </div>

            <div className="champ">
              <label htmlFor={`${id}-telephone`} className="champ-libelle etiquette">
                {typo(textes.telephone)}
              </label>
              {/* Un numéro se compose dans la voix des mesures, ici comme partout. */}
              <input
                ref={champTelephone}
                id={`${id}-telephone`}
                name="telephone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                maxLength={30}
                value={saisie.telephone}
                onChange={(e) => changer("telephone", e.target.value)}
                data-rempli={saisie.telephone.trim() ? "" : undefined}
                aria-invalid={erreurs.telephone ? true : undefined}
                aria-describedby={erreurs.telephone ? idErreur("telephone") : undefined}
                className="champ-saisie mesure"
              />
              {erreurs.telephone ? (
                <p id={idErreur("telephone")} className="champ-erreur">
                  {typo(erreurs.telephone)}
                </p>
              ) : null}
            </div>

            {/* « Vous cherchez » : trois cases à cocher, une seule à la fois. Un groupe de
                boutons radio, nommé par son libellé : c'est lui qui porte l'erreur. */}
            <div className="champ fiche-large">
              <p id={`${id}-sujet`} className="champ-libelle etiquette">
                {typo(textes.sujet)}
              </p>
              <div
                role="radiogroup"
                aria-labelledby={`${id}-sujet`}
                aria-required="true"
                aria-invalid={erreurs.sujet ? true : undefined}
                aria-describedby={erreurs.sujet ? idErreur("sujet") : undefined}
                className="choix"
              >
                {CHOIX.map((cle, i) => (
                  <label key={cle} className="choix-case">
                    <input
                      ref={i === 0 ? premierChoix : undefined}
                      type="radio"
                      name="sujet"
                      value={cle}
                      required
                      checked={saisie.sujet === cle}
                      onChange={() => changer("sujet", cle)}
                      className="choix-radio"
                    />
                    <span aria-hidden="true" className="choix-marque" />
                    <span className="choix-texte">{typo(SUJETS[cle])}</span>
                    <span aria-hidden="true" className="choix-ligne" />
                  </label>
                ))}
              </div>
              {erreurs.sujet ? (
                <p id={idErreur("sujet")} className="champ-erreur">
                  {typo(erreurs.sujet)}
                </p>
              ) : null}
            </div>

            <div className="champ fiche-large">
              <label htmlFor={`${id}-message`} className="champ-libelle etiquette">
                {typo(textes.message)} <span className="champ-facultatif">{typo(`(${textes.facultatif})`)}</span>
              </label>
              <p id={`${id}-message-aide`} className="mt-1 text-small text-doux">
                {typo(textes.aideMessage)}
              </p>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={4}
                maxLength={600}
                value={saisie.message}
                onChange={(e) => changer("message", e.target.value)}
                data-rempli={saisie.message.trim() ? "" : undefined}
                aria-describedby={`${id}-message-aide`}
                className="champ-saisie champ-lignes"
              />
            </div>
          </div>

          <div className="fiche-envoi">
            <button type="submit" disabled={!vivant} data-aimant="" className={cx(BOUTON, PLEIN)}>
              {typo(textes.bouton)}
              <Fleche />
            </button>
            <noscript>
              <p className="text-small text-doux">{typo(textes.sansScript)}</p>
            </noscript>
          </div>
          {/* Le compte des fautes, pour qui ne voit pas la fiche. */}
          <p role="status" className="sr-only">
            {annonce}
          </p>
        </form>
      )}
    </div>
  );
}
