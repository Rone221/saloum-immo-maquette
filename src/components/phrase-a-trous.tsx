"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
// Le type seulement : le fichier de contenu, avec ses sources, reste côté serveur. La
// page passe la phrase découpée, le nom du formulaire et le bouton.
import type { PhraseATrous as Phrase } from "@/content/pages/amenager";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import "./phrase-a-trous.css";

/** Un trou du message prêt : ce qui reste écrit quand un champ est vide. */
const TROU = "…";

/** Espace insécable, entre le second champ et son unité quand le message est écrit en entier. */
const INSECABLE = " ";

/**
 * La surface porte déjà son unité (« 3 hectares », « 2 ha », « 500 m2 ») : la nôtre
 * s'efface, à l'écran comme dans le message. Le bloc parle de terrains et d'hectares.
 */
const UNITE_SAISIE = /(^|[^a-zà-ÿ])ha($|[^a-zà-ÿ])|hectare|m2|m²|m[eè]tre/i;

/** Rien à écouter : seulement savoir si le script tourne (non côté serveur, oui une fois hydraté). */
const abonner = () => () => {};
const dansLeNavigateur = () => true;
const surLeServeur = () => false;

/** Une saisie, sans ses blancs en trop. */
const propre = (valeur: string) => valeur.replace(/\s+/g, " ").trim();

/**
 * Un trou de la phrase : le champ, posé sur sa cote, et sa clé dessous (son <label>).
 * Le champ prend la largeur de ce qu'on y écrit : la boîte porte la saisie en attribut,
 * la feuille de style en tire un gabarit invisible, dans la même lettre, qui donne sa
 * largeur à la boîte. La ponctuation qui suit reste donc collée au dernier mot.
 */
function Trou({
  cle,
  court = false,
  ...champ
}: {
  /** La clé du champ, écrite sous la cote. */
  cle: string;
  /** Un champ court (la surface) : son blanc est plus étroit. */
  court?: boolean;
} & ComponentPropsWithRef<"input">) {
  return (
    <span className={cx("pat-trou", court && "pat-trou-court")}>
      <span className="pat-boite" data-saisie={champ.value}>
        <input
          className="pat-champ"
          type="text"
          // Une espace : le champ vide se reconnaît en CSS (:placeholder-shown).
          placeholder=" "
          // La largeur vient de la boîte, pas des vingt caractères d'un champ par défaut.
          size={1}
          autoComplete="off"
          spellCheck={false}
          {...champ}
        />
        <span aria-hidden="true" className="pat-cote">
          <span className="pat-trait" />
        </span>
      </span>
      <label htmlFor={champ.id} className="pat-cle etiquette">
        {typo(cle)}
      </label>
    </span>
  );
}

/**
 * La phrase à trous (direction v4, section 6, « Aménager ») : « J'ai un terrain à …,
 * d'environ … m². » Le message prêt des propriétaires, écrit en grand, et ses deux
 * trous devenus deux champs. Chaque champ est posé sur une cote : en pointillé tant
 * qu'il est vide (sur un plan, ce qui n'est pas sûr), tirée en trait plein dès qu'on y
 * écrit (ce qui est acquis). Sa clé est écrite dessous, en étiquette : c'est son
 * <label>. La phrase se compose pendant qu'on écrit : les champs prennent la largeur
 * des mots, la virgule et le point les suivent.
 *
 * Deux formes. En affiche (par défaut, la page Aménager) : la phrase seule, sans la
 * salutation, dans la lettre des titres, coupée entre ses deux moitiés. En entier
 * (`entier`, la page Contact, parmi les autres messages prêts) : le message de sa
 * salutation à sa dernière phrase, entre guillemets, dans le corps et la lettre du
 * texte où on le pose, coupé au mot. Les champs, leurs cotes et le bouton sont les
 * mêmes.
 *
 * Le bouton est celui de toutes les pages, rendu côté serveur avec le message prêt
 * (`children`). Le script n'y change qu'une chose : l'adresse, qui emporte la phrase
 * remplie. Sans saisie, le message prêt habituel part tel quel. Un champ vide garde
 * ses points de suspension : il se complète dans WhatsApp, comme avant.
 *
 * Sans script, la phrase se lit avec ses deux blancs, les champs ne prennent pas de
 * saisie (elle n'irait nulle part) et le bouton envoie le message prêt.
 */
