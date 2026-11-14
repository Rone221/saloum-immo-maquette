// Accueil (revue 2, recherche/revue-2/plan.md). Six sections, puis le pied de contact :
// l'ouverture qui montre le travail, les terrains en cartes, aménager (frise datée et
// bandeau propriétaire), le bon papier (sur l'encre), l'étranger (étapes et vidéos),
// Babacar Ndiaye. Chaque détail vit sur sa page.
//
// Photos : les cinq étapes en ouverture (2493, 2502, 2529, 2355, 2516), 2534, 2616 et
// 2580 sur les cartes, 2542 sous le bandeau propriétaire, 2413-droite et 2352-haut en
// couvertures de vidéos, l'interview pour le fondateur. Une seule de chaque groupe des
// garde-fous. 2355 n'est pas dans la section des 58 parcelles. Une photo hors programme
// sur deux pages au plus : la capture de la collaboratrice reste sur Diaspora et sur la
// fiche Sicap Keur Massar, pas ici.

import { Bouton, BoutonWhatsApp } from "@/components/boutons";
import { Carrousel } from "@/components/carrousel";
import { CarteOffre, CarteProgramme } from "@/components/carte-programme";
import { CarteVideo, type Couverture } from "@/components/carte-video";
import { Documents } from "@/components/documents";
import { Frise } from "@/components/frise";
import { HeroEtapes } from "@/components/hero-etapes";
import { Photo, ratio } from "@/components/photo";
import { Borne, Fleche } from "@/components/reperes";
import { Section } from "@/components/section";
import { InlineLink, Lien, TextLink } from "@/components/text-link";
import { INTRO_FONCIER_ACCUEIL, NOTAIRE, PREUVES, SOURCE_DEFINITIONS, TITRE_FONCIER } from "@/content/foncier";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { PROGRAMMES } from "@/content/programmes";
import { TRAVAUX } from "@/content/registre";
import {
  AMENAGER_PROPRIETAIRES,
  DIASPORA,
  ETAPES,
  PARCOURS_DIASPORA,
  QUESTION_PROPRIETAIRES,
} from "@/content/services";
import { FONDATEUR } from "@/content/site";
import { CHAINE_YOUTUBE, VIDEOS, type CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, ENTRE_BLOCS, SOUS_TITRE, T1, T2, T3 } from "@/lib/classes";
import { enLettres, typo } from "@/lib/format";

/** Vidéos de l'accueil, dans l'ordre. Sans photo, la couverture est le quadrillage d'un plan. */
const VIDEOS_ACCUEIL: { cle: CleVideo; couverture?: Couverture }[] = [
  { cle: "visiteSakina", couverture: { photo: "2413-droite" } },
  { cle: "reelLotsSKM" },
  { cle: "presentation", couverture: { photo: "2352-haut" } },
  { cle: "interviewDG" },
  { cle: "nicad" },
];

/** En-tête de section : le titre et son chapeau à gauche, un lien « tout voir » à droite. */
function TeteSection({
  id,
  titre,
  chapeau,
  lien,
  ton = "clair",
}: {
  id: string;
  titre: string;
  chapeau: string;
  lien: { href: string; libelle: string };
  ton?: "clair" | "sombre";
}) {
  const sombre = ton === "sombre";
  return (
    <div className="grid gap-y-5 tab:grid-cols-[minmax(0,1fr)_auto] tab:items-end tab:gap-x-10">
      <div className="max-w-[44rem]">
        <h2 id={id} className={T2}>
          {typo(titre)}
        </h2>
        <p className={cx(SOUS_TITRE, "text-h3 leading-snug", sombre ? "text-white/80" : "text-ink-2")}>{typo(chapeau)}</p>
      </div>
      <Lien
        href={lien.href}
        className={cx(
          "group inline-flex min-h-11 items-center gap-2 self-start font-semibold tab:self-end",
          sombre ? "text-white" : "text-trait",
        )}
      >
        <span className="underline decoration-1 underline-offset-4 group-hover:decoration-2">{typo(lien.libelle)}</span>
        <Fleche />
      </Lien>
    </div>
  );
}

