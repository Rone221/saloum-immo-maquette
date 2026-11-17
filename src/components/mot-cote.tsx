import { typo } from "@/lib/format";

type Options = {
  /**
   * Dans le premier écran d'une page (h1) : la cote se tire une fois, à l'arrivée.
   * Sinon, elle se tire pendant que le titre entre à l'écran.
   */
  arrivee?: boolean;
  /**
   * La cote descend sous les jambages : pour un mot qui en a (p, g, q, y, j) et qui
   * est sur la dernière ligne du titre. Ailleurs, elle toucherait la ligne suivante.
   */
  basse?: boolean;
};

/**
 * Le mot coté (direction v4, pièce 6) : un mot du titre dans la couleur d'accent de la
 * surface (latérite sur clair, latérite vive sur le plan), posé sur une cote : un trait
 * de 1,5 px avec ses deux butées, qui se tire une fois. Un seul par titre. Il ne se
 * coupe pas. À poser dans un titre en Besley (T1, T2, TITRE_ACCUEIL) : la cote est
 * calée sur la ligne de base de cette police (globals.css, « Le mot coté »).
 */
export function MotCote({ children, arrivee = false, basse = false }: Options & { children: string }) {
  return (
    <span className="mot-cote" data-arrivee={arrivee ? "" : undefined} data-basse={basse ? "" : undefined}>
      {typo(children)}
    </span>
  );
}

/**
 * Un titre et son mot coté, à partir du texte du contenu : le mot est repéré dans la
 * phrase, le reste passe par typo(). La ponctuation collée au mot (« viabilisées, »)
 * reste sur sa ligne. Si le mot n'est pas dans le texte, le titre sort sans cote.
 *
 *   <h1 className={T1}><TitreCote texte={TITRE} mot="papier" arrivee /></h1>
 */
export function TitreCote({ texte, mot, ...options }: Options & { texte: string; mot: string }) {
  const debut = texte.indexOf(mot);
  if (debut < 0) return <>{typo(texte)}</>;
  const suite = texte.slice(debut + mot.length);
  // « , » ou « ? » avec son espace : dans le même bloc insécable que le mot.
  const colle = suite.match(/^ ?[,.;:!?»…]+/)?.[0] ?? "";
  return (
    <>
      {typo(texte.slice(0, debut))}
      <span className="whitespace-nowrap">
        <MotCote {...options}>{mot}</MotCote>
        {typo(colle)}
      </span>
      {typo(suite.slice(colle.length))}
    </>
  );
}
