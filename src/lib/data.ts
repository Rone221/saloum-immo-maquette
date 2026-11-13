// Données de la maquette.
// Réel (sources client) : noms et zones des programmes, 78 parcelles de 150 et 300 m² à Kounoune 2,
// équipements de Kounoune 2, adduction d'eau terminée à Kounoune 2, parcelles en bail au recasement AIBD,
// 29 ha à Bayakh, projet route du Lac Rose à Niague, maisons des Almadies, titres d'actualités.
// Indicatif (à remplacer) : prix, nombre de lots hors Kounoune, statuts juridiques non publiés,
// avancement des travaux hors adduction d'eau à Kounoune 2, photos (Unsplash).

export type LandStatusKey = "titre-foncier" | "bail" | "deliberation";

export const LAND_STATUSES: Record<
  LandStatusKey,
  { label: string; abbr: string; summary: string; security: string; docs: string[] }
> = {
  "titre-foncier": {
    label: "Titre foncier",
    abbr: "TF",
    summary:
      "Propriété pleine et définitive, inscrite au livre foncier. Le terrain est borné et peut être hypothéqué.",
    security: "Le plus sûr",
    docs: [
      "Copie du titre foncier",
      "État des droits réels récent",
      "Plan de bornage signé par un géomètre",
      "Acte de vente chez le notaire",
    ],
  },
  bail: {
    label: "Bail",
    abbr: "Bail",
    summary:
      "Droit d'occupation accordé par l'État sur une longue durée, de 18 à 50 ans. Il peut être transformé en titre foncier.",
    security: "Solide, à transformer",
    docs: [
      "Contrat de bail ou arrêté d'attribution",
      "Plan de situation et de lotissement",
      "Acte de cession chez le notaire",
      "Accompagnement vers le titre foncier",
    ],
  },
  deliberation: {
    label: "Délibération",
    abbr: "Délib.",
    summary:
      "Droit d'usage attribué par la commune sur le domaine national. Statut fragile, à régulariser avant de construire.",
    security: "Fragile",
    docs: [
      "Délibération du conseil municipal",
      "Procès-verbal d'attribution",
      "Plan de situation",
      "Démarche de régularisation",
    ],
  },
};

export const IMG = {
  aerialLotissement: "photo-1568025848823-86404cd04ad1",
  quartierNeuf: "photo-1783260606376-046b461ba2bc",
  quartierRues: "photo-1783260606348-bb2deaa215a3",
  quartierExpansion: "photo-1783260606355-753ae29e557f",
  peripherie: "photo-1636137627135-1de8c36e92de",
  terrainNu: "photo-1636137626685-385d7a27c768",
  lacRose: "photo-1577259855408-c14a7b107540",
  villageAerien: "photo-1597589619070-76e39b498f49",
  aerialVille: "photo-1645792298509-7aadfa5b6f49",
  aerialVillage: "photo-1543716349-79942dce62c9",
  pisteRouge: "photo-1763241841248-012e2c943f19",
  pisteMer: "photo-1781728924553-58a158a07b87",
  pisteVillage: "photo-1758061398870-a86a0fa1a6c3",
  geometre: "photo-1545186070-de624ed19875",
  pelleteuse: "photo-1685555809025-0fe60ab6df46",
  terrassement: "photo-1649829726631-fcd218631ab5",
  toiture: "photo-1740825961434-e9287638592b",
  grue: "photo-1621355254227-14b1001a91c9",
  villa1: "photo-1706808849780-7a04fbac83ef",
  villa2: "photo-1706808849803-f61304e024ab",
  villa3: "photo-1706164971302-e30c0640cc3b",
  villaArches: "photo-1674758979141-4e3521ba7321",
  dakarCote: "photo-1690323223790-4df744a1a033",
  dakarVille: "photo-1758061329486-4f7b4a09d77d",
  ouakam: "photo-1611258490565-4a06c019e631",
  coucherPirogues: "photo-1583495506658-50a3587f792e",
  baobab: "photo-1611693196679-c1f358840cc6",
} as const;

