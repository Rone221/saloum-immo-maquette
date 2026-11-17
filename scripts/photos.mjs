// Variantes WebP des photos du client.
//
// Lit les originaux dans ../recherche/web/ (ou dans PHOTOS_SOURCE), écrit dans
// public/photos/ les variantes WebP et photos.json, et dans public/ les logos PNG.
// Les originaux ne sont pas dans le dépôt : ce script se lance à la main quand la
// liste change (npm run photos), et son résultat est versionné.
//
// Seules les photos publiées sont traitées (recherche/allegement.md, « Photos par
// page »). Aucune photo interdite ne figure dans la liste. Revue 3 : 2493 (un
// tee-shirt imprimé) et 2534 (un panneau publicitaire) n'y sont plus. 2351 (la vitrine
// et ses affiches) non plus : aucune page ne la montrait. Ni 2529, ni la capture entière
// de l'interview (son buste recadré, lui, est publié).

import sharp from "sharp";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(process.env.PHOTOS_SOURCE ?? join(RACINE, "../recherche/web"));
const SORTIE = join(RACINE, "public/photos");
// 2560 : les vues drone d'origine, dessinées en pleine largeur.
const LARGEURS = [320, 480, 800, 1200, 1600, 2000, 2560];
const QUALITE = 80;

// id publié, fichier source, recadrage éventuel en pixels de l'original.
// Une entrée par photo publiée (src/content/photos.ts). Revue 3 : 2538 et 2580 sont
// deux lotissements différents (inventaire.md) ; les vues drone viennent des
// originaux de 2 560 px (les fichiers « -2560 »).
const PHOTOS = [
  // Accueil : l'ouverture (vue d'en haut d'un lotissement), puis les programmes.
  { id: "2538", fichier: "2538-2560.png" },
  { id: "2616", fichier: "2616.jpg" },
  { id: "2580", fichier: "2580-2560.png" },
  { id: "2542", fichier: "2542-2560.jpg" },
  // Planche des gestes du chantier (accueil) : la borne, les bordures, et l'image à
  // 27 s du film de présentation (chargeuse qui déverse la latérite), sans le logo
  // incrusté (x < 140) ni le sous-titre (y > 405).
  { id: "2528", fichier: "2528.jpg" },
  { id: "2501", fichier: "2501.jpg" },
  { id: "ig-DbLzsuzO_wN-27s", fichier: "ig/extras/2026-07-24_DbLzsuzO_wN_t27s.jpg", recadrage: { left: 140, top: 0, width: 759, height: 405 } },
  // Le document montré dans la vidéo sur le NICAD (image à 20 s), sans le logo incrusté.
  { id: "ig-DexPGrbBztC-20s", fichier: "ig/extras/2026-10-21_DexPGrbBztC_t20s.jpg", recadrage: { left: 90, top: 0, width: 449, height: 304 } },
  // Diaspora : une visite sur le terrain.
  { id: "2333", fichier: "2333.jpg" },
  // Pages intérieures (revue 3). Aménager : terrassement, électricité, la vue d'ensemble
  // d'un lotissement (même lotissement que 2538 : jamais sur la même page).
  { id: "2495", fichier: "2495.jpg" },
  { id: "2517", fichier: "2517.jpg" },
  { id: "2519", fichier: "2519.jpg" },
  { id: "2540", fichier: "2540-2560.png" },
  // Diaspora : des visites sur le terrain, avec des acheteurs (visages : petit).
  { id: "2388", fichier: "2388.jpg" },
  { id: "2491", fichier: "2491.jpg" },
  { id: "2509", fichier: "2509.jpg" },
  // Sicap Keur Massar en hauteur : 2616 sans son grand ciel (y < 480).
  { id: "2616-bas", fichier: "2616.jpg", recadrage: { left: 0, top: 480, width: 2000, height: 784 } },
  // Babacar Ndiaye : le buste, sans le logo incrusté (x < 250) ni le capot de
  // l'ordinateur au premier plan (y > 405).
  { id: "ig-DZUeyGKPdj_-buste", fichier: "ig/2026-06-08_DZUeyGKPdj_.jpg", recadrage: { left: 250, top: 0, width: 540, height: 405 } },
  // Fiche Sakina City : la photo de droite de la planche, sans logo ni titre incrusté.
  { id: "2413-droite", fichier: "2413.jpg", recadrage: { left: 962, top: 278, width: 846, height: 458 } },
  // Captures : interview du DG (accueil, À propos), collaboratrice (Diaspora).
  { id: "ig-DfAoxMkAbKR", fichier: "ig/2026-10-27_DfAoxMkAbKR.jpg" },
  // Aménager : les étapes.
  { id: "2502", fichier: "2502.jpg" },
  { id: "2355", fichier: "2355.jpg" },
  { id: "2516", fichier: "2516.jpg" },
  // À propos
  { id: "2499", fichier: "2499.jpg" },
  { id: "2537", fichier: "2537-2560.png" },
  // Accueil et Contact : 2352 coupée au-dessus de l'affiche de la vitrine (y 670) :
  // ses numéros ne sont pas publiés.
  { id: "2352-haut", fichier: "2352.jpg", recadrage: { left: 0, top: 0, width: 1080, height: 650 } },
];

