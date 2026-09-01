import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/T";
import { copy } from "@/lib/copy";
import { getPrivacyMetas, privacyPath } from "@/lib/privacy";
import { getPublishedProduct } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy · Caju",
  description: "The Caju portal is a static site with no accounts and no analytics SDK.",
  alternates: { canonical: `${site.url}/privacy/` },
};

export default function PrivacyPage() {
  const policies = getPrivacyMetas();

  return (
    <main className="relative overflow-hidden px-5 py-14 sm:py-20">
      <div className="soft-grid absolute inset-0 opacity-35" />
      <section className="prose-card relative mx-auto max-w-3xl overflow-hidden p-6 sm:p-10">
        <div className="absolute right-[-3rem] top-[-4rem] h-44 w-44 rounded-full bg-sun/30" />
        <div className="relative">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0df] text-xl" aria-hidden="true">
            ◉
          </span>
          <T
            zh={copy.privacyTitle.zh}
            en={copy.privacyTitle.en}
            as="h1"
            className="display-title m-0 text-4xl font-bold sm:text-5xl"
          />
          <T
            zh="最后更新：2026 年 8 月"
            en="Last updated: August 2026"
            as="p"
            className="mt-2 text-xs font-bold uppercase tracking-wide text-muted"
          />
          <div className="mt-8 space-y-6 text-base leading-8 text-muted">
            <div className="border-l-2 border-caju pl-5">
              <T zh={copy.privacyP1.zh} en={copy.privacyP1.en} as="p" />
            </div>
            <div className="border-l-2 border-sun pl-5">
              <T zh={copy.privacyP2.zh} en={copy.privacyP2.en} as="p" />
            </div>
          </div>

          <T
            zh="应用隐私政策"
            en="App privacy policies"
            as="h2"
            className="display-title mt-10 text-2xl font-bold"
          />
          <ul className="mt-4 grid gap-3">
            {policies.map((policy) => {
              const product = policy.productSlug
                ? getPublishedProduct(policy.productSlug)
                : undefined;
              return (
                <li key={policy.slug}>
                  <Link
                    href={privacyPath(policy.slug)}
                    className="block rounded-[22px] border border-line bg-white/80 px-5 py-4 shadow-[0_8px_25px_rgba(67,41,28,.05)] hover:border-caju"
                  >
                    <T
                      zh={product?.name.zh ?? policy.title.zh}
                      en={product?.name.en ?? policy.title.en}
                      as="span"
                      className="block text-base font-semibold text-ink"
                    />
                    <T
                      zh={policy.title.zh}
                      en={policy.title.en}
                      as="span"
                      className="mt-1 block text-sm text-muted"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
