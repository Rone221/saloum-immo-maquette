import { PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { CONTACT, WA_DEFAULT } from "@/lib/site";
import { btnPrimary, btnSecondary } from "./ui";

// Barre d'action fixe sur mobile : l'appel et WhatsApp restent à un pouce.
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a href={CONTACT.phoneHref} className={btnSecondary}>
          <PhoneIcon size={18} aria-hidden />
          Appeler
        </a>
        <a href={WA_DEFAULT} target="_blank" rel="noopener" className={btnPrimary}>
          <WhatsappLogoIcon size={18} weight="fill" aria-hidden />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
