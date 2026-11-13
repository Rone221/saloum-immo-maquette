import type { NextConfig } from "next";

// Sous-chemin du site sur GitHub Pages (ex. "/saloum-immo-maquette").
// Vide en local : le site reste servi à la racine.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // Pas de cacheComponents ni de PPR : incompatibles avec l'export statique.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
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
