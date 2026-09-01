import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlatformCtas } from "@/components/ProductCard";
import { T } from "@/components/T";
import { copy } from "@/lib/copy";
import { isSameSiteUrl, toSitePath } from "@/lib/privacy";
import { getPublishedProduct, getPublishedProducts } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) return { title: "Caju" };
  return {
    title: `${product.name.en} · Caju`,
    description: product.tagline.en,
    alternates: product.landingUrl ? { canonical: product.landingUrl } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) notFound();

  return (
    <main>
      <section className="relative overflow-hidden border-b border-line">
        <div className="soft-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_360px] lg:py-20">
          <div>
            <Link href="/products/" className="mb-7 inline-block text-xs font-bold uppercase tracking-[.18em] text-caju">
              ← <T zh="全部产品" en="All apps" />
            </Link>
            <div className="flex flex-wrap items-center gap-5">
              <img
                src={product.iconUrl}
                alt=""
                width={88}
                height={88}
                className="h-[88px] w-[88px] rounded-[25px] shadow-[0_16px_30px_rgba(83,42,20,.18)]"
              />
              <div>
                <T
                  zh={product.name.zh}
                  en={product.name.en}
                  as="h1"
                  className="display-title m-0 text-4xl font-bold sm:text-5xl"
                />
                <T
                  zh={product.tagline.zh}
                  en={product.tagline.en}
                  as="p"
                  className="mt-2 text-lg text-muted"
                />
              </div>
            </div>
            <T
              zh={product.description.zh}
              en={product.description.en}
              as="p"
              className="mt-7 max-w-2xl text-base leading-8 text-muted"
            />
          </div>
          <div className="relative hidden h-72 lg:block">
            <div className="absolute inset-0 rotate-3 rounded-[42px] bg-[#ffd078]" />
            <div className="absolute inset-5 -rotate-2 rounded-[34px] bg-caju/90" />
            <img
              src={product.iconUrl}
              alt=""
              className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[36px] shadow-[0_24px_45px_rgba(72,31,13,.28)]"
            />
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_320px] lg:py-20">
        <div>
          {product.highlights.zh.length > 0 ? (
            <section>
              <T
                zh={copy.highlights.zh}
                en={copy.highlights.en}
                as="h2"
                className="display-title mb-5 text-3xl font-bold"
              />
              <ul className="grid gap-3 sm:grid-cols-2">
                {product.highlights.zh.map((item, index) => (
                  <li
                    key={item}
                    className="relative overflow-hidden rounded-[22px] border border-line bg-card p-5 pl-12 text-sm font-semibold shadow-[0_8px_25px_rgba(67,41,28,.05)] before:absolute before:left-5 before:top-5 before:h-4 before:w-4 before:rounded-full before:bg-sun"
                  >
                    <span className="lang-zh">{item}</span>
                    <span className="lang-en">
                      {product.highlights.en[index] ?? item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.screenshots.length > 0 ? (
            <section className="mt-14">
              <T
                zh={copy.screenshots.zh}
                en={copy.screenshots.en}
                as="h2"
                className="display-title mb-5 text-3xl font-bold"
              />
              <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3">
                {product.screenshots.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="lift w-full rounded-[24px] border border-line bg-white shadow-[0_16px_35px_rgba(67,41,28,.10)]"
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="self-start rounded-[28px] border border-line bg-white/80 p-5 shadow-[0_14px_40px_rgba(67,41,28,.07)] backdrop-blur lg:sticky lg:top-24">
          <T zh="选择平台" en="Choose a platform" as="h2" className="display-title mb-4 text-2xl font-bold" />
          <PlatformCtas product={product} />
          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 text-sm font-semibold text-muted">
            {product.privacyUrl ? (
              isSameSiteUrl(product.privacyUrl) ? (
                <Link href={toSitePath(product.privacyUrl)}>
                  <T zh={copy.privacy.zh} en={copy.privacy.en} />
                </Link>
              ) : (
                <a href={product.privacyUrl} rel="noopener noreferrer">
                  <T zh={copy.privacy.zh} en={copy.privacy.en} />
                </a>
              )
            ) : null}
            {product.landingUrl ? (
              <a href={product.landingUrl} rel="noopener noreferrer">
                <T zh={copy.landing.zh} en={copy.landing.en} />
              </a>
            ) : null}
            {product.githubUrl ? (
              <a href={product.githubUrl} rel="noopener noreferrer">
                <T zh={copy.source.zh} en={copy.source.en} />
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
