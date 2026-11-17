// Textes de l'espace client de démonstration (direction v4, section 7 :
// recherche/revue-4/direction-v4.md). De l'interface seulement : aucun fait sur Saloum
// Immo n'est écrit ici. Les contenus que l'espace client affiche viennent de
// src/content ; ses chiffres de trafic et ses demandes d'exemple, de ce dossier
// (trafic.ts, demandes.ts), et ils sont inventés.
//
// Ce fichier part au navigateur (la navigation et les écrans le lisent) : des chaînes,
// rien d'autre.

/** Le nom de l'espace, et ce que tous ses écrans portent. */
export const ESPACE = {
  nom: "Espace client",
  /**
   * Le bandeau, sur chaque écran, toujours visible. « Données de démonstration » est
   * exigé mot pour mot.
   */
  bandeau: {
    titre: "Données de démonstration",
    detail: "Trafic et demandes d’exemple inventés. Les contenus sont ceux du site.",
    fin: "Rien n’est enregistré",
  },
  evitement: "Aller au contenu",
  navigation: "Écrans de l’espace client",
  accueil: "Espace client, tableau de bord",
  voirSite: "Voir le site",
  quitter: "Quitter la démonstration",
  /** Sur téléphone, où la barre est étroite. */
  quitterCourt: "Quitter",
  /** Lu après le nombre de demandes nouvelles, dans la navigation. */
  nouvelles: "nouvelles",
};

/** Les trois écrans de travail, dans l'ordre de la navigation. */
export const ECRANS = [
  { href: "/admin/", libelle: "Tableau de bord" },
  { href: "/admin/demandes/", libelle: "Demandes" },
  { href: "/admin/contenus/", libelle: "Contenus" },
] as const;

/** Les cinq rubriques de contenus : leur clé fait leur adresse (/admin/contenus/<clé>/). */
export const RUBRIQUES = [
  { cle: "programmes", nom: "Programmes et lots" },
  { cle: "chantiers", nom: "Chantiers datés" },
  { cle: "videos", nom: "Vidéos" },
  { cle: "coordonnees", nom: "Coordonnées" },
  { cle: "photos", nom: "Photos" },
] as const;

export type CleRubrique = (typeof RUBRIQUES)[number]["cle"];

export const adresseRubrique = (cle: CleRubrique) => `/admin/contenus/${cle}/`;

/**
 * Ce qui est inventé est dit. Le bandeau le dit en permanence ; une ligne le redit là
 * où on lit les chiffres (sous le profil des visites) et les demandes d'exemple (sous
 * le registre). Pas sous chaque bloc : une fois par écran suffit.
 */
export const MENTIONS = {
  chiffres: "Chiffres inventés pour la démonstration.",
  demandes: "Les demandes d’exemple sont inventées pour la démonstration.",
};

/** L'écran de connexion : une maquette. Rien à saisir, aucun mot de passe demandé. */
export const CONNEXION = {
  titrePage: "Connexion",
  nom: "Espace client",
  repere: "Démonstration",
  titre: "Votre espace client",
  mot: "client",
  chapeau: "Les demandes reçues, le trafic du site, vos contenus.",
  fiche: "Fiche d’accès",
  etat: "À venir avec le service",
  /** Les deux champs de la vraie connexion, dessinés et pas à remplir. */
  champs: ["Identifiant", "Mot de passe"],
  phrase: "La vraie connexion viendra avec le service. Ici, rien à saisir.",
  bouton: "Entrer dans la démonstration",
  retour: "Revenir au site",
};

/** Le tableau de bord. */
export const TABLEAU = {
  titre: "Tableau de bord",
  periode: {
    legende: "Période",
    /** « Du 18 octobre au 16 novembre 2026 » */
    du: "Du",
    au: "au",
  },
  trafic: {
    nom: "Trafic",
    tuiles: {
      visites: "Visites",
      visiteurs: "Visiteurs",
      pagesVues: "Pages vues",
      whatsapp: "Clics sur WhatsApp",
    },
    parJour: "par jour en moyenne",
    surCent: "visiteurs pour 100 visites",
    parVisite: "pages par visite",
    uneSur: "1 visite sur",
  },
  profil: {
    titre: "Visites par jour",
    moyenne: "Moyenne",
    sommet: "Sommet",
    unite: "visites",
    /** Le nom du curseur de lecture, pour qui ne voit pas le dessin. */
    lecture: "Lire les visites, jour par jour",
    aide: "Flèches gauche et droite : un jour de moins, un jour de plus.",
    table: "Les chiffres, jour par jour",
    colonnes: { jour: "Jour", visites: "Visites" },
  },
  pages: {
    nom: "Pages les plus vues",
    quantite: "pages",
    legende: "Les pages les plus vues sur la période, et leur part des pages vues.",
    colonnes: { nom: "Page", valeur: "Vues", part: "Part" },
  },
  provenances: {
    nom: "Provenance",
    quantite: "canaux",
    legende: "D’où viennent les visites sur la période, et la part de chaque canal.",
    colonnes: { nom: "Canal", valeur: "Visites", part: "Part" },
  },
  appareils: {
    nom: "Appareils",
    quantite: "familles",
    legende: "Sur quel appareil le site est lu sur la période, et la part de chacun.",
    colonnes: { nom: "Appareil", valeur: "Visites", part: "Part" },
  },
  demandes: {
    nom: "Dernières demandes",
    /** « 3 nouvelles », « 1 nouvelle », « Aucune nouvelle ». */
    nouvelles: "nouvelles",
    nouvelle: "nouvelle",
    aucune: "Aucune nouvelle",
    toutes: "Toutes les demandes",
  },
  contenus: {
    nom: "Contenus",
    quantite: "rubriques",
    tous: "Tous les contenus",
  },
};

