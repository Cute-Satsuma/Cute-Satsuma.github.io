import Link from "next/link";
import { ProductCatalog } from "@/components/ProductCatalog";
import { T } from "@/components/T";
import { copy, platformLabel } from "@/lib/copy";
import { getPublishedProducts } from "@/lib/products";
import { PLATFORM_IDS, type Product } from "@/lib/product-types";

function HeroProduct({ product, className }: { product: Product; className: string }) {
  return (
    <Link
      href={`/products/${product.slug}/`}
      className={`absolute flex max-w-[180px] items-center gap-2.5 rounded-[20px] border border-white/80 bg-white/90 p-2.5 pr-3.5 shadow-[0_18px_50px_rgba(85,46,26,.16)] backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(85,46,26,.2)] sm:max-w-[210px] sm:gap-3 sm:rounded-[22px] sm:p-3 sm:pr-5 ${className}`}
    >
      <img
        src={product.iconUrl}
        alt=""
        className="h-10 w-10 shrink-0 rounded-[14px] shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl"
      />
      <span>
        <strong className="block truncate text-xs sm:text-sm">
          <span className="lang-zh">{product.name.zh}</span>
          <span className="lang-en">{product.name.en}</span>
        </strong>
        <small className="text-[10px] font-semibold text-muted sm:text-[11px]">
          <span className="lang-zh">点击了解</span>
          <span className="lang-en">Explore app</span>
        </small>
      </span>
    </Link>
  );
}

export default function HomePage() {
  const products = getPublishedProducts();
  return (
    <main>
      <section className="relative overflow-hidden border-b border-line">
        <div className="soft-grid absolute inset-0 opacity-60" />
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-sun/20 blur-3xl" />
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-caju/10 blur-3xl" />
        <div className="relative mx-auto grid min-h-[650px] max-w-6xl items-center gap-8 px-5 py-16 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:py-20 lg:gap-10">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-caju backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-leaf" />
              <span>Made by Cute-Satsuma</span>
            </div>
            <T
              zh={copy.heroTitle.zh}
              en={copy.heroTitle.en}
              as="h1"
            className="display-title m-0 max-w-[680px] text-[2.7rem] font-bold leading-[1.08] sm:text-5xl lg:text-[4.5rem]"
            />
            <T
              zh={copy.heroLead.zh}
              en={copy.heroLead.en}
              as="p"
              className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg"
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products/"
                className="caju-action group inline-flex items-center gap-3 rounded-full px-6 py-3.5 font-semibold"
              >
                <T zh={copy.browseApps.zh} en={copy.browseApps.en} />
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/about/"
                className="rounded-full border border-line bg-white/70 px-6 py-3.5 font-semibold text-ink backdrop-blur hover:border-caju"
              >
                <T zh="认识 Caju" en="Meet Caju" />
              </Link>
          </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
              <span className="text-xs font-bold uppercase tracking-[.14em] text-muted">
                <T zh="支持平台" en="Platforms" />
              </span>
              {PLATFORM_IDS.map((id) => (
                <span key={id} className="text-sm font-semibold text-ink/70">
                  <T zh={platformLabel[id].zh} en={platformLabel[id].en} />
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-[390px] w-full max-w-[470px] sm:h-[420px] md:h-[460px] lg:h-[500px]">
            <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[44%_56%_60%_40%/45%_42%_58%_55%] bg-caju lg:h-[330px] lg:w-[330px]" />
            <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rotate-6 rounded-[38px] border border-white/70 bg-[#ffd078] shadow-[0_30px_80px_rgba(134,58,13,.25)] lg:h-[270px] lg:w-[270px] lg:rounded-[42px]" />
            <img
              src="/brand/caju_logo_512.png"
              alt="Caju"
              width={210}
              height={210}
              className="absolute left-1/2 top-1/2 z-10 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 -rotate-3 rounded-[38px] shadow-[0_22px_45px_rgba(92,45,20,.22)] lg:h-[210px] lg:w-[210px] lg:rounded-[44px]"
            />
            {products[0] ? <HeroProduct product={products[0]} className="left-0 top-2 -rotate-2 sm:-left-2 sm:top-5" /> : null}
            {products[1] ? <HeroProduct product={products[1]} className="bottom-2 right-0 rotate-2 sm:-right-2 sm:bottom-3" /> : null}
            {products[2] ? <HeroProduct product={products[2]} className="right-0 top-20 rotate-3 sm:-right-4 sm:top-24" /> : null}
          </div>
        </div>
      </section>
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <T zh="小而好用" en="Small, useful things" as="p" className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-caju" />
              <T
                zh={copy.allApps.zh}
                en={copy.allApps.en}
                as="h2"
                className="display-title m-0 text-4xl font-bold sm:text-5xl"
              />
            </div>
            <T
              zh="每个产品都专注解决一件事。"
              en="Each app stays focused on one job."
              as="p"
              className="max-w-xs text-muted"
            />
          </div>
          <ProductCatalog products={products} />
        </div>
      </section>
    </main>
  );
}