export const IMG_ALT: Record<string, string> = {
  [IMG.aerialLotissement]: "Vue aérienne d'un lotissement aux voies en latérite",
  [IMG.quartierNeuf]: "Vue aérienne d'un quartier résidentiel aux maisons neuves",
  [IMG.quartierRues]: "Vue aérienne d'un quartier résidentiel et de ses rues",
  [IMG.quartierExpansion]: "Vue aérienne d'un quartier en expansion",
  [IMG.peripherie]: "Vue aérienne d'une route qui traverse une zone en développement",
  [IMG.terrainNu]: "Vue aérienne d'un terrain dégagé en bordure de ville",
  [IMG.lacRose]: "Vue aérienne d'un lac rose et de pirogues alignées sur le sel",
  [IMG.villageAerien]: "Vue aérienne de maisons et de chemins de terre",
  [IMG.aerialVille]: "Vue aérienne d'une ville qui s'étend vers l'horizon",
  [IMG.aerialVillage]: "Vue aérienne de parcelles et de chemins de terre",
  [IMG.pisteRouge]: "Piste de latérite rouge bordée de végétation",
  [IMG.pisteMer]: "Piste de latérite qui descend vers la mer",
  [IMG.pisteVillage]: "Rue de sable dans un village au Sénégal",
  [IMG.geometre]: "Géomètre en casque utilisant un théodolite sur un terrain",
  [IMG.pelleteuse]: "Pelleteuse devant un tas de sable sur un chantier",
  [IMG.terrassement]: "Engin de terrassement en action sur un chantier",
  [IMG.toiture]: "Ouvriers casqués qui posent une toiture",
  [IMG.grue]: "Grue de chantier sous un ciel bleu",
  [IMG.villa1]: "Villa contemporaine avec piscine et pelouse",
  [IMG.villa2]: "Façade blanche d'une maison moderne et son allée",
  [IMG.villa3]: "Maison de plain-pied aux grandes baies vitrées",
  [IMG.villaArches]: "Maison à arcades avec balcons en fer forgé",
  [IMG.dakarCote]: "Vue aérienne de Dakar et de la côte atlantique",
  [IMG.dakarVille]: "Immeubles du centre de Dakar",
  [IMG.ouakam]: "Mosquée de la Divinité à Ouakam, face à l'océan",
  [IMG.coucherPirogues]: "Coucher de soleil sur l'océan avec des pirogues au loin",
  [IMG.baobab]: "Baobab isolé sous un ciel bleu",
};

export type WorkState = "fait" | "en-cours" | "a-venir";

export type Programme = {
  slug: string;
  name: string;
  zone: string;
  locality: string;
  kind: "lotissement" | "grande-surface" | "maison";
  status: LandStatusKey;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  lots?: { total: number; doubles: number; soldRatio: number; reservedRatio: number };
  offers: { surface: number; unit: "m²" | "ha"; price: number | null }[];
  amenities: { key: Amenity; label: string }[];
  works: { label: string; state: WorkState }[];
  access: string[];
  mapQuery: string;
  updated: string;
};

export type Amenity =
  | "eau"
  | "electricite"
  | "voirie"
  | "mosquee"
  | "foot"
  | "jeux"
  | "vert"
  | "commerce"
  | "aeroport"
  | "lac"
  | "mer";

