import { Fragment, type ReactNode } from "react";
import { PARCOURS_DIASPORA, type Station } from "@/content/services";
import { MOBILE } from "@/content/site";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";

// Lien dans le fil du texte (inl, 3.3) : trait, souligné. Le padding vertical porte
// la cible à 44 px sans changer l'interligne.
const LIEN_TEXTE = "py-3.5 font-semibold text-trait underline underline-offset-4 hover:decoration-2";

function rendre(texte: string): ReactNode {
  return texte.split(/\{(whatsapp|appel)\}/).map((m, i) => {
    // Le lien WhatsApp porte le mot « WhatsApp » : ailleurs sur la page, le numéro
    // seul est un lien d'appel (tel:), deux liens au même nom ne mènent pas au même endroit.
    if (m === "whatsapp")
      return (
        <a key={i} href={waHref()} className={LIEN_TEXTE}>
          {typo(`WhatsApp au ${MOBILE.long}`)}
        </a>
      );
    if (m === "appel")
      return (
        <a key={i} href={MOBILE.href} className={LIEN_TEXTE}>
          appelez ce numéro
        </a>
      );
    return <Fragment key={i}>{typo(m)}</Fragment>;
  });
}

/**
 * Cheminement en quatre stations (3.16). Bureau : quatre colonnes reliées par
 * une ligne trait. Tablette : 2 × 2, sans ligne. Mobile : vertical, ligne à gauche.
 * La dernière station (« Visitez sur place ») a son carré orange : l'arrivée.
 */
export function PathSteps({
  stations = PARCOURS_DIASPORA,
  avecSuite = false,
  niveau = 3,
  className,
}: {
  stations?: Station[];
  /** Page Diaspora : ajoute « Six vidéos ci-dessous. » à la station 2. */
  avecSuite?: boolean;
  niveau?: 2 | 3;
  className?: string;
}) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <ol className={cx("path", className)}>
      {stations.map((s, i) => (
        <li key={s.numero} className={i === stations.length - 1 ? "path-end" : undefined}>
          <span className="path-n" aria-hidden="true">
            {s.numero}
          </span>
          <Titre className="mb-2 text-4 leading-snug font-650 stretch-sub">{typo(s.titre)}</Titre>
          <p className="text-3 leading-body text-ink-2">
            {rendre(s.texte)}
            {avecSuite && s.suiteDiaspora ? ` ${typo(s.suiteDiaspora)}` : null}
          </p>
        </li>
      ))}
    </ol>
  );
}
