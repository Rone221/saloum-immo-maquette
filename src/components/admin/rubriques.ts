// Les contenus du site, mis en fiches pour l'espace client de démonstration (direction
// v4, section 7). Côté serveur seulement : ce module lit src/content (programmes,
// registre, vidéos, coordonnées, photos) et en fait des champs à afficher. Rien n'est
// écrit ici : chaque valeur est celle du site, chaque source et chaque date celles du
// fait. Les pages de l'espace client passent le résultat à l'éditeur, qui part au
// navigateur avec ces seules chaînes.
//
// Trois choses ne s'affichent pas :
// - le statut d'un fait (à valider ou non) : c'est une note de travail, elle reste
//   dans le code ;
// - la remarque entre parenthèses d'une source, pour la même raison ;
// - dans une source, le renvoi à un document de travail (« contenu-maquette §5 ») : il
//   dit où le fait a été vérifié, pas où il a été publié. Seules les publications se
//   citent : une vidéo, un TikTok, un article, avec leur lien et leur date.
// Et ce que le site n'affiche pas n'a pas de champ ici.

import manifeste from "../../../public/photos/photos.json";
import { NAVIGATION, WHATSAPP } from "@/content/coordonnees";
import { FICHES, RUBRIQUES, type CleRubrique } from "@/content/demo/textes";
import { NATURES, PHOTOS, type FichePhoto, type PhotoId } from "@/content/photos";
import { AUTRES_SITES, PROGRAMMES, RECASEMENT_AIBD, type Programme, type Reference } from "@/content/programmes";
import { MILLENNIUM_CITY, TRAVAUX, type Travail } from "@/content/registre";
import { AGENCE, CREATION, EMAIL, FIXE, MOBILE, RAISON_SOCIALE, RESEAUX, SIEGE, SLOGAN } from "@/content/site";
import type { Fait } from "@/content/types";
import { metaVideo, titreVideo, VIDEOS, type CleVideo, type Video } from "@/content/videos";
import { dateLongue, moisEnLettres, typo } from "@/lib/format";

/** Une source, telle qu'elle se lit : un texte, et son adresse quand elle en a une. */
export type SourceAffichee = { texte: string; href?: string };

/**
 * La forme d'un champ : une ligne, un texte de plusieurs lignes, un choix dans une
 * liste, ou une valeur qui ne se modifie pas ici (une adresse de page, un fichier).
 */
export type FormeChamp = "ligne" | "texte" | "choix" | "fixe";

export type Champ = {
  /** Unique dans sa fiche. */
  id: string;
  /** La clé, à gauche. */
  cle: string;
  /** La valeur du site. */
  valeur: string;
  forme: FormeChamp;
  /** Dans la voix des mesures : une référence, un numéro, une date. */
  mesure?: boolean;
  /** Les valeurs possibles d'un choix. */
  options?: string[];
  /** Une précision, sous le champ. */
  aide?: string;
  /** Où mène une adresse. */
  lien?: string;
  /**
   * Les publications d'où vient le fait. Absent : le champ n'est pas un fait (un nom, un
   * libellé). Vide : le fait n'a pas de publication à citer.
   */
  sources?: SourceAffichee[];
  /** La date que le fait porte, en lettres. */
  date?: string;
};

export type Groupe = { titre: string; champs: Champ[] };

/** Ce qu'il faut pour montrer une photo : son fichier, et les champs qui règlent l'aperçu. */
export type ApercuPhoto = {
  id: string;
  largeur: number;
  hauteur: number;
  variantes: number[];
  champs: { alt: string; legende: string; nature: string; cadrage: string };
};

export type Fiche = {
  id: string;
  nom: string;
  /** Ce qu'est la fiche, en étiquette : « Programme en vente », « YouTube · 1 min 58 ». */
  sorte: string;
  /**
   * Sa référence, après ce qu'elle est : le nom du fichier d'une photo. Écrite telle
   * quelle, sans capitales : un nom de fichier garde sa casse.
   */
  reference?: string;
  /**
   * Un de ses champs au moins porte une publication ou une date : la colonne « Source
   * et date » se montre. Sinon elle ne se montre pas, plutôt que vide.
   */
  sources: boolean;
  groupes: Groupe[];
  apercu?: ApercuPhoto;
};

