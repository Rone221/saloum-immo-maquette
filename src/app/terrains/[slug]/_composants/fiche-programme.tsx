// Fiches des trois programmes, direction v4 « Du plan au terrain »
// (recherche/revue-4/direction-v4.md, section 6). Toutes s'ouvrent sur le même cartouche
// de plan (borne 01) et se ferment sur les autres terrains, puis l'appel final, avec le
// bouton WhatsApp du programme. Entre les deux, chacune prend la forme de sa pièce :
// - Sakina City, autour de son titre mère : TF 15026/R en très grand dans le cartouche,
//   sur son trait plein entre deux bornes ; la voirie et la visite virtuelle, sur le
//   calque ; puis le papier qu'on achète, sur une planche au bleu ;
// - Sicap Keur Massar, autour de ses lots : leurs numéros sur des plaques de borne dans
//   le cartouche, la vue au drone en grand, puis le tableau des lots sur une planche au
//   bleu, et les deux vidéos des lots, sur le calque ;
// - Lac Town, autour de sa vue au drone : son statut en cote pointillée dans le
//   cartouche, la vue en grand avec les axes de ses voies et la lunette, sur le calque ;
//   puis son calendrier en frise, sur l'aplat de latérite.
// Le rythme des fonds : jamais deux sombres de suite, toujours du clair avant le pied.
// Les bornes des en-têtes de section se suivent sur chaque fiche.
//
// Une seule action par fiche : le WhatsApp du programme, en tête et dans l'appel final.
// Sicap Keur Massar le redit en contour au pied de la planche des lots, là où on lit que
// certains ont pu partir.

import { AppelFinal } from "@/components/appel-final";
import { BoutonWhatsApp } from "@/components/boutons";
import { CaseCartouche } from "@/components/cartouche";
import { CadrePhoto } from "@/components/photo";
import {
  APPELS,
  LEGENDE_QUARTIER,
  MOT_CALENDRIER,
  PAPIER,
  PLANCHES,
  PRIX_SUR_DEMANDE,
  QUANTITE_LOTS,
  REPERES_PAPIER,
  SECTIONS,
  TITRES_FICHE,
} from "@/content/pages/fiches";
import { PROGRAMMES, type Programme } from "@/content/programmes";
import { AutresTerrains, Videos, Visite } from "./blocs";
import { Calendrier } from "./calendrier";
import { Lots, PlaquesLots } from "./lots";
import { Action, CartouchePlan, OuvertureFiche } from "./ouverture";
import { Papier } from "./papier";
import { Vue } from "./vue";

export function FicheProgramme({ programme: p }: { programme: Programme }) {
  if (p.slug === "sakina-city") return <FicheSakina p={p} />;
  if (p.slug === "sicap-keur-massar") return <FicheSicap p={p} />;
  return <FicheLacTown p={p} />;
}

/** Les deux autres programmes, dans l'ordre du site. */
function autres(p: Programme) {
  return PROGRAMMES.filter((x) => x.slug !== p.slug);
}

/** L'action d'un programme : « Prix sur demande », puis son WhatsApp. */
function ActionProgramme({ p }: { p: Programme }) {
  return <Action ligne={PRIX_SUR_DEMANDE.texte} label={p.libelleWhatsApp} message={p.message} nom={p.nom} />;
}

/**
 * Les deux dernières pièces de chaque fiche : les autres terrains, puis l'appel final.
 * `coupe` : la largeur du titre de l'appel, quand sa phrase doit se couper après sa
 * question et pas un mot plus loin.
 */
function Fin({ p, numero, coupe }: { p: Programme; numero: [string, string]; coupe?: string }) {
  const appel = APPELS[p.slug];
  return (
    <>
      <AutresTerrains numero={numero[0]} nom={SECTIONS.autres} titre={TITRES_FICHE.autres} programmes={autres(p)} />
      <AppelFinal
        classeTitre={coupe}
        numero={numero[1]}
        nom={SECTIONS.appel}
        phrase={appel.texte}
        mot={appel.mot}
        bouton={<BoutonWhatsApp label={p.libelleWhatsApp} message={p.message} ariaLabel={`${p.libelleWhatsApp}, ${p.nom}`} />}
      />
    </>
  );
}

