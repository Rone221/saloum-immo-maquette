// Photos du client publiées sur le site (allegement.md, 2.8 et partie 3). Les
// fichiers sont dans public/photos/ (variantes WebP produites par scripts/photos.mjs) ;
// leurs dimensions sont dans public/photos/photos.json.
//
// Règles : moins de photos, plus grandes. La légende dit le geste ou l'objet du
// métier ; un lieu seulement s'il est publié. Le texte alternatif décrit la scène.
// Personne n'est nommé, sauf Babacar Ndiaye.
// Revue 3 : 2538, 2553 et 2540 montrent un même lotissement, 2580 et 2421 un autre
// (inventaire.md) : une photo de chaque groupe par page. 2493 et 2500 sont du même
// instant, 2502 et 2505 aussi : une seule de chaque paire par page.
// scripts/garde-fous.mjs vérifie ces groupes.
// Les captures de l'interview et de la collaboratrice font 899 px de large : jamais
// affichées plus grandes. `largeurMax` plafonne la largeur affichée d'une photo
// (2413-droite : 600 px). 2493 et 2534 ne sont plus publiées (revue 3) : ni fiche ni
// variante, aucune page ne peut les prendre.

import type { Statut } from "./types";

/**
 * La nature d'une image (direction v4, pièce 14) : chaque photo dit ce qu'elle est, à
 * droite de sa légende. Quatre natures et pas une de plus. Déduite de la fiche de la
 * photo, plus bas : `drone` pour une vue d'en haut, `video` pour une image ou une
 * couverture tirée d'une de leurs vidéos (les « ig- »), `chantier` pour une photo
 * prise pendant des travaux, `place` pour toute autre photo prise sur place (visite,
 * agence, voie livrée).
 */
export type NaturePhoto = "chantier" | "drone" | "video" | "place";

/** Ce qui s'écrit sous la photo, en étiquette. */
export const NATURES: Record<NaturePhoto, string> = {
  chantier: "Photo de chantier",
  drone: "Vue au drone",
  video: "Image tirée d’une vidéo",
  place: "Photo sur place",
};

export type FichePhoto = {
  /** Phrase qui décrit la scène. */
  alt: string;
  /** Légende, sous la photo quand elle est seule. */
  legende?: string;
  /** Ce qu'est l'image : écrit à droite de la légende (NATURES). */
  nature: NaturePhoto;
  /** Cadrage par défaut (object-position). */
  position?: string;
  /** Largeur affichée maximale, en px CSS : le cadre ne la dépasse jamais. */
  largeurMax?: number;
  statut: Statut;
  /** Usage et réserves. */
  note: string;
};