export type RubriqueAdmin = {
  cle: CleRubrique;
  nom: string;
  /** Ce que la rubrique contient, compté dans le contenu. */
  contenu: string;
  /** Où elle s'affiche sur le site. */
  pages: string;
  /** Une de ses fiches au moins montre la colonne « Source et date ». */
  sources: boolean;
  fiches: Fiche[];
};

// ------------------------------------------------------------------- Sources

/** Espace insécable, puis espace fine insécable : écrites par leur code, pour qu'un éditeur ne les perde pas. */
const INSECABLE = " ";
const FINE = " ";

const VIDEO_PAR_ID = new Map<string, Video>(Object.values(VIDEOS).map((v: Video) => [v.id, v]));

/** 2560 devient « 2 560 », avec l'espace fine du site. Écrit à la main : le même partout. */
const nombre = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, FINE);

/**
 * Les publications d'où vient un fait, telles qu'elles se lisent. Dans le code, la
 * source est écrite pour qui tient le site : « contenu-maquette §5 ; YouTube
 * qtAHrgDQd4U », « TikTok, 02.10.2025 ». Ici, seul se cite ce que chacun peut aller
 * voir :
 * - une vidéo YouTube, nommée par son titre : elle mène à elle ;
 * - une publication TikTok, nommée par sa date : elle mène à elle quand le fait en
 *   donne l'adresse ;
 * - un article, cité tel quel.
 * Une date en chiffres passe en lettres, comme partout sur le site. La remarque entre
 * parenthèses saute (note de travail). Tout le reste saute aussi : le renvoi à un
 * document de travail (« contenu-maquette §5 », « inventaire §2.1 »), ou à un fichier.
 * Un fait sans publication rend une liste vide.
 */
export function lireSources(source: string, lien?: string): SourceAffichee[] {
  return source
    .replace(/\s*\([^)]*\)/g, "")
    .split(/\s*;\s*/)
    .filter(Boolean)
    .flatMap((morceau): SourceAffichee[] => {
      const texte = morceau.replace(/(\d{2})\.(\d{2})\.(\d{4})/g, (_, j: string, m: string, a: string) => dateLongue(`${a}-${m}-${j}`));
      if (texte.startsWith("YouTube ")) {
        // « YouTube qtAHrgDQd4U et Wq8pwLDb4L0 », « YouTube Wq8pwLDb4L0, à l'oral ».
        const [ids, ...precisions] = texte.slice("YouTube ".length).split(", ");
        const suite = precisions.length ? `, ${precisions.join(", ")}` : "";
        return ids.split(" et ").map((id) => {
          const video = VIDEO_PAR_ID.get(id.trim());
          // Une vidéo que le site ne liste pas : sans titre à donner, elle garde son adresse.
          return video
            ? { texte: `YouTube : ${video.titre}${suite}`, href: video.href }
            : { texte: `Vidéo YouTube${suite}`, href: `https://www.youtube.com/watch?v=${id.trim()}` };
        });
      }
      if (texte.startsWith("TikTok, ")) {
        // « TikTok, 18 novembre 2025 et 20 novembre 2025 » : « TikTok du 18 … et du 20 … ».
        return [{ texte: `TikTok du ${texte.slice("TikTok, ".length).replace(/ et /g, " et du ")}`, href: lien }];
      }
      if (texte.startsWith("Article ")) return [{ texte }];
      return [];
    });
}

// -------------------------------------------------------------------- Champs

type ChampBrut = Omit<Champ, "id"> & { id?: string };
type GroupeBrut = { titre: string; champs: Array<ChampBrut | null | undefined> };
type Reglages = Partial<Pick<Champ, "forme" | "mesure" | "options" | "aide" | "lien">> & { id?: string };

/** Au-delà, un texte ne tient plus sur la ligne d'un champ : il lui faut un champ qui passe à la ligne. */
const LIGNE_LONGUE = 38;

