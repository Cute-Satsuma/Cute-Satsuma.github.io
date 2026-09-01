import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { T } from "@/components/T";
import { copy } from "@/lib/copy";
import {
  getAllPrivacyPolicies,
  getPrivacyPolicy,
  privacyCanonicalUrl,
} from "@/lib/privacy";
import { getPublishedProduct } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPrivacyPolicies().map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPrivacyPolicy(slug);
  if (!policy) return { title: "Privacy · Caju" };
  return {
    title: `${policy.title.en} · Caju`,
    description: policy.title.en,
    alternates: { canonical: privacyCanonicalUrl(slug) },
  };
}

export default async function AppPrivacyPage({ params }: Props) {
  const { slug } = await params;
  const policy = getPrivacyPolicy(slug);
  if (!policy) notFound();
  const product = policy.productSlug
    ? getPublishedProduct(policy.productSlug)
    : undefined;

  return (
    <main className="relative overflow-hidden px-5 py-14 sm:py-20">
      <div className="soft-grid absolute inset-0 opacity-35" />
      <article className="prose-card policy-article relative mx-auto max-w-3xl overflow-hidden p-6 sm:p-10">
        <div className="absolute right-[-3rem] top-[-4rem] h-44 w-44 rounded-full bg-sun/30" />
        <div className="relative">
          <Link
            href="/privacy/"
            className="mb-6 inline-block text-xs font-bold uppercase tracking-[.18em] text-caju"
          >
            ← <T zh="全部隐私政策" en="All privacy policies" />
          </Link>
          <T
            zh={policy.title.zh}
            en={policy.title.en}
            as="h1"
            className="display-title m-0 text-4xl font-bold sm:text-5xl"
          />
          <T
            zh={`最后更新：${policy.updated.zh}`}
            en={`Last updated: ${policy.updated.en}`}
            as="p"
            className="mt-2 text-xs font-bold uppercase tracking-wide text-muted"
          />
          <div className="mt-8 text-base leading-8 text-muted">
            <div
              className="lang-zh policy-body"
              dangerouslySetInnerHTML={{ __html: policy.html.zh }}
            />
            <div
              className="lang-en policy-body"
              dangerouslySetInnerHTML={{ __html: policy.html.en }}
            />
          </div>
          {product ? (
            <p className="mt-10 text-sm font-semibold">
              <Link href={`/products/${product.slug}/`} className="text-caju">
                <T
                  zh={`了解 ${product.name.zh}`}
                  en={`About ${product.name.en}`}
                />
              </Link>
            </p>
          ) : null}
        </div>
      </article>
    </main>
  );
}
