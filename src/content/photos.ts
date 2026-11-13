// Photos du client publiées sur le site (allegement.md, 2.8 et partie 3). Les
// fichiers sont dans public/photos/ (variantes WebP produites par scripts/photos.mjs) ;
// leurs dimensions sont dans public/photos/photos.json.
//
// Règles : moins de photos, plus grandes. La légende décrit ce qu'on voit, sans lieu
// ni programme, sans date de prise de vue. Le texte alternatif décrit la scène.
// Personne n'est nommé, sauf Babacar Ndiaye.
// 2538, 2553, 2580 et 2421 montrent le même lotissement : une seule par page (seule
// 2580 sert encore). 2493 et 2500 sont du même instant, 2502 et 2505 aussi : une
// seule de chaque paire par page. scripts/garde-fous.mjs vérifie ces groupes.
// Les captures de l'interview et de la collaboratrice font 899 px de large : jamais
// affichées plus grandes. `largeurMax` plafonne la largeur affichée d'une photo
// (2413-droite : 600 px ; 2534 : 440 px, au-delà le texte du panneau se lit).

import type { Statut } from "./types";

export type FichePhoto = {
  /** Phrase qui décrit la scène. */
  alt: string;
  /** Légende, sous la photo quand elle est seule. */
  legende?: string;
  /** Cadrage par défaut (object-position). */
  position?: string;
  /** Largeur affichée maximale, en px CSS : le cadre ne la dépasse jamais. */
  largeurMax?: number;
  statut: Statut;
  /** Usage et réserves. */
  note: string;
};

const FICHES = {
  "2493": {
    alt: "Chargeuse sur un terrain en préparation, un homme en gilet Saloum Immo devant.",
    legende: "Chargeuse sur un terrain en préparation.",
    position: "50% 40%",
    statut: "ok",
    note: "Ouverture de l'accueil, étape 1 d'Aménager. Même instant que 2500 : une seule des deux sur une page.",
  },
  "2534": {
    alt: "Panneau Sakina City planté au bord d’une voie en latérite, derrière une bordure béton.",
    legende: "Le panneau du programme, au bord d’une voie en latérite bordée de béton.",
    position: "50% 20%",
    largeurMax: 440,
    statut: "ok",
    note: "Sakina City : carte de l'accueil et fiche, 440 px de large au plus.",
  },
  "2413-droite": {
    alt: "Voie en latérite neuve entre deux bordures béton, maisons au loin.",
    legende: "Voie en latérite et bordures béton.",
    largeurMax: 600,
    statut: "ok",
    note: "Sakina City : rangée de la page Terrains et fiche. Photo de droite de la planche 2413, sans logo ni titre incrusté. 600 px de large au plus.",
  },
  "2616": {
    alt: "Vue drone d’un quartier qui se construit : maisons neuves et pistes en latérite sous un ciel turquoise.",
    legende: "Vue drone du secteur.",
    position: "50% 62%",
    statut: "a-valider",
    note: "Sicap Keur Massar. Pas de date, pas de nom de lotissement dans la légende.",
  },
  "2580": {
    alt: "Vue drone d’un îlot aménagé : voies en latérite bordées, parcelles terrassées, au bord d’un quartier construit.",
    legende: "Vue drone du site. Voies ouvertes et bordées, parcelles terrassées.",
    position: "50% 75%",
    statut: "a-valider",
    note: "Lac Town. La légende ne nomme pas le lieu. Même lotissement que 2538, 2553 et 2421.",
  },
  "2542": {
    alt: "Terrain défriché. Un camion benne chargé de latérite sur une voie tracée, piquets plantés.",
    legende: "Latérite livrée sur une voie tracée, piquets plantés.",
    position: "50% 50%",
    statut: "a-valider",
    note: "Accueil, section Aménager. Lieu inconnu : jamais de nom de lieu.",
  },
  "2502": {
    alt: "Deux hommes font un relevé au GPS le long de bordures béton.",
    legende: "Relevé topographique le long des bordures.",
    position: "50% 35%",
    statut: "ok",
    note: "Aménager, étape 2. Même instant que 2505.",
  },
  "2529": {
    alt: "Deux ouvriers travaillent au bord d’une voie en latérite, près d’un poteau.",
    legende: "Travaux le long d’une voie en latérite.",
    position: "50% 50%",
    statut: "ok",
    note: "Aménager, étape 3.",
  },
  "2355": {
    alt: "Tranchée le long d’une rangée d’eucalyptus : un agent SEN’EAU, un membre de l’équipe en gilet, un ouvrier qui creuse.",
    legende: "Tranchée d’adduction avec un agent SEN’EAU.",
    position: "50% 62%",
    statut: "a-valider",
    note: "Aménager, étape 4. Lieu inconnu. Jamais dans la même section que les 58 parcelles.",
  },
  "2516": {
    alt: "Pose d’un poteau électrique en béton. Un homme en gilet et casquette Saloum Immo guide le levage.",
    legende: "Pose d’un poteau béton.",
    position: "50% 30%",
    statut: "a-valider",
    note: "Aménager, étape 5. Lieu inconnu.",
  },
  "ig-DZUeyGKPdj_": {
    alt: "Babacar Ndiaye, assis derrière un bureau, face caméra.",
    legende: "Babacar Ndiaye, pendant l’interview publiée le 8 juin 2026.",
    // Cadre 4:3 : l'image est dessinée par sa hauteur, 75 % pousse hors du cadre le
    // logo incrusté en haut à gauche (x 28 à 147 sur 899).
    position: "75% 40%",
    statut: "a-valider",
    note: "Accueil et À propos. 899 px de large : cadre 4:3 de 674 px de large au plus.",
  },
  "ig-DfAoxMkAbKR": {
    alt: "Une collaboratrice en casque et gilet Saloum Immo parle face caméra, sur un lot.",
    legende: "Une collaboratrice présente un lot, sur place.",
    // Cadre 4:3, comme l'interview : le logo incrusté (x 21 à 119 sur 899) sort du cadre.
    position: "62% 30%",
    statut: "a-valider",
    note: "Diaspora. Personne n'est nommé. 899 px de large au plus.",
  },
  "2499": {
    alt: "Trois membres de l’équipe en gilet sur un chantier, l’un d’eux gâche du mortier.",
    legende: "L’équipe sur un chantier.",
    position: "50% 15%",
    statut: "a-valider",
    note: "À propos. Visages : pas de nom.",
  },
  "2537": {
    alt: "Rond-point à l’entrée de Millennium City, trois personnes posent devant.",
    legende: "Entrée de Millennium City.",
    statut: "a-valider",
    note: "À propos, réalisations. Personne n'est nommé. Jamais « notre programme ».",
  },
  // Le bas de 2352 (y 650 à 810), avec l'affiche de la vitrine, n'est pas publié.
  "2352-haut": {
    alt: "Façade de l’agence Saloum Immo, enseigne bleue au-dessus de la porte vitrée.",
    legende: "L’agence et son enseigne.",
    position: "53% 50%",
    statut: "ok",
    note: "Accueil et Contact. Photo 2352 coupée au-dessus de l’affiche de la vitrine.",
  },
} satisfies Record<string, FichePhoto>;

export type PhotoId = keyof typeof FICHES;

export const PHOTOS: Record<PhotoId, FichePhoto> = FICHES;
