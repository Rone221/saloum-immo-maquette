// Loader d'images pour l'export statique (GitHub Pages n'a pas d'optimiseur d'images).
// Unsplash redimensionne lui-même : on réécrit la largeur et la qualité dans l'URL.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 78));
  url.searchParams.set("auto", "format");
  return url.toString();
}