export const PROGRAMMES: Programme[] = [
  {
    slug: "kounoune-2",
    name: "Cité Kounoune 2",
    zone: "Kounoune",
    locality: "Département de Rufisque",
    kind: "lotissement",
    status: "titre-foncier",
    tagline: "78 parcelles dans un quartier pensé pour les familles.",
    description:
      "Projet réalisé par Saloum Immo à Kounoune 2. L'adduction d'eau et le raccordement au réseau sont terminés. Le lotissement prévoit un terrain de football, une aire de jeux, des espaces verts, un centre commercial et une mosquée. Parcelles de 150 et 300 m².",
    image: IMG.quartierNeuf,
    gallery: [IMG.aerialLotissement, IMG.pisteRouge, IMG.geometre],
    lots: { total: 78, doubles: 10, soldRatio: 0.46, reservedRatio: 0.14 },
    offers: [
      { surface: 150, unit: "m²", price: 7_500_000 },
      { surface: 300, unit: "m²", price: 14_500_000 },
    ],
    amenities: [
      { key: "eau", label: "Eau courante raccordée" },
      { key: "mosquee", label: "Mosquée" },
      { key: "foot", label: "Terrain de football" },
      { key: "jeux", label: "Aire de jeux" },
      { key: "vert", label: "Espaces verts" },
      { key: "commerce", label: "Centre commercial" },
    ],
    works: [
      { label: "Bornage des parcelles", state: "fait" },
      { label: "Adduction d'eau et raccordement", state: "fait" },
      { label: "Voirie en latérite", state: "en-cours" },
      { label: "Électrification", state: "a-venir" },
    ],
    access: ["Entre Keur Massar et Sangalkam", "Accès et temps de trajet à préciser"],
    mapQuery: "Kounoune, Sénégal",
    updated: "Octobre 2026",
  },
  {
    slug: "recasement-aibd",
    name: "Parcelles du recasement AIBD",
    zone: "Diass",
    locality: "Près de l'aéroport Blaise Diagne",
    kind: "lotissement",
    status: "bail",
    tagline: "Des parcelles en bail aux portes de l'aéroport international.",
    description:
      "Parcelles en bail sur le site de recasement de l'AIBD, une zone qui se développe avec l'aéroport, l'autoroute à péage et le pôle urbain de Diamniadio. Un placement de long terme, accessible avec un petit apport.",
    image: IMG.peripherie,
    gallery: [IMG.terrainNu, IMG.aerialVille, IMG.terrassement],
    lots: { total: 64, doubles: 8, soldRatio: 0.38, reservedRatio: 0.16 },
    offers: [
      { surface: 150, unit: "m²", price: 3_200_000 },
      { surface: 200, unit: "m²", price: 4_200_000 },
      { surface: 300, unit: "m²", price: 6_000_000 },
    ],
    amenities: [
      { key: "aeroport", label: "Aéroport AIBD à proximité" },
      { key: "voirie", label: "Voies tracées" },
      { key: "eau", label: "Eau prévue" },
    ],
    works: [
      { label: "Bornage des parcelles", state: "fait" },
      { label: "Tracé des voies", state: "en-cours" },
      { label: "Adduction d'eau", state: "a-venir" },
      { label: "Électrification", state: "a-venir" },
    ],
    access: ["Proche de l'aéroport Blaise Diagne", "Autoroute à péage Dakar AIBD"],
    mapQuery: "Diass, Sénégal",
    updated: "Septembre 2026",
  },
  {
    slug: "niague-lac-rose",
    name: "Niague, route du Lac Rose",
    zone: "Niague",
    locality: "Route du Lac Rose",
    kind: "lotissement",
    status: "titre-foncier",
    tagline: "Un cadre calme entre Dakar et le Lac Rose.",
    description:
      "Projet en cours sur la route du Lac Rose, suivi en vidéo par notre équipe. Une zone résidentielle recherchée, à mi-chemin entre l'agglomération dakaroise et le littoral nord.",
    image: IMG.lacRose,
    gallery: [IMG.quartierRues, IMG.pisteMer, IMG.aerialVille],
    lots: { total: 48, doubles: 6, soldRatio: 0.3, reservedRatio: 0.12 },
    offers: [
      { surface: 150, unit: "m²", price: 13_500_000 },
      { surface: 200, unit: "m²", price: 17_500_000 },
      { surface: 250, unit: "m²", price: 21_500_000 },
    ],
    amenities: [
      { key: "lac", label: "Lac Rose à proximité" },
      { key: "voirie", label: "Voirie en cours" },
      { key: "eau", label: "Eau prévue" },
    ],
    works: [
      { label: "Terrassement", state: "fait" },
      { label: "Bornage des parcelles", state: "fait" },
      { label: "Voirie en latérite", state: "en-cours" },
      { label: "Adduction d'eau", state: "a-venir" },
    ],
    access: ["Route du Lac Rose", "Entre Keur Massar et le littoral nord"],
    mapQuery: "Niague, Sénégal",
    updated: "Juin 2026",
  },
  {
    slug: "bayakh-29-hectares",
    name: "Bayakh, 29 hectares",
    zone: "Bayakh",
    locality: "Région de Thiès",
    kind: "grande-surface",
    status: "titre-foncier",
    tagline: "Une réserve foncière pour investisseurs et promoteurs.",
    description:
      "29 hectares disponibles à Bayakh, dans la zone des Niayes. Adapté à un projet résidentiel, agricole ou à une opération de lotissement. Vente par lots d'un hectare ou en bloc, sur étude.",
    image: IMG.aerialVillage,
    gallery: [IMG.villageAerien, IMG.baobab, IMG.geometre],
    offers: [
      { surface: 1, unit: "ha", price: null },
      { surface: 5, unit: "ha", price: null },
    ],
    amenities: [
      { key: "vert", label: "Zone maraîchère des Niayes" },
      { key: "voirie", label: "Lots d'un hectare ou en bloc" },
    ],
    works: [
      { label: "Levé topographique", state: "fait" },
      { label: "Découpage sur mesure", state: "a-venir" },
    ],
    access: ["Zone des Niayes", "Vers Kayar et Tivaouane"],
    mapQuery: "Bayakh, Sénégal",
    updated: "Avril 2026",
  },
  {
    slug: "villa-almadies",
    name: "Villa contemporaine aux Almadies",
    zone: "Almadies",
    locality: "Dakar",
    kind: "maison",
    status: "titre-foncier",
    tagline: "270 m² de vie, à quelques minutes de l'océan.",
    description:
      "Maison contemporaine de 270 m² aux Almadies. Volumes ouverts, grandes baies et finitions soignées, dans l'un des quartiers les plus recherchés de Dakar.",
    image: IMG.villa1,
    gallery: [IMG.villa2, IMG.villa3, IMG.dakarCote],
    offers: [{ surface: 270, unit: "m²", price: null }],
    amenities: [
      { key: "mer", label: "Océan à proximité" },
      { key: "electricite", label: "Raccordée" },
    ],
    works: [],
    access: ["Almadies, Dakar"],
    mapQuery: "Almadies, Dakar",
    updated: "Février 2026",
  },
  {
    slug: "maison-ngor-a-renover",
    name: "Maison à rénover près de Ngor",
    zone: "Almadies",
    locality: "Dakar, près de Ngor",
    kind: "maison",
    status: "titre-foncier",
    tagline: "210 m² avec un fort potentiel de valorisation.",
    description:
      "Maison de 210 m² à rénover entre les Almadies et Ngor. Une base saine pour un projet de rénovation, avec l'appui de notre équipe pour les plans et les travaux.",
    image: IMG.villaArches,
    gallery: [IMG.ouakam, IMG.toiture, IMG.dakarVille],
    offers: [{ surface: 210, unit: "m²", price: null }],
    amenities: [
      { key: "mer", label: "Océan à proximité" },
      { key: "electricite", label: "Raccordée" },
    ],
    works: [],
    access: ["Almadies, près de Ngor"],
    mapQuery: "Ngor, Dakar",
    updated: "Février 2026",
  },
];

