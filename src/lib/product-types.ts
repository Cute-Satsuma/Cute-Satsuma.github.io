export const PLATFORM_IDS = [
  "android",
  "ios",
  "macos",
  "windows",
  "web",
] as const;

export const PRODUCT_CATEGORIES = ["tool", "game"] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type Localized = {
  zh: string;
  en: string;
};

export type PlatformRelease = {
  platform: PlatformId;
  version?: string;
  storeUrl?: string;
  webUrl?: string;
  downloadUrl?: string;
};

export type Product = {
  slug: string;
  published: boolean;
  sort: number;
  category: ProductCategory;
  name: Localized;
  tagline: Localized;
  description: Localized;
  highlights: { zh: string[]; en: string[] };
  iconUrl: string;
  screenshots: string[];
  privacyUrl?: string;
  landingUrl?: string;
  githubUrl?: string;
  platforms: PlatformRelease[];
};

export function emptyProduct(): Product {
  return {
    slug: "",
    published: false,
    sort: 0,
    category: "tool",
    name: { zh: "", en: "" },
    tagline: { zh: "", en: "" },
    description: { zh: "", en: "" },
    highlights: { zh: [], en: [] },
    iconUrl: "",
    screenshots: [],
    platforms: [],
  };
}

export function platformPrimaryUrl(
  release: PlatformRelease,
): string | undefined {
  if (release.platform === "web") {
    return release.webUrl || release.downloadUrl || release.storeUrl;
  }
  return release.storeUrl || release.downloadUrl || release.webUrl;
}

export function detectClientPlatform(): PlatformId | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "macos";
  return "web";
}

export function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const p = value as Product;
  return (
    typeof p.slug === "string" &&
    typeof p.published === "boolean" &&
    typeof p.sort === "number" &&
    p.name != null &&
    typeof p.name.zh === "string" &&
    typeof p.name.en === "string" &&
    Array.isArray(p.platforms)
  );
}