// Logos : réduits sans recadrage ni recoloriage.
// - 2269-logo.png, le logo officiel complet, copié tel quel (partage social) ;
// - le même, réduit pour le cartouche, où il s'affiche à 176 px au plus (140 sur
//   mobile) : 176, 352 et 528 px de large, en srcset (densités 1 à 3) ;
// - le logo horizontal de l'en-tête, affiché de 40 à 52 px de haut (136 px de large
//   au plus) : 420 px de large suffisent en densité 3 ;
// - l'icône de l'onglet (32 px) et de l'écran d'accueil (180 px) : le logo officiel
//   posé au centre d'un carré blanc ;
// - la carte de partage (og:image, 1 200 × 630) : le logo officiel complet, à 480 px
//   de haut, au centre d'un fond blanc. Un PNG transparent sort sur fond noir dans
//   certaines applications.
const BLANC = { r: 255, g: 255, b: 255, alpha: 1 };
const LOGOS = [
  { sortie: "2269-logo.png", source: "2269-logo.png" },
  { sortie: "2269-logo-176.png", source: "2269-logo.png", largeur: 176 },
  { sortie: "2269-logo-352.png", source: "2269-logo.png", largeur: 352 },
  { sortie: "2269-logo-528.png", source: "2269-logo.png", largeur: 528 },
  { sortie: "2269-logo-horizontal-420.png", source: "2269-logo-horizontal.png", largeur: 420 },
  { sortie: "2269-icone-32.png", source: "2269-logo.png", carre: 32 },
  { sortie: "2269-icone-180.png", source: "2269-logo.png", carre: 180 },
  { sortie: "2269-partage.png", source: "2269-logo.png", carte: { largeur: 1200, hauteur: 630, logo: 480 } },
];

if (!existsSync(SOURCE)) {
  console.error(`photos : dossier source introuvable (${SOURCE}). Passer PHOTOS_SOURCE=chemin.`);
  process.exit(1);
}

mkdirSync(SORTIE, { recursive: true });
for (const nom of readdirSync(SORTIE)) {
  if (nom.endsWith(".webp") || nom === "photos.json") rmSync(join(SORTIE, nom));
}

const manifeste = {};
let fichiers = 0;

for (const photo of PHOTOS) {
  const chemin = join(SOURCE, photo.fichier);
  if (!existsSync(chemin)) {
    console.error(`photos : ${photo.fichier} introuvable dans ${SOURCE}`);
    process.exit(1);
  }
  const base = () => {
    const img = sharp(chemin).rotate();
    return photo.recadrage ? img.extract(photo.recadrage) : img;
  };
  const meta = await base().toBuffer({ resolveWithObject: true });
  const largeur = meta.info.width;
  const hauteur = meta.info.height;

  // Les largeurs standard qui ne dépassent pas l'original, plus la largeur
  // d'origine quand elle tombe entre deux paliers.
  const variantes = LARGEURS.filter((l) => l <= largeur);
  if (largeur < 2000 && !variantes.includes(largeur)) variantes.push(largeur);

  for (const l of variantes) {
    await base()
      .resize({ width: l, withoutEnlargement: true })
      .webp({ quality: QUALITE, effort: 5 })
      .toFile(join(SORTIE, `${photo.id}-${l}.webp`));
    fichiers++;
  }
  manifeste[photo.id] = { largeur, hauteur, variantes };
}

writeFileSync(join(SORTIE, "photos.json"), JSON.stringify(manifeste, null, 2) + "\n");

for (const logo of LOGOS) {
  const source = join(SOURCE, logo.source);
  const sortie = join(RACINE, "public", logo.sortie);
  if (logo.largeur) {
    await sharp(source).resize({ width: logo.largeur }).png({ compressionLevel: 9 }).toFile(sortie);
  } else if (logo.carte) {
    const { largeur, hauteur, logo: haut } = logo.carte;
    const image = await sharp(source).resize({ height: haut }).png().toBuffer();
    await sharp({ create: { width: largeur, height: hauteur, channels: 4, background: BLANC } })
      .composite([{ input: image, gravity: "centre" }])
      .flatten({ background: BLANC })
      .png({ compressionLevel: 9 })
      .toFile(sortie);
  } else if (logo.carre) {
    await sharp(source)
      .resize({ width: logo.carre, height: logo.carre, fit: "contain", background: BLANC })
      .flatten({ background: BLANC })
      .png({ compressionLevel: 9 })
      .toFile(sortie);
  } else {
    copyFileSync(source, sortie);
  }
}

console.log(`photos : ${PHOTOS.length} photos, ${fichiers} variantes WebP, ${LOGOS.length} logos.`);