export function PhraseATrous({
  phrase,
  nom,
  entier = false,
  children,
  className,
  classePhrase,
  classeAction,
}: {
  /** Le message prêt, découpé à ses trous (content/pages/amenager.ts). */
  phrase: Phrase;
  /** Le nom du formulaire, pour les lecteurs d'écran. */
  nom: string;
  /** Le message entier, entre guillemets, dans le fil d'un texte. Sinon : la phrase seule, en affiche. */
  entier?: boolean;
  /** Le bouton WhatsApp des propriétaires, avec son message prêt. */
  children: ReactNode;
  className?: string;
  /** Les classes de la phrase (en entier : son corps, sa colonne), puis celles du bloc du bouton. */
  classePhrase?: string;
  classeAction?: string;
}) {
  const vivante = useSyncExternalStore(abonner, dansLeNavigateur, surLeServeur);
  const [lieu, setLieu] = useState("");
  const [surface, setSurface] = useState("");
  const champSurface = useRef<HTMLInputElement>(null);
  const action = useRef<HTMLDivElement>(null);
  const id = useId();

  const l = propre(lieu);
  const s = propre(surface);
  const sonUnite = s !== "" && UNITE_SAISIE.test(s);
  // Le message entier : les deux saisies à la place des trous, le reste mot pour mot.
  const fin = sonUnite ? phrase.apres.replace(phrase.unite, "").replace(/^\s+(?=[.,;])/, "") : phrase.apres;
  const href = waHref(typo(`${phrase.avant}${l || TROU}${phrase.entre}${s || TROU}${fin}`));

  // En entier, ce que l'affiche ne montre pas : la dernière phrase du message, après le
  // premier point. Le guillemet fermant suit le dernier mot écrit : cette phrase, ou à
  // défaut l'unité, ou le point d'une surface qui porte la sienne.
  const point = phrase.apres.indexOf(".");
  const suite = entier && point >= 0 ? phrase.apres.slice(point + 1).trim() : "";
  const ferme = entier && !suite ? " »" : "";

  // Le bouton est rendu côté serveur : le script n'en change que l'adresse.
  useEffect(() => {
    action.current?.querySelector("a")?.setAttribute("href", href);
  }, [href]);

  /** Entrée dans le premier champ : on passe au second. Dans le second : on envoie. */
  const suivant = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    champSurface.current?.focus();
  };
  const envoyer = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    window.location.assign(href);
  };

  return (
    <form
      className={cx("pat", entier && "pat-entier", className)}
      aria-label={typo(nom)}
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      {/* En affiche, une phrase d'affiche, pas un paragraphe : c'est elle le titre du
          formulaire, d'où la lettre des titres. En entier, elle garde la lettre du texte.
          Les espaces entre ses morceaux ne comptent qu'en entier : en affiche, la phrase
          est une rangée, et c'est son écart qui les sépare. */}
      <div className={cx("pat-phrase", !entier && "titre", classePhrase)}>
        <span className="pat-groupe">
          <span className="pat-texte">{typo(entier ? `« ${phrase.avant.trim()}` : phrase.amorce)}</span>{" "}
          {/* Le champ et sa virgule ne se séparent pas. */}
          <span className="pat-colle">
            <Trou
              id={`${id}-lieu`}
              cle={phrase.champs.lieu}
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              onKeyDown={suivant}
              readOnly={!vivante}
              maxLength={60}
              autoCapitalize="words"
              enterKeyHint="next"
            />
            {phrase.colle ? <span className="pat-ponct">{phrase.colle}</span> : null}
          </span>
        </span>{" "}
        <span className="pat-groupe">
          <span className="pat-texte">{typo(phrase.liaison)}</span>{" "}
          {/* Le second champ et son unité : en entier, ils ne se séparent pas non plus. */}
          <span className="pat-suite">
            <span className="pat-colle">
              <Trou
                ref={champSurface}
                id={`${id}-surface`}
                cle={phrase.champs.surface}
                court
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                onKeyDown={envoyer}
                readOnly={!vivante}
                maxLength={24}
                autoCapitalize="off"
                enterKeyHint="send"
              />
              {/* La surface porte son unité : le point de la phrase vient se coller à elle. */}
              {sonUnite ? <span className="pat-ponct">{typo(`.${ferme}`)}</span> : null}
            </span>
            {sonUnite ? null : (
              <span className="pat-texte">{typo(`${entier ? INSECABLE : ""}${phrase.unite}.${ferme}`)}</span>
            )}
          </span>
          {/* En affiche, la phrase s'arrête à son premier point. En entier, la fin du message suit. */}
          {suite ? (
            <>
              {" "}
              <span className="pat-texte">{typo(`${suite} »`)}</span>
            </>
          ) : null}
        </span>
      </div>
      <div ref={action} className={cx("pat-action", classeAction)}>
        {children}
      </div>
    </form>
  );
}
