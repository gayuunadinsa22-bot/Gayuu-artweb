import { tickerPhrases } from "@/lib/content";

/** Slim editorial ticker between hero and shop. */
export function Ticker() {
  const phrases = [...tickerPhrases, ...tickerPhrases];

  return (
    <div className="overflow-hidden border-y border-line bg-cream/50 py-4 select-none">
      <div className="animate-marquee flex w-max items-center gap-10 hover:[animation-play-state:paused]">
        {[0, 1].map((loop) => (
          <div key={loop} className="flex items-center gap-10" aria-hidden={loop === 1}>
            {phrases.map((phrase, index) => (
              <span key={`${loop}-${phrase}-${index}`} className="flex items-center gap-10">
                <span className="font-serif text-xl italic text-muted md:text-2xl">
                  {phrase}
                </span>
                <span className="text-sm text-blush-deep">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