/** Un champ qui n'est pas un fait : un nom, un libellé de bouton, une adresse. */
function champ(cle: string, valeur: string, reglages: Reglages = {}): ChampBrut {
  const { forme, ...reste } = reglages;
  // Une adresse ou une valeur de liste ne passe pas par typo() : elle doit rester exacte.
  const exact = forme === "choix" || reste.lien === valeur;
  return {
    cle,
    valeur: exact ? valeur : typo(valeur),
    // Une adresse reste sur sa ligne, même longue : elle ne se lit pas, elle se copie.
    forme: forme ?? (!exact && valeur.length > LIGNE_LONGUE ? "texte" : "ligne"),
    ...reste,
  };
}

/** Un champ qui porte un fait : sa valeur, sa source, sa date. `valeur` : la découpe affichée. */
function champFait(cle: string, fait: Fait, reglages: Reglages & { valeur?: string } = {}): ChampBrut {
  const { valeur, ...reste } = reglages;
  return {
    ...champ(cle, valeur ?? fait.texte, reste),
    sources: lireSources(fait.source, fait.lien),
    date: fait.date ? typo(dateLongue(fait.date)) : undefined,
  };
}

/**
 * Une fiche : ses groupes sans champ vide, chaque champ avec son identifiant. Elle sait
 * si un de ses champs porte une publication ou une date (`sources`).
 */
function fiche(id: string, nom: string, sorte: string, groupes: GroupeBrut[], autres: Partial<Pick<Fiche, "reference" | "apercu">> = {}): Fiche {
  const pleins: Groupe[] = groupes
    .map((g, gi) => ({
      titre: typo(g.titre),
      champs: g.champs
        .filter((c): c is ChampBrut => Boolean(c))
        .map((c, ci) => ({ ...c, id: c.id ?? `g${gi}-c${ci}`, cle: typo(c.cle), aide: c.aide ? typo(c.aide) : undefined })),
    }))
    .filter((g) => g.champs.length > 0);
  return {
    id,
    nom: typo(nom),
    sorte: typo(sorte),
    ...autres,
    sources: pleins.some((g) => g.champs.some((c) => Boolean(c.sources?.length || c.date))),
    groupes: pleins,
  };
}

// ------------------------------------------------------- Programmes et lots

const IDS_PHOTOS = Object.keys(PHOTOS);

/** Le champ « Photo » d'une fiche : un choix parmi les photos publiées, par leur numéro. */
function champPhoto(id: PhotoId): ChampBrut {
  return champ("Photo", id, { forme: "choix", options: IDS_PHOTOS, mesure: true, aide: FICHES.aides.photo });
}

/** Les vidéos liées à une fiche : elles se règlent dans leur rubrique. */
function champsVideos(cles: CleVideo[]): ChampBrut[] {
  return cles.map((cle, i) =>
    champ(cles.length > 1 ? `Vidéo ${i + 1}` : "Vidéo", titreVideo(cle), {
      forme: "fixe",
      lien: VIDEOS[cle].href,
      aide: FICHES.aides.video,
    }),
  );
}

/** La valeur d'une case de cartouche, telle que la fiche l'écrit : « 150 m² par parcelle ». */
function valeurReference(r: Reference): string {
  return [r.avant, r.mesure, r.apres, r.suite].filter(Boolean).join(" ");
}

function champsReferences(references: Reference[]): ChampBrut[] {
  return references.map((r) =>
    champFait(r.cle, r.fait, { valeur: valeurReference(r), mesure: Boolean(r.mesure) && !r.suite && !r.avant && !r.apres }),
  );
}

/**
 * Un programme en vente. Les groupes suivent le site, là où chaque fait s'affiche :
 * les listes de terrains (accueil, page Terrains), l'ouverture de la fiche, son
 * cartouche, puis ce qui lui est propre (les lots, le calendrier).
 */
