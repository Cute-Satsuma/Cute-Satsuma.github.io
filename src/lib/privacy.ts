import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "./site";
import type { Localized } from "./product-types";

export type PrivacyPolicyMeta = {
  slug: string;
  productSlug?: string;
  title: Localized;
  updated: Localized;
};

export type PrivacyPolicy = PrivacyPolicyMeta & {
  html: Localized;
};

const privacyDir = join(process.cwd(), "content/privacy");

function isMeta(value: unknown): value is PrivacyPolicyMeta {
  if (!value || typeof value !== "object") return false;
  const p = value as PrivacyPolicyMeta;
  return (
    typeof p.slug === "string" &&
    p.title != null &&
    typeof p.title.zh === "string" &&
    typeof p.title.en === "string" &&
    p.updated != null &&
    typeof p.updated.zh === "string" &&
    typeof p.updated.en === "string"
  );
}

export function privacyPath(slug: string): string {
  return `/privacy/${slug}/`;
}

export function privacyCanonicalUrl(slug: string): string {
  return `${site.url}${privacyPath(slug)}`;
}

export function getPrivacyMetas(): PrivacyPolicyMeta[] {
  const raw = JSON.parse(
    readFileSync(join(privacyDir, "policies.json"), "utf8"),
  ) as unknown;
  if (!Array.isArray(raw) || !raw.every(isMeta)) {
    throw new Error("Invalid content/privacy/policies.json");
  }
  return raw;
}

export function getAllPrivacyPolicies(): PrivacyPolicy[] {
  return getPrivacyMetas().map((meta) => ({
    ...meta,
    html: {
      zh: readFileSync(join(privacyDir, `${meta.slug}.zh.html`), "utf8"),
      en: readFileSync(join(privacyDir, `${meta.slug}.en.html`), "utf8"),
    },
  }));
}

export function getPrivacyPolicy(slug: string): PrivacyPolicy | undefined {
  return getAllPrivacyPolicies().find((policy) => policy.slug === slug);
}

export function isSameSiteUrl(url: string): boolean {
  return url.startsWith("/") || url.startsWith(site.url);
}

export function toSitePath(url: string): string {
  if (url.startsWith("/")) return url;
  if (url.startsWith(site.url)) {
    const path = url.slice(site.url.length);
    return path.startsWith("/") ? path : `/${path}`;
  }
  return url;
}
