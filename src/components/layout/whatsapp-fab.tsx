import { MessageCircle } from "lucide-react";
import { siteSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/whatsapp";

/** Floating WhatsApp contact — expands with its label on hover. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(
        `Hello ${siteSettings.artistName}! I found ${siteSettings.brandName} online and I'd love to ask about an artwork 🌷`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with the studio on WhatsApp"
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-0 rounded-full bg-ink p-4 text-ivory shadow-float transition-colors duration-300 hover:bg-blush-deep md:bottom-7 md:right-7"
    >
      <MessageCircle className="size-5 shrink-0" strokeWidth={1.6} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-w-[180px] group-hover:pl-2.5">
        Chat with the studio
      </span>
    </a>
  );
}