function ficheProgramme(p: Programme): Fiche {
  return fiche(p.slug, p.nom, FICHES.sortes.programme, [
    {
      titre: "Identité",
      champs: [
        champ("Nom", p.nom),
        champ("Adresse de la page", p.href, { forme: "fixe", mesure: true, lien: p.href }),
        champFait("Description de la page", p.chapeau),
      ],
    },
    {
      titre: "Dans les listes de terrains",
      champs: [
        champFait("Lieu", p.lieu),
        champFait("Statut foncier", p.statutFiche ?? p.statut),
        champFait("Déjà fait", p.dejaFait),
      ],
    },
    {
      titre: "Ouverture de la fiche",
      champs: [
        p.situation ? champFait("Situation", p.situation) : null,
        ...p.cotes.map((c, i) => champFait(p.cotes.length > 1 ? `Distance ${i + 1}` : "Distance", c.fait)),
        champFait("Présentation", p.presentation),
        p.autreNom ? champFait("Autre nom", p.autreNom) : null,
      ],
    },
    {
      titre: "Cartouche de la fiche",
      champs: [...champsReferences(p.references), p.noteFiche ? champFait("Note", p.noteFiche) : null],
    },
    {
      titre: p.lots?.titre ?? "Lots publiés",
      champs: p.lots
        ? [
            ...p.lots.liste.map((l) =>
              champFait(`Lot ${l.numero}`, l.fait, { valeur: [l.surface, l.note].filter(Boolean).join(". "), mesure: !l.note }),
            ),
            champFait("Avertissement", p.lots.avertissement),
          ]
        : [],
    },
    {
      titre: "Calendrier",
      champs: p.calendrier
        ? [
            champFait("Titre", p.calendrier.titre),
            ...p.calendrier.jalons.map((j) =>
              champFait(dateLongue(j.date), j.texte, {
                aide: j.video ? `${FICHES.aides.videoLiee} ${VIDEOS[j.video].titre}.` : undefined,
              }),
            ),
          ]
        : [],
    },
    {
      titre: "Bouton WhatsApp",
      champs: [champ("Libellé", p.libelleWhatsApp), champ("Message", p.message, { forme: "texte" })],
    },
    { titre: "Photo et vidéos", champs: [champPhoto(p.photo), ...champsVideos(p.videos)] },
  ]);
}

function ficheOffre(): Fiche {
  const o = RECASEMENT_AIBD;
  return fiche(o.slug, o.nom, FICHES.sortes.offre, [
    {
      titre: "Identité",
      champs: [
        champ("Nom", o.nom),
        champ("Adresse de la page", o.href, { forme: "fixe", mesure: true, lien: o.href }),
        champ("Étiquette", o.etiquette),
        champFait("Description de la page", o.fiche),
      ],
    },
    { titre: "Ouverture de la fiche", champs: [champFait("Situation", o.situation)] },
    { titre: "Cartouche de la fiche", champs: champsReferences(o.references) },
    {
      titre: "Bouton WhatsApp",
      champs: [champ("Libellé", o.libelleWhatsApp), champ("Message", o.message, { forme: "texte" })],
    },
  ]);
}

function fichesAutresSites(): Fiche[] {
  return AUTRES_SITES.map((s) =>
    fiche(`site-${s.nom.toLowerCase()}`, s.nom, FICHES.sortes.autreSite, [
      { titre: "Ligne de la page Terrains", champs: [champ("Nom", s.nom), champFait("Texte", s.texte)] },
      { titre: "Bouton WhatsApp", champs: [champ("Message", s.message, { forme: "texte" })] },
    ]),
  );
}

// ---------------------------------------------------------- Chantiers datés

function ficheChantier(t: Travail): Fiche {
  return fiche(t.id, `${t.mesure.chiffre} ${t.mesure.unite}`, moisEnLettres(t.mois), [
    {
      titre: "Ligne du journal",
      champs: [champ("Mois", moisEnLettres(t.mois), { mesure: true }), champFait("Phrase", t.texte)],
    },
    {
      titre: "La mesure, en grand",
      champs: [
        champ("Chiffre", t.mesure.chiffre, { mesure: true }),
        champ("Unité", t.mesure.unite),
        champ("Suite", t.mesure.suite),
      ],
    },
    {
      titre: "Sources publiées",
      champs: t.sources.flatMap((s, i) => {
        const rang = t.sources.length > 1 ? ` ${i + 1}` : "";
        return [
          champ(`Source${rang}`, s.libelle),
          s.href
            ? champ(`Adresse${rang}`, s.href, { lien: s.href })
            : champ(`Adresse${rang}`, "", { aide: FICHES.aides.sansAdresse }),
        ];
      }),
    },
  ]);
}

