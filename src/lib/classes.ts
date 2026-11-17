// Combinaisons typographiques figées (direction v4, « Lettres »). Trois voix, chacune
// son rôle, jamais croisées : Besley pour les titres, Archivo pour le texte, Archivo
// large pour ce qui se mesure (`mesure`) et ce qui s'étiquette (`etiquette`).
// Ne pas en réinventer dans les pages. La notice : recherche/revue-4/v4/fondations.md.
//
// Titres (h1, h2, h3) : jamais de point final. Seule exception, un titre de deux
// phrases (le h1 de l'accueil). Un titre-question garde son « ? ».
// La couleur n'est pas dans ces classes : un titre prend la valeur forte de sa
// surface (encre sur clair, blanc sur le plan et la latérite), voir globals.css.

/** h1 de l'accueil : Besley 400, 40 px à 390, 88 px à 1 440, deux lignes au bureau. */
export const TITRE_ACCUEIL = "titre text-hero";

/** h1 d'une page : Besley 400, 36 à 72 px. */
export const T1 = "titre text-h1";

/** h2 : Besley 400, 32 à 56 px. */
export const T2 = "titre text-h2";

/** h3 : Besley 400, 22 px sur mobile, 26 au bureau. */
export const T3 = "titre text-h3";

/** Nom d'un programme (index, tableau, fiche) : Besley 400, 28 à 40 px. */
export const NOM = "titre text-nom";

/** Chapeau : Archivo, 19 px sur mobile, 22 au bureau. Jamais en Besley. */
export const CHAPEAU = "text-chapeau";

/** Légende ou note : 14 px, dans la couleur douce de la surface. */
export const NOTE = "text-small text-doux";

/**
 * Étiquette : 12 px, capitales, voix large. Têtes de section, clés de cartouche, têtes
 * de colonne, nature d'une photo. Rien de plus petit sur le site.
 */
export const ETIQUETTE = "etiquette text-doux";

/**
 * Espacement vertical : entre l'en-tête de section (la borne et sa limite) et le
 * titre, entre deux blocs, entre un titre et son texte.
 */
export const SOUS_BORNE = "mt-8 desk:mt-10";
export const ENTRE_BLOCS = "mt-8 desk:mt-12";
export const SOUS_TITRE = "mt-4 desk:mt-6";

/**
 * Colonne de texte : 680 px au plus, alignée à gauche. Un bloc court (titre et
 * quelques lignes) tient dans une seule colonne ; deux colonnes seulement quand il
 * y a une photo ou deux contenus de même poids.
 */
export const COLONNE = "max-w-[42.5rem]";

/**
 * Le bouton (direction v4, pièce 13), sur un lien comme sur un vrai <button> : les mêmes
 * habits dans components/boutons.tsx, la fiche de demande et l'espace client. La taille
 * et la transition restent à qui le pose.
 * Forme : angles vifs, filet de 1,5 px, texte centré en 600, l'appui qui enfonce.
 */
export const BOUTON_FORME =
  "group inline-flex items-center justify-center gap-3 rounded-0 border-[1.5px] text-center font-semibold leading-snug active:scale-[0.98]";
/** Plein, l'action principale : latérite sur clair, latérite vive sur le plan, blanc sur la latérite. Les couleurs suivent la surface. */
export const BOUTON_PLEIN =
  "border-(--r-bouton) bg-(--r-bouton) text-(--r-bouton-texte) hover:border-(--r-bouton-survol) hover:bg-(--r-bouton-survol) hover:text-(--r-bouton-survol-texte)";
/** Contour, l'action seconde : encre sur clair, blanc sur le plan. */
export const BOUTON_CONTOUR = "border-fort text-fort hover:bg-fort hover:text-fond";
/** Sur un vrai <button> : le curseur, et l'état éteint. */
export const BOUTON_VRAI = "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
