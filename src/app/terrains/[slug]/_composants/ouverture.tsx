import { Fragment, type ReactNode } from "react";
import { BoutonWhatsApp } from "@/components/boutons";
import { CaseCartouche, Cartouche } from "@/components/cartouche";
import { Cote } from "@/components/cote";
import { EnTeteSection } from "@/components/en-tete-section";
import { Section } from "@/components/section";
import { Lien } from "@/components/text-link";
import { ARIANE } from "@/content/pages/fiches";
import type { CotePubliee, Reference } from "@/content/programmes";
import { cx } from "@/lib/base";
import { CHAPEAU, NOTE, SOUS_BORNE, T1, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";

/** Une borne vue d'en haut : la face blanche, le filet d'encre. */
const BORNE = "size-[11px] flex-none border-[1.5px] border-encre bg-blanc";
/** La butée d'une cote. */
const BUTEE = "h-full w-[1.5px] flex-none bg-current";

/**
 * Le trait du plan sous une valeur : les conventions du site (globals.css, « Traits »),
 * les mêmes que sous l'échelle des papiers. Plein entre deux bornes : ce qui est borné,
 * acquis (un titre foncier). Tirets : ce qui est en cours (un bail). Pointillé entre
 * deux butées, sans valeur : ce qu'on ne sait pas. Cote : ce qui se mesure ou se date.
 * Il se tire une fois : à l'arrivée dans le premier écran (`arrivee`), sinon pendant
 * qu'il entre à l'écran.
 */
export function Trait({
  nature,
  arrivee = false,
  className,
}: {
  nature: NonNullable<Reference["trait"]>;
  arrivee?: boolean;
  className?: string;
}) {
  const tire = arrivee ? "se-tire-arrivee [--delai:0.7s]" : "se-tire";
  const base = cx("flex h-[11px] items-center", tire, className);
  if (nature === "plein") {
    return (
      <span aria-hidden="true" className={cx(base, "text-fort")}>
        <span className={BORNE} />
        <span className="h-0.5 flex-1 bg-current" />
        <span className={BORNE} />
      </span>
    );
  }
  if (nature === "tirets") {
    return (
      <span aria-hidden="true" className={cx(base, "text-fort")}>
        <span className={BUTEE} />
        <span className="tirets h-[1.5px] flex-1" />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={cx(base, "text-accent")}>
      <span className={BUTEE} />
      <span className={cx("h-[1.5px] flex-1", nature === "pointille" ? "pointille" : "bg-current")} />
      <span className={BUTEE} />
    </span>
  );
}

/**
 * La référence en tête du cartouche. Une mesure ou une référence (TF 15026/R, avril
 * 2025) : en très grand, dans la voix large, posée sur son trait. Un statut en mots :
 * dans la lettre des titres, comme les noms de l'échelle des papiers. Un statut qu'on
 * ignore : la cote en pointillés d'abord, sans valeur, puis le conseil.
 */
function Principale({ r }: { r: Reference }) {
  if (r.trait === "pointille") {
    return (
      <>
        <Trait nature="pointille" arrivee className="mt-1 max-w-[18rem]" />
        <p className={cx(T3, "mt-3 text-fort")}>{typo(r.suite ?? "")}</p>
      </>
    );
  }
  return (
    <>
      <span className="inline-flex max-w-full flex-col">
        {r.mesure ? (
          <span className="mesure text-[clamp(2.25rem,11vw,3.25rem)] leading-[0.9] text-fort tab:text-[clamp(3.5rem,5.6vw,5.25rem)]">
            {typo(r.mesure)}
          </span>
        ) : (
          <span className={cx(T3, "text-fort")}>{typo(r.suite ?? "")}</span>
        )}
        {r.trait ? <Trait nature={r.trait} arrivee className={r.mesure ? "mt-3 desk:mt-4" : "mt-2.5"} /> : null}
      </span>
      {r.mesure && r.suite ? <p className="mt-2">{typo(r.suite)}</p> : null}
    </>
  );
}

/** Une valeur du cartouche : une mesure dans la voix large, en grand ; des mots au corps du texte. */
function Valeur({ r }: { r: Reference }) {
  if (!r.mesure) {
    return (
      <span className="inline-flex flex-col">
        <span className="text-fort">{typo(r.suite ?? "")}</span>
        {r.trait ? <Trait nature={r.trait} arrivee className="mt-1.5 min-w-24" /> : null}
      </span>
    );
  }
  return (
    <>
      {r.avant ? <span>{typo(r.avant)} </span> : null}
      <span className="mesure text-[clamp(1.25rem,6.8vw,1.625rem)] leading-none text-fort tab:text-[2.25rem]">{typo(r.mesure)}</span>
      {/* Ce qui suit la mesure : dessous sur téléphone, où une demi-case ne loge pas les
          deux ; à sa suite dès 761 px. L'exposant de « m² » colle au mot suivant : un peu
          d'air en plus de l'espace. */}
      {r.apres ? (
        <>
          {" "}
          <span className="mt-1 block tab:mt-0 tab:ml-1 tab:inline-block">{typo(r.apres)}</span>
        </>
      ) : null}
      {r.suite ? <span className="mt-1.5 block">{typo(r.suite)}</span> : null}
    </>
  );
}

/**
 * Le cartouche de plan d'une fiche (direction v4, pièce 7 et section 6) : une grille à
 * filets, la clé en étiquette, la valeur dessous. En tête et en grand, le papier ou la
 * date de l'offre ; puis ce qui se mesure, en demi-cases quand la valeur est courte.
 * `apresPrincipale` : des cases propres à une fiche, sous la première (les lots).
 */
export function CartouchePlan({
  nom,
  references,
  apresPrincipale,
  className,
}: {
  /** Le nom de la fiche : il nomme le tableau pour les lecteurs d'écran. */
  nom: string;
  references: Reference[];
  apresPrincipale?: ReactNode;
  className?: string;
}) {
  return (
    <Cartouche aria-label={typo(`${nom} : les références`)} className={cx("grid-cols-2", className)}>
      {references.map((r) =>
        r.principale ? (
          <Fragment key={r.cle}>
            {/* La première case a plus d'air que les autres : `!` passe devant les marges de CaseCartouche. */}
            <CaseCartouche cle={r.cle} className="col-span-2 pt-4! pb-5! desk:pt-5! desk:pb-6!">
              <Principale r={r} />
            </CaseCartouche>
            {apresPrincipale}
          </Fragment>
        ) : (
          <CaseCartouche key={r.cle} cle={r.cle} className={r.demi ? undefined : "col-span-2"}>
            <Valeur r={r} />
          </CaseCartouche>
        ),
      )}
    </Cartouche>
  );
}

/**
 * L'action d'une fiche, une seule : le prix dit en étiquette quand il se demande, puis
 * le bouton WhatsApp du programme, avec son message prêt. Le nom accessible commence par
 * le libellé visible.
 */
export function Action({
  ligne,
  label,
  message,
  nom,
}: {
  /** « Prix sur demande. » : dit sans son point, une étiquette n'est pas une phrase. */
  ligne?: string;
  label: string;
  message: string;
  nom: string;
}) {
  return (
    <>
      {ligne ? <p className="etiquette mb-3 text-fort">{typo(ligne.replace(/\.$/, ""))}</p> : null}
      <BoutonWhatsApp label={label} message={message} ariaLabel={`${label}, ${nom}`} />
    </>
  );
}

/**
 * L'ouverture d'une fiche (direction v4, pièce 5 et section 6) : sur le sable à
 * croisillons, l'en-tête de planche (borne 01), puis la pièce qui porte, sur un plan de
 * lotissement, le nom, le lieu et les références. À gauche, le nom dans la lettre des
 * titres, le lieu en cotes (pointillés quand la distance n'est pas chiffrée), ce qu'il
 * faut savoir, et l'action. À droite, le cartouche, calé en bas comme sur une planche.
 *
 * Pas de mot coté dans le nom : un nom propre n'a pas de mot à mesurer. La cote est sous
 * le nom, et c'est une vraie distance ; le trait est sous la référence du cartouche.
 *
 * Sur mobile, une colonne dans l'ordre du DOM : le nom, le lieu, l'action, puis le
 * cartouche. `children` : sous la pièce, dans la même section (la photo du programme).
 */
export function OuvertureFiche({
  nom,
  planche,
  situation,
  cotes = [],
  chapeau,
  note,
  action,
  cartouche,
  noteCartouche,
  children,
}: {
  nom: string;
  /** L'en-tête de planche : ce qu'est la pièce, et à droite ce qui se compte ou se date. */
  planche: { nom: string; quantite?: string };
  /** Le lieu en mots, quand la cote ne le nomme pas. */
  situation?: string;
  /** Les distances publiées. */
  cotes?: CotePubliee[];
  /** Ce qu'il faut savoir, en une ou deux phrases. */
  chapeau?: string;
  /** Sous le chapeau, en petit : un autre nom, une réserve. */
  note?: string;
  /** Le prix en étiquette et le bouton WhatsApp. */
  action: ReactNode;
  /** Le cartouche de plan (CartouchePlan). */
  cartouche: ReactNode;
  /** Sous le cartouche, en petit : d'où viennent ses valeurs. */
  noteCartouche?: string;
  children?: ReactNode;
}) {
  return (
    <Section labelledBy="t-page" rythme="ouverture" croisillons>
      <header>
        <EnTeteSection numero="01" nom={planche.nom} quantite={planche.quantite} arrivee />
        <div className={cx("grid gap-y-10 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
          <div className="desk:col-span-6">
            <nav aria-label="Fil d’Ariane" className="mb-2 text-small text-doux">
              <Lien
                href={ARIANE.href}
                className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-surface hover:text-accent"
              >
                {ARIANE.libelle}
              </Lien>
              <span aria-hidden="true" className="px-2">
                /
              </span>
              <span aria-current="page">{typo(nom)}</span>
            </nav>
            <h1 id="t-page" className={T1}>
              {typo(nom)}
            </h1>
            {situation ? <p className={cx(CHAPEAU, "mt-4 desk:mt-5")}>{typo(situation)}</p> : null}
            {cotes.length ? (
              <div
                className={cx(
                  "grid max-w-[30rem] gap-2",
                  situation ? "mt-3" : "mt-5 desk:mt-6",
                  // Deux cotes l'une sous l'autre : leurs repères ont la même largeur, leurs
                  // traits finissent sur la même verticale.
                  cotes.length > 1 && "[&>p>span:last-child]:min-w-[4.25rem]",
                )}
              >
                {/* Sous 360 px, la cote se resserre : elle tient dans la colonne à 320 px. */}
                {cotes.map((c) => (
                  <Cote key={c.vers} de={c.de} mesure={c.mesure} vers={c.vers} chiffree={c.chiffree} className="max-[359px]:gap-1.5" />
                ))}
              </div>
            ) : null}
            {chapeau ? <p className={cx(CHAPEAU, "mt-6 max-w-[34rem] desk:mt-7")}>{typo(chapeau)}</p> : null}
            {note ? <p className={cx(NOTE, "mt-4")}>{typo(note)}</p> : null}
            <div className="mt-8 desk:mt-10">{action}</div>
          </div>
          <div className="desk:col-span-6 desk:col-start-7">
            {cartouche}
            {noteCartouche ? <p className={cx(NOTE, "mt-3")}>{typo(noteCartouche)}</p> : null}
          </div>
        </div>
      </header>
      {children}
    </Section>
  );
}
