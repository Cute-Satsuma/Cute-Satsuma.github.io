"use client";

const STORAGE_KEY = "caju-lang";

export function LanguageToggle() {
  function toggle() {
    const next = document.documentElement.lang.startsWith("zh") ? "en" : "zh-CN";
    document.documentElement.lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next.startsWith("zh") ? "zh" : "en");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch language"
      className="min-w-12 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-bold tracking-wide text-ink shadow-[0_2px_8px_rgba(48,32,25,.05)] transition-colors hover:border-caju hover:text-caju"
    >
      <span className="lang-zh">EN</span>
      <span className="lang-en">中文</span>
    </button>
  );
}
