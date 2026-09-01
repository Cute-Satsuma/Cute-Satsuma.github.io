"use client";

import Link from "next/link";
import { T } from "./T";
import { copy, platformLabel, categoryLabel } from "@/lib/copy";
import { type PlatformId, type Product } from "@/lib/product-types";

export function PlatformPills({ product }: { product: Product }) {
  const ids = [...new Set(product.platforms.map((item) => item.platform))];
  if (ids.length === 0) return null;
  return (
    <ul className="m-0 flex flex-wrap gap-1.5 p-0">
      {ids.map((id) => (
        <li
          key={id}
          className="rounded-full border border-line bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted"
        >
          <T zh={platformLabel[id].zh} en={platformLabel[id].en} />
        </li>
      ))}
    </ul>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="lift group relative flex min-h-[360px] flex-col overflow-hidden rounded-[30px] border border-line bg-card shadow-[0_12px_35px_rgba(67,41,28,.07)] hover:border-caju/30 hover:shadow-[0_22px_50px_rgba(106,53,25,.13)]">
      <Link
        href={`/products/${product.slug}/`}
        className="relative flex h-44 items-center justify-center overflow-hidden bg-[#fff0df]"
        aria-label={product.name.en}
      >
        <div className="absolute -left-10 -top-14 h-40 w-40 rounded-full bg-sun/45" />
        <div className="absolute -bottom-20 -right-12 h-52 w-52 rounded-full bg-caju/15" />
        <div className="soft-grid absolute inset-0 opacity-40" />
        <img
          src={product.iconUrl}
          alt=""
          width={96}
          height={96}
          className="relative z-10 h-24 w-24 rounded-[26px] shadow-[0_18px_30px_rgba(83,42,20,.2)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2"
        />
        <span className="absolute right-4 top-4 rounded-full border border-white/60 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted backdrop-blur">
          <T zh={categoryLabel[product.category].zh} en={categoryLabel[product.category].en} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div>
          <h2 className="display-title m-0 text-2xl font-bold">
            <T zh={product.name.zh} en={product.name.en} as="span" />
          </h2>
          <T
            zh={product.tagline.zh}
            en={product.tagline.en}
            as="p"
            className="mt-2 min-h-11 text-sm leading-6 text-muted"
          />
        </div>
        <div className="mt-4">
          <PlatformPills product={product} />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <Link
            href={`/products/${product.slug}/`}
            className="text-sm font-bold text-ink transition-colors hover:text-caju"
          >
            <T zh={copy.viewApp.zh} en={copy.viewApp.en} />
          </Link>
          <Link
            href={`/download/${product.slug}/`}
            className="caju-action flex h-10 w-10 items-center justify-center rounded-full text-lg text-white"
            aria-label={copy.download.en}
          >
            ↗
          </Link>
        </div>
      </div>
    </article>
  );
}

function storeLabel(platform: PlatformId) {
  if (platform === "android") return copy.getOnPlay;
  if (platform === "ios") return copy.appStore;
  return copy.download;
}

export function PlatformCtas({
  product,
  highlight,
}: {
  product: Product;
  highlight?: PlatformId | null;
}) {
  if (product.platforms.length === 0) {
    return (
      <T
        zh={copy.noBuildYet.zh}
        en={copy.noBuildYet.en}
        as="p"
        className="text-muted"
      />
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {product.platforms.map((release, index) => {
        const buttons: {
          href: string;
          zh: string;
          en: string;
          self?: boolean;
          quiet?: boolean;
        }[] = [];
        if (release.storeUrl) {
          buttons.push({
            href: release.storeUrl,
            zh: storeLabel(release.platform).zh,
            en: storeLabel(release.platform).en,
          });
        }
        if (release.downloadUrl) {
          buttons.push({
            href: release.downloadUrl,
            zh: copy.downloadDirect.zh,
            en: copy.downloadDirect.en,
            quiet: Boolean(release.storeUrl),
          });
        }
        if (release.webUrl) {
          buttons.push({
            href: release.webUrl,
            zh: copy.openWeb.zh,
            en: copy.openWeb.en,
            self: true,
          });
        }
        const active = highlight === release.platform;
        return (
          <li
            key={`${release.platform}-${index}`}
            className={`rounded-[20px] border bg-card p-4 ${
              active ? "border-caju shadow-[0_10px_28px_rgba(230,81,0,0.12)]" : "border-line"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="m-0 font-bold">
                  <T
                    zh={platformLabel[release.platform].zh}
                    en={platformLabel[release.platform].en}
                  />
                  {release.version ? (
                    <span className="ml-2 text-sm font-medium text-muted">
                      {release.version}
                    </span>
                  ) : null}
                </p>
                {active ? (
                  <T
                    zh={copy.suggestedForYou.zh}
                    en={copy.suggestedForYou.en}
                    as="small"
                    className="text-caju"
                  />
                ) : null}
                {release.platform === "macos" && release.downloadUrl ? (
                  <T
                    zh={copy.macosGatekeeper.zh}
                    en={copy.macosGatekeeper.en}
                    as="p"
                    className="mt-2 mb-0 max-w-md text-xs leading-5 text-muted"
                  />
                ) : null}
                {release.platform === "windows" && release.downloadUrl ? (
                  <T
                    zh={copy.windowsSmartScreen.zh}
                    en={copy.windowsSmartScreen.en}
                    as="p"
                    className="mt-2 mb-0 max-w-md text-xs leading-5 text-muted"
                  />
                ) : null}
              </div>
              {buttons.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {buttons.map((button) => (
                    <a
                      key={button.href}
                      href={button.href}
                      target={button.self ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className={`caju-action rounded-full px-4 py-2 text-sm font-semibold ${
                        button.quiet ? "caju-action--quiet" : ""
                      }`}
                    >
                      <T zh={button.zh} en={button.en} />
                    </a>
                  ))}
                </div>
              ) : (
                <T
                  zh={copy.noBuildYet.zh}
                  en={copy.noBuildYet.en}
                  as="small"
                  className="text-muted"
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
