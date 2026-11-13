# Saloum Immo : maquette du nouveau site

Maquette cliquable présentée au client. Prix, disponibilités et photos sont indicatifs.

En ligne : https://rone221.github.io/saloum-immo-maquette/

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Déploiement

Chaque push sur `main` lance `.github/workflows/deploy.yml` : build en export statique, puis publication sur GitHub Pages.

- Le site est servi sous `/<nom du dépôt>/`. Le workflow passe ce chemin via `NEXT_PUBLIC_BASE_PATH`.
- Pour tester l'export en local : `NEXT_PUBLIC_BASE_PATH=/saloum-immo-maquette npm run build`, puis servir le dossier parent de `out/` sous ce chemin.
- `scripts/flatten-rsc.mjs` recopie à plat les fichiers de préchargement de Next. Sans ça, GitHub Pages renvoie des 404 sur la navigation entre pages.
- Pas de `cacheComponents` : incompatible avec l'export statique.

## Où modifier quoi

- `src/lib/data.ts` : programmes, offres, statuts fonciers, photos, actualités, FAQ.
- `src/lib/site.ts` : coordonnées, navigation, lien WhatsApp.
- `src/app/globals.css` : couleurs (clair et sombre), rayons, animations.
- `src/components/` : plan de lotissement, simulateur, catalogue, formulaires.

## À remplacer avant la mise en ligne réelle

- Photos Unsplash par les photos et vidéos drone du client.
- Wordmark provisoire par le logo officiel en SVG.
- Prix, lots et statuts par les données réelles.
- Formulaires simulés par un vrai envoi (email ou CRM).
- `robots: noindex` dans `src/app/layout.tsx`.
