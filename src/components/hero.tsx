import { CREATION, NOM, SLOGAN } from "@/content/site";
import { typo } from "@/lib/format";
import { Entry } from "./entry";
import { HeroPlan } from "./hero-plan";
import { Lien } from "./text-link";

type EntreeHero = { href: string; titre: string; sousTitre: string };

/**
 * Ouverture de l'accueil (3.20). Bureau : texte à gauche, plan à droite, sur la
 * hauteur de l'écran (840 px au plus). Tablette et mobile : plan au-dessus du texte.
 * Deux entrées au plus, puis la ligne diaspora, puis le slogan en pied.
 */
export function Hero({
  titre,
  chapeau,
  entrees,
  diaspora,
}: {
  titre: string;
  chapeau: string;
  /** A (trait) puis B (papier). */
  entrees: [EntreeHero, EntreeHero];
  diaspora: { question: string; lien: string; href: string };
}) {
  return (
    <section
      aria-labelledby="t-hero"
      className="@container grid border-b border-ink desk:min-h-[min(840px,calc(100svh_-_var(--spacing-header)_-_1px))] desk:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]"
    >
      <div className="flex flex-col px-gutter pt-5.5 pb-7 tab:pt-11 tab:pb-9 desk:pt-[clamp(40px,7vh,72px)] desk:pr-14 desk:pb-8 desk:pl-[max(var(--spacing-gutter),calc((100cqw_-_var(--container-wrap))_/_2))]">
        <h1 id="t-hero" className="mb-3.5 text-7 leading-title font-bold tracking-title stretch-title tab:mb-6.5">
          {typo(titre)}
        </h1>
        <p className="mb-4.5 max-w-[30em] text-3 leading-caption text-ink-2 tab:mb-8.5 tab:text-4">{typo(chapeau)}</p>
        <div className="grid grid-cols-1 gap-2 tab:grid-cols-2 tab:gap-3">
          <Entry variante="a" {...entrees[0]} />
          <Entry variante="b" {...entrees[1]} />
        </div>
        <p className="mt-1.5 text-2 leading-caption text-ink-2 tab:mt-4">
          {typo(diaspora.question)}{" "}
          <Lien
            href={diaspora.href}
            className="inline-flex min-h-11 items-center font-semibold text-trait underline decoration-1 underline-offset-5 hover:decoration-2"
          >
            {typo(diaspora.lien)}
          </Lien>
        </p>
        <p className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-t border-ink pt-3.5 desk:mt-auto">
          <span className="text-4 leading-snug font-semibold stretch-sub">{typo(`« ${SLOGAN.texte} »`)}</span>
          <span className="font-mono text-1 leading-label font-medium text-ink-2">
            {NOM} · {CREATION.texte}
          </span>
        </p>
      </div>
      <HeroPlan />
    </section>
  );
}
