import type { NextConfig } from "next";

// Sous-chemin du site sur GitHub Pages (ex. "/saloum-immo-maquette").
// Vide en local : le site reste servi à la racine.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // next dev ne réécrit plus AGENTS.md (son bloc géré contient des tirets cadratins).
  agentRules: false,
  // Pas de cacheComponents ni de PPR : incompatibles avec l'export statique.
  // Pas de next/image : components/photo.tsx écrit le srcset des variantes réelles
  // (scripts/photos.mjs), sans optimiseur.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
