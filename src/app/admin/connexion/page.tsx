// L'écran de connexion de l'espace client, en maquette (direction v4, section 7).
// Aucun mot de passe n'est demandé ni saisi : il n'y a rien à saisir. Les deux champs
// de la vraie connexion sont dessinés, pas posés : une clé, et une cote en pointillé
// sans valeur. Sur un plan, c'est le signe de ce qu'on ne sait pas encore ; ici, de ce
// qui viendra avec le service. Une phrase le dit, un bouton fait entrer.
//
// C'est le seuil, pas un écran de travail : il garde l'ouverture d'une page du site
// (borne 01, titre en Besley et son mot coté) et, à gauche, le bleu de plan avec la
// devise de l'enseigne, posée sur un trait de terrain. Passé la porte, plus de planche
// au bleu.

import type { Metadata } from "next";
import Link from "next/link";
import { Bandeau, Carre } from "@/components/admin/pieces";
import { Bouton } from "@/components/boutons";
import { EnTeteSection } from "@/components/en-tete-section";
import { TitreCote } from "@/components/mot-cote";
import { TextLink } from "@/components/text-link";
import { CONNEXION } from "@/content/demo/textes";
import { RAISON_SOCIALE, SLOGAN } from "@/content/site";
import { asset, cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T1 } from "@/lib/classes";
import { typo } from "@/lib/format";

export const metadata: Metadata = { title: CONNEXION.titrePage };

export default function Connexion() {
  const t = CONNEXION;
  return (
    <div className="connexion">
      <Bandeau />

      {/* Le bleu de plan : le logo sur sa plaque, la devise, la raison sociale. */}
      <div className="connexion-plan croisillons-clairs sur-plan">
        <Link href="/" aria-label="Saloum Immo, accueil du site" className="admin-plaque">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/2269-logo-horizontal-420.png")} width={420} height={160} alt="" />
        </Link>
        <div className="connexion-devise">
          <p className="titre italic">{typo(SLOGAN.texte)}</p>
          <p className="etiquette mt-4 text-doux desk:mt-6">{RAISON_SOCIALE.texte}</p>
        </div>
        {/* Le trait de terrain du pied du site : 2 px de latérite vive, les hachures du
            sol dessous, deux bornes plantées dessus. */}
        <div aria-hidden="true" className="connexion-terrain">
          <span className="connexion-borne" />
          <span className="connexion-borne" />
          <span className="block h-0.5 bg-laterite-vive" />
          <span className="hachures block h-6 text-laterite-vive/40" />
        </div>
      </div>

      <div id="ecran" tabIndex={-1} className="connexion-ecran croisillons">
        <div className="connexion-colonne">
          <EnTeteSection numero="01" nom={t.nom} quantite={t.repere} arrivee />
          <h1 id="t-ecran" className={cx(T1, SOUS_BORNE)}>
            <TitreCote texte={t.titre} mot={t.mot} arrivee />
          </h1>
          <p className={cx(CHAPEAU, "mt-5 max-w-[32rem] desk:mt-7")}>{typo(t.chapeau)}</p>

          {/* La fiche d'accès : deux champs dessinés, à venir. Rien à remplir. */}
          <div className="acces sur-calque">
            <div className="acces-tete">
              <p className="etiquette text-fort">{typo(t.fiche)}</p>
              <p className="admin-etat etiquette text-fort">
                <Carre />
                <span>{typo(t.etat)}</span>
              </p>
            </div>
            <ul className="acces-champs">
              {t.champs.map((champ) => (
                <li key={champ}>
                  <span className="etiquette text-doux">{typo(champ)}</span>
                  <span aria-hidden="true" className="acces-cote">
                    <span />
                    <span className="pointille" />
                    <span />
                  </span>
                </li>
              ))}
            </ul>
            <p className="acces-phrase">{typo(t.phrase)}</p>
          </div>

          <div className="connexion-gestes">
            {/* Sans aimant : passé le site public, le bouton ne bouge plus. */}
            <Bouton href="/admin/" aimant={false}>
              {t.bouton}
            </Bouton>
            <TextLink href="/" fleche={false}>
              {t.retour}
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
