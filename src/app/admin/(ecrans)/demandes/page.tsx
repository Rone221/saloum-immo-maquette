// Les demandes de l'espace client de démonstration (direction v4, section 7) : le
// registre de ce qui arrive par la fiche de la page Contact. Deux sources : des
// demandes d'exemple, inventées et dites comme telles (content/demo/demandes.ts), et
// celles que le visiteur a envoyées lui-même depuis ce navigateur (lib/demandes.ts).
// On ouvre une ligne, on la marque traitée : l'état tient en mémoire, sans plus.

import type { Metadata } from "next";
import { TeteEcran } from "@/components/admin/pieces";
import { RegistreDemandes } from "@/components/admin/registre-demandes";
import { DEMANDES } from "@/content/demo/textes";

export const metadata: Metadata = { title: DEMANDES.titre };

export default function Demandes() {
  return (
    <div className="admin-page">
      <TeteEcran titre={DEMANDES.titre} chapeau={DEMANDES.chapeau} />
      <RegistreDemandes />
    </div>
  );
}