function FicheSakina({ p }: { p: Programme }) {
  return (
    <>
      {/* 01. Le cartouche de plan : le titre mère d'abord. */}
      <OuvertureFiche
        nom={p.nom}
        planche={{ nom: PLANCHES[p.slug].nom, quantite: PLANCHES[p.slug].quantite?.texte }}
        situation={p.situation?.texte}
        cotes={p.cotes}
        chapeau={p.presentation.texte}
        action={<ActionProgramme p={p} />}
        cartouche={<CartouchePlan nom={p.nom} references={p.references} />}
      />

      {/* 02. La voirie en photo, la visite virtuelle en vidéo. */}
      <Visite numero="02" photo={p.photoFiche ?? p.photo} titre={TITRES_FICHE.visiteSakina} videos={p.videos} />

      {/* 03. Le papier qu'on achète, sur la planche au bleu. */}
      <Papier cle="tf" titre={PAPIER.tf} numero="03" repere={REPERES_PAPIER["sakina-city"].texte} />

      <Fin p={p} numero={["04", "05"]} />
    </>
  );
}

function FicheSicap({ p }: { p: Programme }) {
  // La seconde vidéo est le reel : la fiche en montre une image.
  const reel = p.videos[1];
  const lots = p.lots;
  return (
    <>
      {/* 01. Le cartouche de plan : le papier, puis les lots sur leurs plaques. Dessous,
          la vue au drone en grand. 2616 fait 2 000 px de large : elle tient le conteneur
          (1 360 px au plus). Sur mobile, le cadre 4:3 la dessine par sa hauteur, 1,19
          fois la largeur de l'écran. Vue oblique : ni repères de cadrage ni plan dessus. */}
      <OuvertureFiche
        nom={p.nom}
        planche={{
          nom: PLANCHES[p.slug].nom,
          // La quantité se compte dans la liste des lots.
          quantite: lots ? `${lots.liste.length} ${QUANTITE_LOTS}` : undefined,
        }}
        situation={p.situation?.texte}
        cotes={p.cotes}
        chapeau={p.presentation.texte}
        note={p.autreNom?.texte}
        action={<ActionProgramme p={p} />}
        cartouche={
          <CartouchePlan
            nom={p.nom}
            references={p.references}
            apresPrincipale={
              lots ? (
                <CaseCartouche cle={lots.titre} className="col-span-2">
                  <PlaquesLots liste={lots.liste} />
                </CaseCartouche>
              ) : null
            }
          />
        }
      >
        <CadrePhoto
          id={p.photo}
          bascule
          bord
          ratio="aspect-[4/3] tab:aspect-[16/9] desk:aspect-[2/1]"
          texteLegende={LEGENDE_QUARTIER}
          sizes="(min-width: 1440px) 1360px, (min-width: 1101px) calc(100vw - 80px), (min-width: 761px) calc(100vw - 56px), 119vw"
          className="apparait mt-14 desk:mt-20"
        />
      </OuvertureFiche>

      {/* 02. Les lots, sur la planche au bleu : la pièce de cette fiche. */}
      {lots ? (
        <Lots
          numero="02"
          lots={lots}
          action={
            <BoutonWhatsApp
              variante="contour"
              label={p.libelleWhatsApp}
              message={p.message}
              ariaLabel={`${p.libelleWhatsApp}, ${p.nom}`}
            />
          }
        />
      ) : null}

      {/* 03. Les deux vidéos des lots, en lignes, et une image tirée du reel. */}
      <Videos
        numero="03"
        titre={TITRES_FICHE.videosSicap}
        videos={p.videos}
        image={reel ? { photo: "ig-DfAoxMkAbKR", cle: reel } : undefined}
      />

      <Fin p={p} numero={["04", "05"]} />
    </>
  );
}

function FicheLacTown({ p }: { p: Programme }) {
  return (
    <>
      {/* 01. Le cartouche de plan : le statut d'abord, en cote pointillée. */}
      <OuvertureFiche
        nom={p.nom}
        planche={{ nom: PLANCHES[p.slug].nom, quantite: PLANCHES[p.slug].quantite?.texte }}
        situation={p.situation?.texte}
        cotes={p.cotes}
        chapeau={p.presentation.texte}
        action={<ActionProgramme p={p} />}
        cartouche={<CartouchePlan nom={p.nom} references={p.references} />}
        noteCartouche={p.noteFiche?.texte}
      />

      {/* 02. La vue au drone, ses axes et la lunette, sur le calque. */}
      <Vue numero="02" dejaFait={p.dejaFait.texte} />

      {/* 03. Le calendrier, sur la latérite. */}
      {p.calendrier ? <Calendrier numero="03" titre={p.calendrier.titre.texte} mot={MOT_CALENDRIER} jalons={p.calendrier.jalons} /> : null}

      {/* « Un terrain à Lac Town ? Demandez les prix. » : le titre fait 9,5 fois son corps
          de large, la phrase s'y coupe après le nom, puis après la question. Plus large,
          « Demandez » remontait sur la ligne du nom et laissait « les prix. » seul. */}
      <Fin p={p} numero={["04", "05"]} coupe="max-w-[9.5em]" />
    </>
  );
}
