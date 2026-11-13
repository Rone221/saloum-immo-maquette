# Saloum Immo : maquette du nouveau site

Proposition de site, direction « Relevé », version allégée : papier blanc, une seule famille de lettres (Archivo), de grandes photos du client, des tableaux de faits courts et une coupe dessinée sur la page Aménager. Chaque fait affiché vient d'une publication de Saloum Immo.

En ligne : https://rone221.github.io/saloum-immo-maquette/

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

Le build enchaîne trois étapes : `next build` (export statique dans `out/`), `scripts/flatten-rsc.mjs` (copie à plat des fichiers de préchargement, sans quoi GitHub Pages renvoie des 404 entre les pages), puis `scripts/garde-fous.mjs`, qui échoue sur une couleur, une police, une classe, un mot, une étiquette, une date en chiffres ou une photo interdits, et sur deux photos du même lotissement dans une page.

Pour tester le sous-chemin de GitHub Pages : `NEXT_PUBLIC_BASE_PATH=/saloum-immo-maquette npm run build`. Sous Git Bash (Windows), préfixer par `MSYS_NO_PATHCONV=1`, sinon le chemin est converti en chemin Windows et le build s'arrête.

Après un build, `npm run liens` (avec le même `NEXT_PUBLIC_BASE_PATH`) vérifie que chaque lien, image, script, feuille de style et police des pages d'`out/` mène à un fichier existant, que chaque ancre existe, que le sous-chemin est partout, et liste les liens externes avec leur forme.

## Où modifier quoi

- `src/content/` : tous les faits affichés, chacun avec sa source et son statut (`ok` ou `a-valider`). Rien n'est écrit en dur dans les composants.
- `src/components/` : les composants, dont la coupe (`coupe.tsx`, `coupe.css`).
- `src/app/globals.css` : les jetons (couleurs, cinq tailles, rayons, points de rupture) ; `src/lib/classes.ts` : les combinaisons typographiques.
- `public/photos/` : variantes WebP des photos du client, produites par `npm run photos` à partir des originaux (hors dépôt). Le résultat est versionné.

## Déploiement

Chaque push sur `main` lance `.github/workflows/deploy.yml` : build en export statique, puis publication sur GitHub Pages. Le workflow passe le sous-chemin via `NEXT_PUBLIC_BASE_PATH`.
