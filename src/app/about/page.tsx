import type { Metadata } from "next";
import { T } from "@/components/T";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "About Caju",
  description: "Caju is the short name of Cute-Satsuma. The name is never translated.",
};

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="soft-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.8fr_1.2fr]">
        <div className="relative mx-auto h-72 w-72">
          <div className="absolute inset-0 rotate-6 rounded-[38%_62%_53%_47%/55%_42%_58%_45%] bg-sun" />
          <img
            src="/brand/caju_logo_512.png"
            alt="Caju"
            className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 -rotate-3 rounded-[42px] shadow-[0_24px_48px_rgba(81,39,18,.22)]"
          />
        </div>
        <section>
          <T zh="Cute + 桔" en="Cute + Ju" as="p" className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-caju" />
          <T
            zh={copy.aboutTitle.zh}
            en={copy.aboutTitle.en}
            as="h1"
            className="display-title m-0 text-5xl font-bold leading-tight sm:text-6xl"
          />
          <div className="mt-7 space-y-5 text-base leading-8 text-muted">
            <T zh={copy.aboutP1.zh} en={copy.aboutP1.en} as="p" />
            <T zh={copy.aboutP2.zh} en={copy.aboutP2.en} as="p" />
            <T zh={copy.aboutP3.zh} en={copy.aboutP3.en} as="p" />
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Caju", "Cute-Satsuma", "Focused", "Local first"].map((item) => (
              <span key={item} className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs font-bold text-muted">
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