export default function Accueil() {
  const diapos = ETAPES.map((e, i) => ({
    titre: e.titre,
    photo: (
      <Photo
        id={e.photo}
        fill
        preload={i === 0}
        // En paysage (2529), la photo est dessinée par la hauteur du cadre haut : 880 px au plus.
        sizes={ratio(e.photo) > 1 ? "(min-width: 960px) 880px, 100vw" : "(min-width: 1440px) 668px, (min-width: 960px) 47vw, 100vw"}
        className="object-cover"
      />
    ),
  }));

  return (
    <>
      {/* 1. Ouverture : le titre, deux boutons, les étapes en fondu ; trois preuves dessous. */}
      <section aria-labelledby="t-hero" className="pb-16 tab:pb-20 min-[60rem]:pt-12 desk:pb-24">
        <div className="wrap grid min-[60rem]:grid-cols-12 min-[60rem]:items-center min-[60rem]:gap-x-6">
          <HeroEtapes
            diapos={diapos}
            cadre="-mx-gutter aspect-[4/3] tab:mx-0 tab:aspect-[16/9] min-[60rem]:aspect-auto min-[60rem]:h-[clamp(520px,calc(100svh-var(--spacing-header)-190px),660px)]"
            className="entree [--delai:0.15s] min-[60rem]:col-[7/span_6] min-[60rem]:row-start-1"
          />
          <div className="pt-8 tab:pt-12 min-[60rem]:col-[1/span_6] min-[60rem]:row-start-1 min-[60rem]:pt-0 desk:pr-8">
            <h1 id="t-hero" className={cx(T1, "entree")}>
              {typo("Nous vendons des terrains. Et nous les aménageons nous-mêmes.")}
            </h1>
            <p className={cx(CHAPEAU, "entree mt-5 max-w-[30em] [--delai:0.1s] desk:mt-7")}>
              {typo(
                "Terrassement, voies en latérite, eau avec SEN’EAU, électricité, bornage. Sur les terrains que nous vendons autour de Dakar, et sur ceux des propriétaires.",
              )}
            </p>
            <div className="entree mt-8 flex flex-col gap-3 [--delai:0.2s] tab:flex-row tab:flex-wrap desk:mt-10">
              <Bouton href="#terrains">Acheter un terrain</Bouton>
              <Bouton href="#amenager" variante="contour">
                Faire aménager mon terrain
              </Bouton>
            </div>
            <p className="entree mt-6 text-ink-2 [--delai:0.3s]">
              {typo("Vous vivez à l’étranger : ")}
              <InlineLink href="#etranger">achetez à distance, pas à pas</InlineLink>
            </p>
          </div>
        </div>

        {/* Trois preuves, sans photo : ce que l'acheteur prudent cherche d'abord. */}
        <ul className="wrap mt-12 grid gap-y-6 tab:mt-16 tab:grid-cols-3 tab:gap-x-6 desk:mt-20">
          {PREUVES.map((p, i) => (
            <li
              key={p.titre}
              className={cx(
                "flex gap-4 border-t-2 border-ink pt-5",
                i === 1 ? "reveler-2" : i === 2 ? "reveler-3" : "reveler",
              )}
            >
              <Borne className="mt-2 size-2.5" />
              <div>
                <p className="text-h3 leading-snug font-semibold">{typo(p.titre)}</p>
                <p className="mt-1 text-ink-2">{typo(p.texte.texte)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Terrains disponibles : trois cartes (carrousel sous 1 101 px), l'offre datée à part. */}
      <Section id="terrains" labelledBy="t-terrains" surface="paper-2">
        <TeteSection
          id="t-terrains"
          titre="Terrains disponibles"
          chapeau="Trois programmes en vente autour de Dakar. Prix sur demande, par WhatsApp."
          lien={{ href: "/terrains/", libelle: "Tous les terrains" }}
        />
        <Carrousel etiquette="Terrains disponibles" bureau="grille" className={cx(ENTRE_BLOCS, "reveler")}>
          {PROGRAMMES.map((p) => (
            <CarteProgramme key={p.slug} programme={p} />
          ))}
        </Carrousel>
        <CarteOffre className="reveler mt-8 desk:mt-10" />
      </Section>

      {/* 3. Aménager la terre : la frise des travaux datés, puis le bandeau des propriétaires
          sur la latérite livrée (2542). */}
      <Section id="amenager" labelledBy="t-amenager">
        <TeteSection
          id="t-amenager"
          titre="Aménager la terre"
          chapeau={`${enLettres(TRAVAUX.length)} chantiers publiés, chacun avec sa date.`}
          lien={{ href: "/amenager/", libelle: "Les étapes en détail" }}
        />
        <Frise travaux={TRAVAUX} className={cx(ENTRE_BLOCS, "desk:mt-16")} />

        {/* Le bandeau des propriétaires : la photo en couleur d'un côté, l'encre de l'autre. */}
        <div className="group reveler mt-16 grid overflow-hidden bg-ink text-white tab:grid-cols-2 desk:mt-24 [&_:focus-visible]:outline-white">
          {/* En tablette, le cadre s'étire à la hauteur du texte : la photo est dessinée par sa hauteur. */}
          <div className="relative aspect-[4/3] overflow-hidden tab:aspect-auto tab:min-h-[24rem]">
            <Photo
              id="2542"
              fill
              sizes="(min-width: 1440px) 680px, (min-width: 1101px) 50vw, (min-width: 761px) 80vw, 100vw"
              className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-10 tab:px-10 tab:py-12 desk:px-14 desk:py-16">
            <h3 className={T2}>{typo(QUESTION_PROPRIETAIRES)}</h3>
            <p className="mt-4 text-h3 leading-snug text-white/85 desk:mt-5">{typo(AMENAGER_PROPRIETAIRES)}</p>
            <div className="mt-8 flex flex-col gap-3 desk:mt-10 desk:flex-row desk:flex-wrap">
              <BoutonWhatsApp label={LIBELLES.proprietaire} message={MESSAGES.proprietaire.texte} variante="inverse" />
              <Bouton href="/amenager/" variante="ligne">
                Tout sur l’aménagement
              </Bouton>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Le bon papier avant le bon prix, sur l'encre : les trois documents, du moins au
          plus protégé ; le notaire. */}
      <Section id="foncier" labelledBy="t-foncier" surface="ink">
        <TeteSection
          id="t-foncier"
          titre={TITRE_FONCIER}
          chapeau={INTRO_FONCIER_ACCUEIL}
          lien={{ href: "/foncier/", libelle: "Comprendre le foncier" }}
          ton="sombre"
        />
        <Documents variante="accueil" className={cx(ENTRE_BLOCS, "desk:mt-16")} />
        <div className="mt-10 flex flex-col gap-3 border-t border-white/20 pt-6 tab:flex-row tab:items-center tab:justify-between desk:mt-12">
          <p className="flex items-center gap-3 text-h3 leading-snug font-semibold">
            <Borne className="size-2.5" />
            {typo(NOTAIRE.texte)}
          </p>
          <p className="text-small text-white/70">{typo(SOURCE_DEFINITIONS.texte)}</p>
        </div>
      </Section>

      {/* 5. Acheter depuis l'étranger : quatre étapes en cartes, puis les vidéos à regarder. */}
      <Section id="etranger" labelledBy="t-etranger" surface="paper-2">
        <div className="grid gap-y-10 desk:grid-cols-12 desk:gap-x-6">
          <div className="desk:col-span-5">
            <h2 id="t-etranger" className={T2}>
              {typo("Vous vivez à l’étranger ?")}
            </h2>
            <p className={cx(SOUS_TITRE, CHAPEAU)}>{typo(DIASPORA.chapeau)}</p>
            <div className="mt-8 flex flex-col gap-3 tab:flex-row tab:flex-wrap desk:mt-10">
              <BoutonWhatsApp label={LIBELLES.diaspora} message={DIASPORA.message} />
              <Bouton href="/diaspora/" variante="contour">
                {typo("Acheter depuis l’étranger")}
              </Bouton>
            </div>
          </div>
          <ol className="grid gap-4 tab:grid-cols-2 tab:gap-6 desk:col-span-6 desk:col-start-7">
            {PARCOURS_DIASPORA.map((s, i) => (
              <li
                key={s.titre}
                className={cx(
                  "group relative grid grid-cols-[2.75rem_minmax(0,1fr)] border border-rule bg-paper p-4 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-trait tab:block tab:p-6",
                  i % 2 === 1 ? "reveler-2" : "reveler",
                )}
              >
                <span
                  aria-hidden="true"
                  className="stretch-title block text-h2 leading-none font-bold text-sol tabular-nums transition-colors duration-300 group-hover:text-trait"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold tab:mt-4">{typo(s.titre)}</h3>
                  <p className="mt-1 text-ink-2">{typo(s.court)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 desk:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
            <h3 className={T3}>{typo("À regarder avant d’appeler")}</h3>
            <Lien href={CHAINE_YOUTUBE} className="group inline-flex min-h-11 items-center gap-2 font-semibold text-trait">
              <span className="underline decoration-1 underline-offset-4 group-hover:decoration-2">Toutes nos vidéos sur YouTube</span>
              <Fleche />
            </Lien>
          </div>
          {/* Trois cartes à l'écran au bureau, 432 px au plus : 2413-droite y est dessinée à
              598 px de large (600 au plus). La piste reste dans la colonne : pas de quatrième
              carte coupée au bord de l'écran. */}
          <Carrousel
            etiquette="Vidéos à regarder avant d’appeler"
            diapo="w-[78%] max-w-[26rem] tab:w-[40%] desk:w-[calc((100%-3rem)/3)] desk:max-w-[27rem]"
            bureau="wrap"
            className="reveler mt-6"
          >
            {VIDEOS_ACCUEIL.map((v) => (
              <CarteVideo
                key={v.cle}
                cle={v.cle}
                couverture={v.couverture}
                sizes="(min-width: 1424px) 432px, (min-width: 1101px) 30vw, (min-width: 761px) 38vw, 70vw"
              />
            ))}
          </Carrousel>
        </div>
      </Section>

      {/* 6. Babacar Ndiaye : l'interview en grand (lien vers la vidéo), le parcours résumé. */}
      <Section id="fondateur" labelledBy="t-fondateur">
        <div className="grid gap-y-8 tab:grid-cols-12 tab:items-center tab:gap-x-6">
          {/* Le portrait mène à l'interview ; le lien texte le double, il sort de la tabulation.
              Capture de 899 px dans un cadre 4:3 : dessinée par sa hauteur, 640 px de cadre au
              plus, soit 853 px dessinés et 887 au survol (zoom de 1,04). */}
          <a
            href={VIDEOS.interviewDG.href}
            tabIndex={-1}
            aria-hidden="true"
            className="group reveler relative -mx-gutter block max-w-[640px] tab:col-span-6 tab:mx-0"
          >
            <span className="relative block aspect-[4/3] overflow-hidden bg-paper-2">
              <Photo
                id={FONDATEUR.photo}
                fill
                decorative
                sizes="(min-width: 1384px) 853px, (min-width: 761px) 63vw, (min-width: 641px) 853px, 133vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </span>
            <span className="absolute bottom-0 left-0 inline-flex items-center gap-3 bg-ink py-3 pr-5 pl-3 font-semibold text-white transition-colors duration-300 group-hover:bg-trait">
              <span className="inline-flex size-9 items-center justify-center bg-white/15">
                <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
              </span>
              {typo(`L’interview, ${VIDEOS.interviewDG.duree}`)}
            </span>
          </a>
          <div className="reveler-2 tab:col-span-6 desk:col-span-5 desk:col-start-8">
            <h2 id="t-fondateur" className={T2}>
              {FONDATEUR.nom.texte}
            </h2>
            <p className={cx(SOUS_TITRE, "text-h3 leading-snug font-semibold")}>{typo(FONDATEUR.roleCourt.texte)}</p>
            {/* Une phrase du parcours : la biographie complète vit sur À propos (« Son parcours »). */}
            <p className="mt-4 text-ink-2">{typo(FONDATEUR.creation.texte)}</p>
            <p className="mt-4">{typo(FONDATEUR.enVideo.texte)}</p>
            <div className="mt-4 flex flex-wrap gap-x-8">
              <TextLink href={VIDEOS.interviewDG.href}>{`Voir l’interview (${VIDEOS.interviewDG.duree})`}</TextLink>
              <TextLink href="/a-propos/">Son parcours</TextLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
