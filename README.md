# Saloum Immo : maquette du nouveau site

Proposition de site, direction « Du plan au terrain » : le site se lit comme un plan de lotissement posé sur leur vrai terrain. Bleu de plan, sable à croisillons, latérite pour l'accent et pour les boutons. Deux familles de lettres : Besley pour les titres, Archivo pour le texte, Archivo large pour les mesures et les étiquettes. Chaque fait affiché vient d'une publication de Saloum Immo.

Les signes sont ceux d'un plan, et ils disent la même chose sur toutes les pages : trait mixte pour un axe, tirets pour ce qui est en cours, pointillé pour ce qui n'est pas sûr, trait plein entre deux bornes pour ce qui est acquis, hachures pour le sol. Rien n'est inventé pour le décor : ni coordonnées, ni échelle, ni cachet.

Le mouvement est en CSS (apparitions, traits qui se tirent au défilement), sans bibliothèque. Quelques scripts courts font ce que le CSS ne sait pas faire : la lunette sur les vues au drone, la coupe qui suit l'étape lue, le tirage photo qui suit le curseur dans l'index des terrains, la voie de lecture au bord de la page. Tout s'arrête avec `prefers-reduced-motion`, et chaque page reste entière sans script.

En ligne : https://rone221.github.io/saloum-immo-maquette/

## Les pages

- Accueil, Terrains et ses quatre fiches, Aménager votre terrain, Comprendre le foncier, Depuis l'étranger, À propos, Contact, page introuvable.
- Un espace client de démonstration, sous `/admin/` : tableau de bord, demandes, contenus. Lien au pied du site.

L'espace client est une interface seule. Il n'y a ni serveur ni base de données. Les chiffres de trafic et les demandes d'exemple sont inventés pour la démonstration, et chaque écran le dit. Une demande envoyée depuis la fiche de la page Contact n'est transmise à personne : elle reste dans le navigateur (`localStorage`) et se relit dans l'espace client du même navigateur.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Construire

```bash
npm run build
```

Le build enchaîne trois étapes : `next build` (export statique dans `out/`), `scripts/flatten-rsc.mjs` (copie à plat des fichiers de préchargement, sans quoi GitHub Pages renvoie des 404 entre les pages), puis `scripts/garde-fous.mjs`, qui échoue sur une couleur hors palette, une police, une classe, un mot, une étiquette, une date en chiffres ou une photo interdits, sur deux photos du même lotissement dans une page, et sur une photo hors programme affichée sur plus de deux pages.

Pour tester le sous-chemin de GitHub Pages : `NEXT_PUBLIC_BASE_PATH=/saloum-immo-maquette npm run build`. Sous Git Bash (Windows), préfixer par `MSYS_NO_PATHCONV=1`, sinon le chemin est converti en chemin Windows et le build s'arrête.

Après un build, `npm run liens` (avec le même `NEXT_PUBLIC_BASE_PATH`) vérifie que chaque lien, image, script, feuille de style et police des pages d'`out/` mène à un fichier existant, que chaque ancre existe, que le sous-chemin est partout, et liste les liens externes avec leur forme.

## Où modifier quoi

- `src/content/` : tous les faits affichés, chacun avec sa source et son statut (`ok` ou `a-valider`). Rien n'est écrit en dur dans les composants. `src/content/pages/` : les textes propres à chaque page. `src/content/demo/` : les données de démonstration de l'espace client.
- `src/components/` : les pièces. Communes à toutes les pages : `section.tsx` (les quatre surfaces), `en-tete-section.tsx` (la borne numérotée et le nom de la section), `mot-cote.tsx` (le mot du titre posé sur une cote), `cartouche.tsx` et `ligne-cartouche.tsx`, `photo.tsx` (cadre et légende à deux colonnes), `carte-video.tsx`, `boutons.tsx`, `appel-final.tsx`, `voie-lecture.tsx`, `pied.tsx`. Propres à une pièce : `ouverture-plan.tsx` et `lunette.tsx` (l'ouverture de l'accueil), `index-terrains.tsx` (le tableau des programmes), `methode.tsx` et `coupe.tsx` (la coupe d'une voie), `echelle-papiers.tsx`, `registre-travaux.tsx`, `formulaire-demande.tsx` (la fiche de la page Contact), `admin/` (l'espace client).
- `src/app/globals.css` : les jetons (couleurs, tailles, points de rupture), les surfaces et leurs couleurs de rôle, les traits du plan, les apparitions. `src/lib/classes.ts` : les combinaisons typographiques.
- `src/lib/demandes.ts` : les deux fonctions qui gardent et relisent une demande dans le navigateur. Le jour où un service existera, elles seules changeront.
- `public/photos/` : variantes WebP des photos du client, produites par `npm run photos` à partir des originaux (hors dépôt). Le résultat est versionné.

## Déploiement

Chaque push sur `main` lance `.github/workflows/deploy.yml` : build en export statique, puis publication sur GitHub Pages. Le workflow passe le sous-chemin via `NEXT_PUBLIC_BASE_PATH`.
