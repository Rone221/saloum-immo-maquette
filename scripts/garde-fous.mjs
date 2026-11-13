// Garde-fous automatiques (spécification, annexe B ; recherche/allegement.md).
// Parcourt src/, scripts/, public/ (noms des photos) et out/ après le build.
// Échoue au premier passage qui trouve une occurrence interdite.
//
// Le tiret cadratin est construit par String.fromCharCode : le caractère
// lui-même n'est écrit nulle part, ce fichier compris.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CADRATIN = String.fromCharCode(0x2014);

// Couleurs de la palette (les seules autorisées en hexadécimal).
const COULEURS = new Set(["#FFFFFF", "#EFF2F6", "#0A1220", "#465264", "#C9D2DE", "#004EBF", "#EB8624", "#9B4724", "#9AA6B5"]);

const PHOTOS_INTERDITES =
  "2321|2322|2323|2335|2336|2337|2338|2339|2353|2354|2366|2392|2412|2420|2422|2510|2518|2531|2533|2543|2544|2548|2549";

/** Familles de règles. `ou` : à quels fichiers elles s'appliquent. */
const REGLES = [
  { nom: "tiret cadratin", re: new RegExp(CADRATIN, "g"), ou: "tout" },

  // Les motifs de l'annexe B, avec (?<![\w-]) devant : une classe, pas le nom d'une
  // variable CSS. Sans cela, la remise à zéro des jetons de Tailwind exigée par la
  // spécification (« --shadow-*: initial ») se signalerait elle-même.
  { nom: "classe : rayon interdit", re: /(?<![\w-])rounded-(full|sm|md|lg|xl|2xl|3xl)\b/g, ou: "code" },
  { nom: "classe : ombre", re: /(?<![\w-])(shadow|drop-shadow|inset-shadow)-/g, ou: "code" },
  { nom: "classe : flou", re: /(?<![\w-])blur-/g, ou: "code" },
  { nom: "classe : dégradé", re: /(?<![\w-])bg-(linear|radial|conic|gradient)/g, ou: "code" },
  { nom: "classe : animation", re: /(?<![\w-])animate-/g, ou: "code" },

  { nom: "police interdite", re: /\b(Geist|Schibsted|Barlow|Inter|Roboto|Poppins|Montserrat|Playfair|Fraunces)\b/g, ou: "code" },
  { nom: "police serif", re: /\bfont-serif\b|ui-serif|Georgia/g, ou: "code" },
  // Une seule famille, Archivo : la mono disparaît, dates et numéros de lots compris
  // (allegement.md, 2.4).
  { nom: "police mono", re: /\bfont-mono\b|IBM_Plex_Mono|Plex Mono|--font-plex-mono/g, ou: "code" },

  { nom: "dépendance interdite", re: /phosphor|lucide|heroicons|"motion"|framer-motion/g, ou: "package" },

  { nom: "image de banque", re: /unsplash|pexels|i\.ytimg\.com/gi, ou: "code" },
  { nom: "photo interdite (4.4)", re: new RegExp(`photos/(${PHOTOS_INTERDITES})\\b`, "g"), ou: "code" },

  {
    nom: "mot interdit",
    re: /Découvrez|Bienvenue|N['’]attendez plus|\bexcellence\b|\bleader\b|\bpremium\b|paiement échelonné|\b0 ?%|20 ans d|50K|\+123/gi,
    ou: "texte",
  },

  // Étiquettes supprimées partout (allegement.md, 2.5) et dates en chiffres (2.4),
  // cherchées dans les pages produites : les sources des données gardent leurs dates.
  {
    nom: "étiquette supprimée",
    re: /Message envoyé|Message à compléter|Non publié|Statut foncier, dans nos dessins|\.{8}/g,
    ou: "page",
  },
  { nom: "date en chiffres", re: /(?<![\d.])\d{2}\.\d{2}\.\d{4}(?![\d.])/g, ou: "page" },


  { nom: "couleur hors palette", re: /#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?(?![0-9A-Za-z_-])/g, ou: "style", filtre: (m) => !COULEURS.has(m.slice(0, 7).toUpperCase()) },
];

// Notes internes : les expressions interdites dans le code vivent hors du dépôt public,
// dans ../recherche/garde-fous-internes.txt (une expression par ligne, # pour un
// commentaire). Sans ce fichier, par exemple sur le serveur de déploiement, la règle
// est sautée : le contrôle se fait sur le poste, avant l'envoi.
const FICHIER_INTERNE = resolve(RACINE, "..", "recherche", "garde-fous-internes.txt");
if (existsSync(FICHIER_INTERNE)) {
  const termes = readFileSync(FICHIER_INTERNE, "utf8")
    .split(/\r?\n/)
    .map((ligne) => ligne.trim())
    .filter((ligne) => ligne && !ligne.startsWith("#"));
  if (termes.length) {
    REGLES.push({ nom: "note interne", re: new RegExp(termes.join("|"), "gi"), ou: "code" });
  }
}


// Fichiers à parcourir, rangés par nature.
const EXT_SOURCE = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json", ".md"]);
const EXT_OUT = new Set([".html", ".css", ".txt", ".js", ".json"]);

function lister(dossier, extensions) {
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier).flatMap((nom) => {
    const p = join(dossier, nom);
    if (statSync(p).isDirectory()) return lister(p, extensions);
    return extensions.has(extname(nom)) ? [p] : [];
  });
}

/** Ce qui est à nous, et ce que le build a produit. */
function nature(fichier) {
  const rel = relative(RACINE, fichier).split("\\").join("/");
  const ext = extname(fichier);
  // Le code de React et de Next dans out/ n'est pas le nôtre : seuls le tiret
  // cadratin et les images y sont cherchés. Nos composants sont vérifiés dans src/.
  const tiers = rel.startsWith("out/_next/static/chunks/") && ext === ".js";
  return { rel, ext, tiers };
}

function applicable(regle, { rel, ext, tiers }) {
  if (regle.ou === "tout") return true;
  if (regle.ou === "package") return rel === "package.json";
  if (regle.ou === "page") return rel.startsWith("out/") && ext === ".html";
  if (rel === "package.json" || rel === "package-lock.json") return false;
  if (rel.startsWith("scripts/garde-fous")) return false; // les motifs eux-mêmes
  if (tiers) return regle.nom === "image de banque" || regle.nom === "photo interdite (4.4)";
  if (regle.ou === "code") return true;
  // Les mots : textes du site (sources et pages produites), pas les feuilles de style.
  if (regle.ou === "texte") return [".ts", ".tsx", ".html", ".txt", ".md"].includes(ext);
  // Les couleurs : feuilles de style, composants, pages.
  if (regle.ou === "style") return [".css", ".tsx", ".ts", ".html"].includes(ext);
  return false;
}

const fichiers = [
  ...lister(join(RACINE, "src"), EXT_SOURCE),
  ...lister(join(RACINE, "scripts"), EXT_SOURCE),
  join(RACINE, "package.json"),
  join(RACINE, "next.config.ts"),
  join(RACINE, "README.md"),
  ...lister(join(RACINE, "out"), EXT_OUT),
].filter((f) => existsSync(f));

const fautes = [];
for (const fichier of fichiers) {
  const n = nature(fichier);
  const texte = readFileSync(fichier, "utf8");
  for (const regle of REGLES) {
    if (!applicable(regle, n)) continue;
    for (const m of texte.matchAll(regle.re)) {
      if (regle.filtre && !regle.filtre(m[0])) continue;
      const ligne = texte.slice(0, m.index).split("\n").length;
      const extrait = texte.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).replace(/\s+/g, " ");
      fautes.push(`${n.rel}:${ligne}  [${regle.nom}]  ${m[0]}  …${extrait}…`);
    }
  }
}

