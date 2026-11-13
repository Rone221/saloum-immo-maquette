import type { Metadata } from "next";
import { Suspense } from "react";
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Catalogue, CatalogueSkeleton } from "@/components/catalogue";
import { btnPrimary, container } from "@/components/ui";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terrains et maisons à vendre",
  description: "Parcelles en titre foncier ou en bail à Kounoune, Diass, Niague et Bayakh, maisons aux Almadies.",
};

export default function TerrainsPage() {
  return (
    <div className={`${container} pb-24 pt-10 md:pt-14`}>
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
          Terrains et maisons à vendre
        </h1>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted">
          Chaque offre affiche son statut juridique, sa surface et son prix. Filtrez, comparez, puis réservez une visite.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<CatalogueSkeleton />}>
          <Catalogue />
        </Suspense>
      </div>

      <aside className="mt-20 grid items-center gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Vous ne trouvez pas votre terrain ?</h2>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted">
            Donnez-nous votre zone et votre budget. Nous vous envoyons les offres qui correspondent, avant leur mise en ligne.
          </p>
        </div>
        <a
          href={waLink("Bonjour Saloum Immo, je cherche un terrain. Ma zone : ... Mon budget : ...")}
          target="_blank"
          rel="noopener"
          className={btnPrimary}
        >
          <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
          WhatsApp
        </a>
      </aside>
    </div>
  );
}