function ficheRealisation(): Fiche {
  return fiche("millennium-city", "Millennium City", FICHES.sortes.realisation, [
    { titre: "Texte", champs: [champFait("Phrase", MILLENNIUM_CITY.texte)] },
    { titre: "Photo", champs: [champPhoto(MILLENNIUM_CITY.photo)] },
  ]);
}

// -------------------------------------------------------------------- Vidéos

/**
 * Une vidéo est sa propre publication : sa plateforme, sa date et son adresse sont ses
 * champs. Son titre ne cite pas d'autre source.
 */
function ficheVideo(cle: CleVideo): Fiche {
  const v: Video = VIDEOS[cle];
  return fiche(`video-${v.id}`, v.titre, metaVideo(cle), [
    {
      titre: "Vidéo",
      champs: [
        champ("Titre", v.titre),
        champ("Plateforme", v.plateforme, { forme: "choix", options: ["YouTube", "Instagram"] }),
        champ("Publiée le", v.date ? dateLongue(v.date) : "", { mesure: true }),
        champ("Durée", v.duree ?? "", { mesure: true }),
        champ("Adresse", v.href, { lien: v.href }),
      ],
    },
  ]);
}

// --------------------------------------------------------------- Coordonnées

function fichesCoordonnees(): Fiche[] {
  return [
    fiche("entreprise", "Entreprise", "Identité", [
      {
        titre: "Identité",
        champs: [
          champFait("Raison sociale", RAISON_SOCIALE),
          champFait("Devise", SLOGAN),
          champFait("Création", CREATION),
          champFait("Siège", SIEGE),
        ],
      },
    ]),
    fiche("contact", "Contact", "Téléphone, e-mail, agence", [
      {
        titre: "Téléphone",
        champs: [
          champFait("Téléphone et WhatsApp", MOBILE.fait, { mesure: true }),
          champ("Lien WhatsApp", `https://wa.me/${WHATSAPP}`, { forme: "fixe", lien: `https://wa.me/${WHATSAPP}` }),
          champFait("Fixe", FIXE.fait, { mesure: true }),
        ],
      },
      { titre: "E-mail et agence", champs: [champFait("E-mail", EMAIL.fait), champFait("Agence", AGENCE)] },
    ]),
    fiche(
      "reseaux",
      "Réseaux",
      `${RESEAUX.length} comptes`,
      RESEAUX.map((r) => ({
        titre: r.nom,
        champs: [champ("Adresse", r.href, { lien: r.href }), r.chiffre ? champFait("Abonnés", r.chiffre, { mesure: true }) : null],
      })),
    ),
    fiche("menu", "Menu du site", `${NAVIGATION.length} rubriques`, [
      {
        titre: "Rubriques, dans l’ordre",
        champs: NAVIGATION.map((r, i) => champ(`Rubrique ${i + 1}`, r.libelle, { aide: r.href })),
      },
    ]),
  ];
}

// -------------------------------------------------------------------- Photos

type Dimensions = { largeur: number; hauteur: number; variantes: number[] };
const DIMENSIONS = manifeste as Record<string, Dimensions>;

/**
 * Le nom d'une photo, pour qui ne connaît pas le numéro de son fichier : sa légende,
 * sans le point final. Sans légende, le début de son texte alternatif, jusqu'à la
 * première virgule ou aux deux-points : le texte entier est dans son champ.
 */
function nomPhoto(p: FichePhoto): string {
  return (p.legende ?? p.alt.split(/\s*[,:]\s/)[0]).replace(/\.$/, "");
}

/**
 * Une photo : ce qu'on lit dessous, comment elle se cadre, son fichier. Elle se nomme
 * par ce qu'elle montre ; le nom de son fichier suit sa nature, en référence. Une fiche
 * sans fichier produit (public/photos/photos.json) garde ses champs, sans aperçu ni
 * mesures : la page ne casse pas si une photo quitte le dossier avant sa fiche.
 */
