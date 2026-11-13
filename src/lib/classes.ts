// Combinaisons typographiques figées (recherche/allegement.md, 2.4).
// Cinq tailles, une famille. Ne pas en réinventer dans les pages.
//
// Titres (h1, h2, h3) : jamais de point final. Seule exception, un titre de deux
// phrases (le h1 de l'accueil). Un titre-question garde son « ? ».

/** h1 : 72 px au bureau, 40 sur mobile, largeur étroite. */
export const T1 = "text-h1 font-bold leading-none tracking-title stretch-title";

/** h2 : 44 px au bureau, 30 sur mobile, largeur étroite. */
export const T2 = "text-h2 font-650 leading-tight tracking-tight stretch-title";

/** h3 : 22 px au bureau, 19 sur mobile, largeur normale. La moitié du h2 au plus. */
export const T3 = "text-h3 font-semibold leading-snug";

/** Chapeau : taille du h3, graisse normale, gris. */
export const CHAPEAU = "text-h3 leading-snug text-ink-2";

/** Légende ou note : 14 px, gris. */
export const NOTE = "text-small text-ink-2";

/** Espacement vertical (2.7) : entre deux blocs, et entre un titre et son texte. */
export const ENTRE_BLOCS = "mt-8 desk:mt-12";
export const SOUS_TITRE = "mt-4 desk:mt-6";

/**
 * Colonne de texte : 680 px au plus, alignée à gauche. Un bloc court (titre et
 * quelques lignes) tient dans une seule colonne ; deux colonnes seulement quand il
 * y a une photo ou deux contenus de même poids.
 */
export const COLONNE = "max-w-[42.5rem]";
