import { PHOTOS } from "@/content/photos";
import { ETAPES, ETAPE_TITRE, type PhotoEtape } from "@/content/services";
import { cx } from "@/lib/base";
import { CHAPEAU, NOM } from "@/lib/classes";
import { typo } from "@/lib/format";
import { Coupe } from "./coupe";
import { MethodeEtapes } from "./methode-etapes";
import { Photo } from "./photo";
import { TextLink } from "./text-link";
// La planche est celle de la méthode : son cadre, sa coupe collée, son cartouche.
import "./methode.css";
import "./amenager-etapes.css";

/** Le cadre de chaque format (content/services.ts, PhotoEtape). */
const RATIOS = {
  portrait: "aspect-[3/4]",
  paysage: "aspect-[3/2]",
  bande: "aspect-[2/1]",
} as const;

/**
 * La largeur d'un cadre, selon l'écran (amenager-etapes.css donne les mêmes mesures).
 * `large` : toute la colonne des étapes. `portrait` : sa moitié, moins la gouttière.
 * Dès 1 440 px, la colonne ne grandit plus (`fixe`). De 1 101 à 1 439 px, elle suit la
 * moitié de l'écran (`bureau`). En une colonne, les photos tiennent dans 552 px au
 * plus (`plafond`, dès 592 px d'écran) ; en dessous, dans l'écran moins ses gouttières
 * (`mobile`).
 */
const LARGEURS = {
  portrait: { fixe: 300, bureau: "25vw - 60px", plafond: 270, mobile: "50vw - 26px" },
  large: { fixe: 616, bureau: "50vw - 104px", plafond: 552, mobile: "100vw - 40px" },
} as const;

/** `sizes` d'une photo d'étape : la largeur de son cadre, fois l'échelle d'un gros plan. */
function largeurDessinee(p: PhotoEtape): string {
  const l = LARGEURS[p.format === "portrait" ? "portrait" : "large"];
  const k = p.plan?.echelle ?? 1;
  const px = (v: number) => `${Math.ceil(v * k)}px`;
  const calc = (v: string) => (k === 1 ? `calc(${v})` : `calc((${v}) * ${k})`);
  return `(min-width: 1440px) ${px(l.fixe)}, (min-width: 1101px) ${calc(l.bureau)}, (min-width: 592px) ${px(l.plafond)}, ${calc(l.mobile)}`;
}

function Cadre({ p }: { p: PhotoEtape }) {
  return (
    <span className={cx("mg-cadre", RATIOS[p.format])}>
      <Photo
        id={p.id}
        fill
        position={p.position}
        sizes={largeurDessinee(p)}
        className="object-cover"
        style={p.plan ? { transform: `scale(${p.plan.echelle})`, transformOrigin: p.plan.origine } : undefined}
      />
    </span>
  );
}

/**
 * Ce qu'on voit sur la photo : la légende de sa fiche, en étiquette, sans son point
 * final. La nature des images n'est pas redite sous chacune : elles sont toutes de la
 * même, et l'en-tête de la section le dit avec leur nombre (pages/amenager.ts).
 */
function Legende({ p }: { p: PhotoEtape }) {
  const legende = PHOTOS[p.id].legende;
  return legende ? <figcaption className="mg-legende etiquette">{typo(legende.replace(/\.$/, ""))}</figcaption> : null;
}

/**
 * Les photos d'une étape, dans une grille de deux colonnes : deux portraits côte à
 * côte, ou un paysage, ou une bande, de toute la largeur. Un portrait seul garde la
 * taille qu'il a dans une paire : sa légende prend la place du voisin, calée en bas.
 */
function Photos({ photos }: { photos: PhotoEtape[] }) {
  const seul = photos.length === 1 && photos[0].format === "portrait";
  return (
    <div className="mg-photos">
      {photos.map((p) => (
        <figure key={p.id} className={cx("mg-figure", seul ? "mg-figure-seule" : p.format !== "portrait" && "mg-figure-large")}>
          <Cadre p={p} />
          <Legende p={p} />
        </figure>
      ))}
    </div>
  );
}

/**
 * La planche des étapes (page Aménager ; direction v4, pièce 9, en grand) : la planche
 * au bleu de la méthode, partagée en deux moitiés. À gauche, le terrain : chaque étape
 * du chantier avec son nom en Besley, la phrase de l'équipe et ses photos, bien plus
 * grandes que sur l'accueil (une ou deux par étape, chacune avec ce qu'elle montre). À
 * droite, le plan : la coupe d'une voie, collée, qui se construit avec l'étape lue, et
 * son cartouche. La dernière ligne, le titre foncier, n'a pas de photo : elle mène à la
 * page Foncier.
 *
 * Les étapes suivent l'ordre de la coupe (content/services.ts, ETAPES) : la première
 * pose le terrassement, la cinquième l'électricité. Le papier ne dessine rien : la
 * coupe est entière. Aucun numéro : l'ordre de la liste est celui du chantier.
 *
 * L'écoute est celle de la méthode (components/methode-etapes.tsx) ; le cadre, la coupe
 * collée et le cartouche viennent de methode.css ; amenager-etapes.css n'ajoute que la
 * forme des étapes. Sans script ou en mouvement réduit : la coupe entière, toutes les
 * étapes lisibles. Sous 1 101 px, une colonne : la coupe collée sous l'en-tête, les
 * étapes dessous.
 *
 * À poser dans une <Section surface="plan">, sous son en-tête de section et son titre.
 */
export function PlancheEtapes({ className }: { className?: string }) {
  return (
    <MethodeEtapes className={cx("methode methode-grande", className)}>
      {/* La coupe d'abord : en une colonne, elle est au-dessus des étapes. */}
      <Coupe className="methode-figure">
        <p className="coupe-case methode-lue">
          <span className="etiquette">{typo("Étape")}</span>
          {/* Le nom de l'étape lue, écrit par le script. Au repos : la coupe les montre toutes. */}
          <span data-methode-nom="" className="methode-lue-nom">
            {typo("Toutes")}
          </span>
        </p>
      </Coupe>
      <ol className="methode-etapes">
        {ETAPES.map((e) => (
          <li key={e.nom} data-methode-etape="" data-nom={typo(e.nom)} className="mg-etape">
            <h3 className={cx(NOM, "methode-nom")}>
              <span className="methode-mot">{typo(e.nom)}</span>
            </h3>
            <p className={cx(CHAPEAU, "mg-phrase")}>{typo(e.texte)}</p>
            <Photos photos={e.photos} />
          </li>
        ))}
        <li data-methode-etape="" data-nom={typo(ETAPE_TITRE.nom)} className="mg-etape mg-papier">
          <h3 className={cx(NOM, "methode-nom")}>
            <span className="methode-mot">{typo(ETAPE_TITRE.nom)}</span>
          </h3>
          <p className={cx(CHAPEAU, "mg-phrase")}>{typo(ETAPE_TITRE.texte)}</p>
          <div className="mg-suite">
            <TextLink href="/foncier/">Comprendre le foncier</TextLink>
          </div>
        </li>
      </ol>
    </MethodeEtapes>
  );
}