function fichePhoto(id: PhotoId): Fiche {
  const p: FichePhoto = PHOTOS[id];
  const d: Dimensions | undefined = DIMENSIONS[id];
  return fiche(
    `photo-${id}`,
    nomPhoto(p),
    NATURES[p.nature],
    [
      {
        titre: "Ce qu’on lit",
        champs: [
          champ("Texte alternatif", p.alt, { id: "alt", forme: "texte", aide: FICHES.aides.alt }),
          champ("Légende", p.legende ?? "", { id: "legende", aide: FICHES.aides.legende }),
          champ("Nature", NATURES[p.nature], { id: "nature", forme: "choix", options: Object.values(NATURES) }),
        ],
      },
      {
        titre: "Ce qu’on voit",
        champs: [
          champ("Cadrage", p.position ?? "", { id: "cadrage", mesure: true, aide: FICHES.aides.cadrage }),
          champ("Largeur maximale", p.largeurMax ? `${p.largeurMax}${INSECABLE}px` : "", {
            id: "largeur",
            mesure: true,
            aide: FICHES.aides.largeur,
          }),
          d
            ? champ("Fichier", `${nombre(d.largeur)}${INSECABLE}×${INSECABLE}${nombre(d.hauteur)}${INSECABLE}px`, {
                id: "fichier",
                forme: "fixe",
                mesure: true,
              })
            : null,
        ],
      },
    ],
    {
      reference: id,
      apercu: d ? { id, ...d, champs: { alt: "alt", legende: "legende", nature: "nature", cadrage: "cadrage" } } : undefined,
    },
  );
}

// ----------------------------------------------------------------- Rubriques

const lotsPublies = PROGRAMMES.reduce((n, p) => n + (p.lots?.liste.length ?? 0), 0);

const FABRIQUES: Record<CleRubrique, () => Pick<RubriqueAdmin, "contenu" | "pages" | "fiches">> = {
  programmes: () => ({
    contenu: `${PROGRAMMES.length} programmes en vente · ${lotsPublies} lots publiés · 1 offre datée · ${AUTRES_SITES.length} autres sites`,
    pages: "Accueil, Terrains, et la fiche de chaque programme",
    fiches: [...PROGRAMMES.map(ficheProgramme), ficheOffre(), ...fichesAutresSites()],
  }),
  chantiers: () => ({
    contenu: `${TRAVAUX.length} chantiers datés · 1 réalisation`,
    pages: "Accueil, Aménager votre terrain, À propos",
    fiches: [...TRAVAUX.map(ficheChantier), ficheRealisation()],
  }),
  videos: () => ({
    contenu: `${Object.keys(VIDEOS).length} vidéos, en liens vers leur plateforme`,
    pages: "Partout où une vidéo est citée",
    fiches: (Object.keys(VIDEOS) as CleVideo[]).map(ficheVideo),
  }),
  coordonnees: () => ({
    contenu: `L’entreprise, le contact, ${RESEAUX.length} réseaux, le menu`,
    pages: "En-tête, pied de page, Contact",
    fiches: fichesCoordonnees(),
  }),
  photos: () => ({
    contenu: `${IDS_PHOTOS.length} photos, avec leur légende et leur nature`,
    // Pas « toutes les pages » : certaines n'ont pas de photo.
    pages: "Partout où une photo est montrée",
    fiches: (IDS_PHOTOS as PhotoId[]).map(fichePhoto),
  }),
};

/** Une rubrique, avec ses fiches. Absente : la clé n'existe pas. */
export function rubriqueAdmin(cle: string): RubriqueAdmin | null {
  const r = RUBRIQUES.find((x) => x.cle === cle);
  if (!r) return null;
  const { contenu, pages, fiches } = FABRIQUES[r.cle]();
  return { cle: r.cle, nom: r.nom, contenu: typo(contenu), pages: typo(pages), sources: fiches.some((f) => f.sources), fiches };
}

/** Les cinq rubriques, dans l'ordre de la navigation : pour la liste et les raccourcis. */
export function rubriquesAdmin(): RubriqueAdmin[] {
  return RUBRIQUES.map((r) => rubriqueAdmin(r.cle)).filter((r): r is RubriqueAdmin => r !== null);
}