const FICHES = {
  "2538": {
    alt: "Vue au drone d’un lotissement : quatre voies en latérite bordées de béton découpent des parcelles terrassées, entre un quartier construit et une zone boisée.",
    legende: "Voies en latérite et bordures béton, parcelles terrassées.",
    position: "50% 50%",
    nature: "drone",
    statut: "a-valider",
    note: "Ouverture de l'accueil. Lieu non publié : jamais de nom de programme dessous. Même lotissement que 2553 et 2540. Les axes des voies dessinés dessus sont relevés sur l'original (2 560 × 1 707).",
  },
  "2528": {
    alt: "Un homme accroupi, tee-shirt Saloum Immo, peint le numéro d’une borne en béton posée dans la latérite.",
    legende: "Une borne numérotée à la peinture.",
    position: "50% 60%",
    nature: "chantier",
    statut: "ok",
    note: "Accueil (planche des gestes, 4:5) et Aménager (bornage, 3:4) : deux pages, aucune autre. Portrait : jamais en 4:3.",
  },
  "2501": {
    alt: "Deux ouvriers déchargent des bordures béton empilées au bord d’une voie.",
    legende: "Bordures béton avant la pose.",
    position: "50% 55%",
    nature: "chantier",
    statut: "ok",
    note: "Accueil, planche des gestes (voies et bordures).",
  },
  "ig-DbLzsuzO_wN-27s": {
    alt: "Une chargeuse jaune déverse de la latérite dans un nuage de poussière rouge.",
    legende: "Terrassement, image tirée de notre film de présentation.",
    position: "62% 50%",
    largeurMax: 759,
    nature: "video",
    statut: "ok",
    note: "Image à 27 s du reel DbLzsuzO_wN (film de présentation, 24 juillet 2026), sans le logo ni le sous-titre incrustés. 759 px de large : jamais plus grande.",
  },
  "ig-DexPGrbBztC-20s": {
    alt: "Une collaboratrice montre un document foncier avec le plan d’une parcelle et ses tampons.",
    legende: "Le document montré dans notre vidéo sur le NICAD.",
    position: "60% 50%",
    largeurMax: 449,
    nature: "video",
    statut: "ok",
    note: "Image à 20 s du reel DexPGrbBztC (le NICAD, 21 octobre 2026). 449 px de large : couverture de la vidéo NICAD, jamais plus grande.",
  },
  "2333": {
    alt: "Deux membres de l’équipe marchent sur un terrain en latérite, l’un en gilet et casque, un document à la main.",
    // Pas de légende : « Visite d'un terrain » décrivait l'image (analyse, point 31).
    position: "50% 40%",
    nature: "place",
    statut: "a-valider",
    note: "Accueil, section De loin. Visages : affichée petite.",
  },
  "2495": {
    alt: "Une chargeuse pousse la terre sur un terrain qu’on dégage.",
    legende: "Terrassement à l’engin.",
    position: "50% 70%",
    nature: "chantier",
    statut: "ok",
    note: "Aménager, terrassement. 729 px de large : jamais plus grande.",
  },
  "2517": {
    alt: "Trois hommes dressent un poteau électrique en béton sur une voie en latérite.",
    legende: "Levage d’un poteau béton.",
    position: "50% 45%",
    nature: "chantier",
    statut: "a-valider",
    note: "Aménager, électricité. Lieu inconnu.",
  },
  "2519": {
    alt: "Un homme déroule un câble électrique noir au bord d’une voie en latérite.",
    legende: "Câble basse tension déroulé avant la pose.",
    position: "50% 60%",
    nature: "chantier",
    statut: "a-valider",
    note: "Aménager, électricité. Lieu inconnu.",
  },
  "2540": {
    alt: "Vue au drone d’un lotissement en trapèze : voies en latérite, parcelles terrassées, une route goudronnée à gauche.",
    legende: "Voies en latérite et parcelles terrassées.",
    position: "50% 50%",
    nature: "drone",
    statut: "a-valider",
    note: "Aménager. Même lotissement que 2538 et 2553 : une seule des trois par page. Lieu non publié : jamais de nom de programme.",
  },
  "2388": {
    alt: "Un groupe marche sur un terrain en latérite pendant une visite.",
    legende: "Visite d’un terrain.",
    position: "50% 45%",
    nature: "place",
    statut: "a-valider",
    note: "Diaspora, planche des visites. Visages : en petit.",
  },
  "2491": {
    alt: "Des visiteurs en boubou et un membre de l’équipe en gilet discutent sur un terrain.",
    legende: "Visite d’un terrain avec l’équipe.",
    position: "50% 40%",
    nature: "place",
    statut: "a-valider",
    note: "Diaspora, planche des visites. Visages : en petit.",
  },
  "2509": {
    alt: "Quatre hommes discutent devant une maison neuve, sur une voie bétonnée.",
    legende: "Visite sur place.",
    position: "50% 50%",
    nature: "place",
    statut: "a-valider",
    note: "Diaspora, planche des visites. Visages : en petit.",
  },
  "2616-bas": {
    alt: "Vue drone d’un quartier qui se construit : maisons neuves et pistes en latérite.",
    position: "50% 50%",
    nature: "drone",
    statut: "a-valider",
    note: "Sicap Keur Massar, sur l'accueil et sur Terrains (vignette et tirage du tableau) : 2616 sans le ciel, pour un cadre en hauteur. Même photo que 2616 : jamais les deux sur une page.",
  },
  "ig-DZUeyGKPdj_-buste": {
    alt: "Babacar Ndiaye, assis à son bureau, face caméra.",
    // Courte : elle tient sous un cadre de 324 px. La nature de l'image, à droite de la
    // légende, dit déjà qu'elle est tirée d'une vidéo ; l'interview est en lien à côté.
    legende: "Babacar Ndiaye, à son bureau.",
    position: "50% 30%",
    largeurMax: 540,
    nature: "video",
    statut: "a-valider",
    note: "Accueil et À propos. L'interview recadrée sur le buste : ni logo incrusté ni ordinateur. 540 × 405 : un cadre 4:5 de 324 px de large au plus (dessinée à 540).",
  },


  "2413-droite": {
    alt: "Voie en latérite neuve entre deux bordures béton, maisons au loin.",
    legende: "Voie en latérite et bordures béton.",
    largeurMax: 600,
    nature: "place",
    statut: "ok",
    note: "Sakina City : rangée de la page Terrains et fiche. Photo de droite de la planche 2413, sans logo ni titre incrusté. 600 px de large au plus.",
  },
  "2616": {
    alt: "Vue drone d’un quartier qui se construit : maisons neuves et pistes en latérite sous un ciel turquoise.",
    // Pas de légende : « Vue drone du secteur » décrivait l'image (analyse, point 31).
    position: "50% 62%",
    nature: "drone",
    statut: "a-valider",
    note: "Fiche Sicap Keur Massar, bord à bord, seule page où elle a un lieu (l'accueil en montre le bas, 2616-bas). Pas sur Terrains.",
  },
  "2580": {
    alt: "Vue drone d’un îlot aménagé : voies en latérite bordées, parcelles terrassées, au bord d’un quartier construit.",
    legende: "Voies ouvertes et bordées, parcelles terrassées.",
    position: "50% 75%",
    nature: "drone",
    statut: "a-valider",
    note: "Lac Town : accueil, et fiche Lac Town bord à bord, calée en bas (50 % 100 %), axes des voies relevés dessus. Original de 2 560 px (recherche/medias). Même lotissement que 2421, pas que 2538.",
  },
  "2542": {
    alt: "Terrain défriché. Un camion benne chargé de latérite sur une voie tracée, piquets plantés.",
    legende: "Latérite livrée sur une voie tracée, piquets plantés.",
    position: "50% 50%",
    nature: "chantier",
    statut: "a-valider",
    note: "Accueil (propriétaires, bande 16:9) et Aménager (voies, bande resserrée) : deux pages, aucune autre. Lieu inconnu : jamais de nom de lieu.",
  },
  "2502": {
    alt: "Deux hommes font un relevé au GPS le long de bordures béton.",
    legende: "Relevé topographique le long des bordures.",
    position: "50% 35%",
    nature: "chantier",
    statut: "ok",
    note: "Aménager, étape 2. Même instant que 2505.",
  },
  "2355": {
    alt: "Tranchée le long d’une rangée d’eucalyptus : un agent SEN’EAU, un membre de l’équipe en gilet, un ouvrier qui creuse.",
    legende: "Tranchée d’adduction avec un agent SEN’EAU.",
    position: "50% 62%",
    nature: "chantier",
    statut: "a-valider",
    note: "Accueil (planche des gestes) et Aménager (eau, paysage 3:2) : deux pages, aucune autre. Lieu inconnu. Jamais dans la même section que les 58 parcelles.",
  },
  "2516": {
    alt: "Pose d’un poteau électrique en béton. Un homme en gilet et casquette Saloum Immo guide le levage.",
    legende: "Pose d’un poteau béton.",
    position: "50% 30%",
    nature: "chantier",
    statut: "a-valider",
    note: "Accueil, planche des gestes (électricité). Lieu inconnu.",
  },
  "ig-DfAoxMkAbKR": {
    alt: "Une collaboratrice en casque et gilet Saloum Immo parle face caméra, sur un lot.",
    legende: "Une collaboratrice présente un lot, sur place.",
    // Cadre 4:3, comme l'interview : le logo incrusté (x 21 à 119 sur 899) sort du cadre.
    position: "62% 30%",
    nature: "video",
    statut: "a-valider",
    note: "Couverture de son reel, nue (aucun bouton posé dessus), sur Diaspora et sur la fiche Sicap Keur Massar : deux pages, aucune autre. Personne n'est nommé. 899 px de large au plus.",
  },
  "2499": {
    alt: "Trois membres de l’équipe en gilet sur un chantier, l’un d’eux gâche du mortier.",
    legende: "L’équipe sur un chantier.",
    position: "50% 15%",
    nature: "chantier",
    statut: "a-valider",
    note: "À propos. Visages : pas de nom.",
  },
  "2537": {
    alt: "Un rond-point de Millennium City, trois personnes posent devant.",
    nature: "place",
    statut: "a-valider",
    note: "À propos, réalisations. Personne n'est nommé. Jamais « notre programme ». Le nom du projet est dans le texte (registre.ts), pas dans la légende.",
  },
  // Le bas de 2352 (y 650 à 810), avec l'affiche de la vitrine, n'est pas publié.
  "2352-haut": {
    // Les deux cadrages publiés (accueil, Contact) montrent l'enseigne, pas la porte.
    alt: "L’enseigne bleue de l’agence Saloum Immo, avec sa devise : Transformer la terre, construire l’avenir.",
    legende: "L’agence et son enseigne.",
    position: "53% 50%",
    nature: "place",
    statut: "ok",
    note: "Accueil et Contact. Photo 2352 coupée au-dessus de l’affiche de la vitrine.",
  },
} satisfies Record<string, FichePhoto>;

export type PhotoId = keyof typeof FICHES;

export const PHOTOS: Record<PhotoId, FichePhoto> = FICHES;
