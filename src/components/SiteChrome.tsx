import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";
import { T } from "./T";
import { copy } from "@/lib/copy";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <img
            src="/brand/caju_logo_512.png"
            alt="Caju"
            width={40}
            height={40}
            className="h-10 w-10 rounded-[13px] shadow-[0_5px_14px_rgba(48,32,25,.12)] transition-transform group-hover:-rotate-3"
          />
          <span className="leading-none">
            <strong className="display-title block text-xl text-ink">Caju</strong>
            <small className="block text-[9px] font-bold uppercase tracking-[.2em] text-caju">
              Cute Satsuma
            </small>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-5">
          <Link href="/products/" className="hover:text-caju">
            <T zh={copy.navProducts.zh} en={copy.navProducts.en} />
          </Link>
          <Link href="/about/" className="hidden hover:text-caju sm:inline">
            <T zh={copy.navAbout.zh} en={copy.navAbout.en} />
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white/45 px-5 py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 sm:px-3">
        <div>
          <strong className="display-title text-xl text-ink">Caju</strong>
          <T zh={copy.footerNote.zh} en={copy.footerNote.en} as="p" className="mt-1" />
        </div>
        <div className="flex gap-5 font-semibold text-ink">
          <Link href="/privacy/">
            <T zh={copy.privacy.zh} en={copy.privacy.en} />
          </Link>
          <a href="https://github.com/Cute-Satsuma" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