export function getProgramme(slug: string) {
  return PROGRAMMES.find((p) => p.slug === slug);
}

export type Offer = {
  id: string;
  programme: Programme;
  surface: number;
  unit: "m²" | "ha";
  price: number | null;
  available: number | null;
  image: string;
};

export function availableLots(p: Programme) {
  if (!p.lots) return null;
  const sold = Math.round(p.lots.total * p.lots.soldRatio);
  const reserved = Math.round(p.lots.total * p.lots.reservedRatio);
  return p.lots.total - sold - reserved;
}

export const OFFERS: Offer[] = PROGRAMMES.flatMap((p) =>
  p.offers.map((o, i) => {
    const avail = availableLots(p);
    return {
      image: i === 0 ? p.image : p.gallery[i - 1] ?? p.image,
      id: `${p.slug}-${o.surface}${o.unit === "ha" ? "ha" : ""}`,
      programme: p,
      surface: o.surface,
      unit: o.unit,
      price: o.price,
      available: avail === null ? null : Math.max(1, Math.round(avail / p.offers.length)),
    };
  }),
);

export function priceFrom(p: Programme) {
  const prices = p.offers.map((o) => o.price).filter((x): x is number => x !== null);
  return prices.length ? Math.min(...prices) : null;
}

export const ZONES = Array.from(new Set(PROGRAMMES.map((p) => p.zone)));

// Titres réels publiés par Saloum Immo (blog 2025). Dates reprises de l'archive quand elles existent.
export const NEWS = [
  {
    title: "État des lieux sur notre projet à Niague, route du Lac Rose",
    date: "19 juin 2025",
    kind: "Vidéo",
    image: IMG.pisteMer,
  },
  {
    title: "Saloum Immo en pleine action sur son nouveau chantier",
    date: "30 mai 2025",
    kind: "Chantier",
    image: IMG.pelleteuse,
  },
  {
    title: "Le levé des topographes sur le boulevard de 30 m avant le pavage",
    date: "Juin 2025",
    kind: "Chantier",
    image: IMG.grue,
  },
  {
    title: "Les étapes pour construire une route en latérite",
    date: "Juillet 2025",
    kind: "Conseil",
    image: IMG.pisteRouge,
  },
];

export const FAQ_HOME = [
  {
    q: "Comment savoir si un terrain est vraiment à vendre ?",
    a: "Nous vous remettons la copie du titre ou du bail et vous invitons à faire vérifier l'état des droits par le notaire de votre choix avant tout paiement. Aucun versement n'est demandé sans document.",
  },
  {
    q: "Puis-je payer en plusieurs fois ?",
    a: "Oui, selon les programmes. Un apport à la réservation, puis des mensualités. Chaque paiement est fait par virement ou mobile money et donne lieu à un reçu.",
  },
  {
    q: "J'habite à l'étranger, comment visiter ?",
    a: "Nous organisons une visite vidéo en direct sur la parcelle, à l'heure qui vous arrange. Vous pouvez aussi mandater un proche ou signer par procuration notariée.",
  },
  {
    q: "Pouvez-vous construire sur le terrain acheté ?",
    a: "Oui. Plans, devis, construction et suivi de chantier avec photos régulières. Vous restez propriétaire du terrain et du choix de votre maison.",
  },
  {
    q: "Quels frais prévoir en plus du prix du terrain ?",
    a: "Les frais de notaire et d'enregistrement, et selon le statut, les frais de mutation ou de transformation en titre foncier. Nous les chiffrons avec vous avant la réservation.",
  },
];