// Les fichiers de photos publiés : aucun numéro interdit.
const dossierPhotos = join(RACINE, "public/photos");
if (existsSync(dossierPhotos)) {
  const interdit = new RegExp(`^(${PHOTOS_INTERDITES})\\b`);
  for (const nom of readdirSync(dossierPhotos)) {
    if (interdit.test(nom)) fautes.push(`public/photos/${nom}  [photo interdite (4.4)]`);
  }
}

// Une page ne montre jamais deux photos du même lotissement ou du même instant
// (allegement.md, partie 4) : tout le groupe, pas seulement le couple 2538 / 2580.
const GROUPES = [
  ["2538", "2553", "2580", "2421"],
  ["2493", "2500"],
  ["2502", "2505"],
  ["2355", "2350"],
  ["2499", "2498", "2496"],
];
for (const fichier of lister(join(RACINE, "out"), new Set([".html"]))) {
  const texte = readFileSync(fichier, "utf8");
  const vues = new Set([...texte.matchAll(/photos\/(\d{4})[\w-]*?-\d{3,4}\.webp/g)].map((m) => m[1]));
  for (const groupe of GROUPES) {
    const presentes = groupe.filter((id) => vues.has(id));
    if (presentes.length > 1) {
      fautes.push(`${nature(fichier).rel}  [même lotissement ou même instant]  ${presentes.join(" et ")}`);
    }
  }
}

if (!existsSync(join(RACINE, "out"))) {
  console.warn("garde-fous : pas de dossier out/, seules les sources ont été vérifiées.");
}

if (fautes.length) {
  console.error(`garde-fous : ${fautes.length} occurrence(s) interdite(s).\n`);
  for (const f of fautes.slice(0, 200)) console.error("  " + f);
  process.exit(1);
}
console.log(`garde-fous : ${fichiers.length} fichiers vérifiés, rien à signaler.`);
