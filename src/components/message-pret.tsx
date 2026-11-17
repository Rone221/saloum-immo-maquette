import type { Message } from "@/content/messages";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * Un message WhatsApp prêt, écrit en grand, entre guillemets : ce que la personne va
 * envoyer, montré au-dessus du bouton qui l'envoie. Le message vient de
 * content/messages.ts, et le bouton prend la même chaîne : ce qui se lit ici est ce
 * qui part.
 *
 *   <MessagePret message={MESSAGES.diaspora} />
 *   <BoutonWhatsApp label={LIBELLES.diaspora} message={MESSAGES.diaspora.texte} />
 *
 * 22 px sur téléphone, 26 sur tablette, 28 au bureau, dans la couleur forte de la
 * surface. Pour un message entier : un message à compléter demande ses champs
 * (components/phrase-a-trous.tsx).
 */
export function MessagePret({ message, className }: { message: Message; className?: string }) {
  return (
    <p className={cx("text-[1.375rem] leading-snug text-fort tab:text-[1.625rem] desk:text-[1.75rem]", className)}>
      {typo(`« ${message.texte} »`)}
    </p>
  );
}