/** L'écran des demandes. */
export const DEMANDES = {
  titre: "Demandes",
  chapeau: "Ce qui arrive par la fiche de la page Contact.",
  registre: "Registre",
  filtres: {
    legende: "Afficher",
    toutes: "Toutes",
    nouvelles: "Nouvelles",
    traitees: "Traitées",
  },
  colonnes: { date: "Reçue le", nom: "Nom", objet: "Objet", message: "Message", etat: "État" },
  etats: { nouvelle: "Nouvelle", traitee: "Traitée" },
  origines: {
    exemple: "Exemple",
    navigateur: "Envoyée depuis ce navigateur",
  },
  sansMessage: "Sans message",
  ouvrir: "Ouvrir",
  fiche: {
    recue: "Reçue le",
    nom: "Nom",
    telephone: "Téléphone ou WhatsApp",
    objet: "Vous cherchez",
    message: "Message",
    origine: "Origine",
    origines: {
      exemple: "Demande d’exemple, inventée pour la démonstration.",
      navigateur: "Envoyée depuis ce navigateur, par la fiche de la page Contact.",
    },
    traiter: "Marquer comme traitée",
    rouvrir: "Remettre en nouvelle",
    /** Annoncé aux lecteurs d'écran après le geste. */
    traitee: "Demande marquée comme traitée.",
    rouverte: "Demande remise en nouvelle.",
    memoire: "L’état reste en mémoire tant que la page est ouverte.",
  },
  vide: {
    toutes: "Aucune demande.",
    nouvelle: "Aucune demande nouvelle.",
    traitee: "Aucune demande traitée.",
  },
  essai: "Envoyez une demande depuis la fiche de la page Contact : elle arrive ici, dans ce navigateur.",
  lienFiche: "Ouvrir la fiche de demande",
  /**
   * Quand des demandes viennent de ce navigateur : leur compte (« {n} » devient leur
   * nombre), puis le geste qui les efface. Les demandes d'exemple restent.
   */
  duNavigateur: {
    une: "1 demande vient de ce navigateur. Elle n’est gardée qu’ici.",
    plusieurs: "{n} demandes viennent de ce navigateur. Elles ne sont gardées qu’ici.",
    effacerUne: "Effacer cette demande",
    effacerPlusieurs: "Effacer ces demandes",
    /** Annoncé aux lecteurs d'écran après le geste. */
    effacee: "Demande effacée de ce navigateur.",
    effacees: "Demandes effacées de ce navigateur.",
  },
};

/** L'écran des contenus : la liste des rubriques. */
export const CONTENUS = {
  titre: "Contenus",
  chapeau: "Ce que le site affiche, rubrique par rubrique. Quand un fait vient d’une vidéo ou d’une publication, elle est citée, avec sa date.",
  /** Le nom du bloc : il ne redit pas le mot de sa quantité (« 5 rubriques »). */
  sommaire: "Sommaire",
  quantite: "rubriques",
  legende: "Les rubriques de contenus du site. Le nom de chaque rubrique mène à ses fiches.",
  colonnes: { rubrique: "Rubrique", contenu: "Ce qu’elle contient", pages: "Où elle s’affiche" },
};

/**
 * Les fiches de contenus : ce que l'espace client écrit autour des valeurs du site. Ce
 * qu'est une fiche, et les précisions sous certains champs. Les valeurs, elles, ne
 * sont jamais écrites ici : components/admin/rubriques.ts les lit dans src/content.
 */
export const FICHES = {
  sortes: {
    programme: "Programme en vente",
    offre: "Offre datée",
    autreSite: "Autre site",
    realisation: "Réalisation",
  },
  aides: {
    video: "Elle se règle dans la rubrique Vidéos.",
    photo: "Elle se règle dans la rubrique Photos.",
    /** Devant le titre de la vidéo liée à une date du calendrier. */
    videoLiee: "Vidéo liée :",
    sansAdresse: "Sans adresse stable : la source est citée sans lien.",
    alt: "Lu à la place de la photo par un lecteur d’écran.",
    legende: "À gauche sous la photo. La nature s’écrit à droite.",
    cadrage: "Le point de la photo qui reste dans le cadre.",
    largeur: "Au-delà, la photo serait plus large que son fichier.",
  },
};

/** L'écran d'une rubrique : ses fiches, et la fiche ouverte, en champs. */
export const EDITEUR = {
  /** Au-dessus de la liste, après le nombre de fiches : « 6 fiches ». */
  quantite: "fiches",
  /** Le nom de la liste des fiches, pour qui ne la voit pas. */
  liste: "Fiches de la rubrique",
  retour: "Toutes les fiches",
  colonnes: { cle: "Champ", valeur: "Valeur du site", source: "Source et date" },
  /** La clé de la source, sous un champ, quand elle n'a pas sa colonne. Sans source, celle de la date. */
  source: "Source",
  date: "Date",
  conforme: "Conforme au site",
  modifie: "Modifié",
  /** « 1 champ modifié », « 3 champs modifiés ». */
  champModifie: "champ modifié",
  champsModifies: "champs modifiés",
  enregistrer: "Enregistrer",
  retablir: "Rétablir",
  /** Le nom entier du bouton, pour qui ne voit pas l'écran. */
  retablirLong: "Rétablir les valeurs du site",
  /** Le message de la maquette : exigé mot pour mot. */
  message: "Maquette : la modification n’est pas enregistrée.",
  vide: "Vide",
  fixe: "Ne se modifie pas ici",
  ouvrir: "Ouvrir",
  apercu: "Aperçu",
  /** Sous une fiche qui porte une source ou une date. */
  legendeSources: "Source : la publication d’où vient le fait. Date : celle que le fait porte.",
};
