import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DownloadPanel } from "@/components/DownloadPanel";
import { T } from "@/components/T";
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
    title: `Download ${product.name.en}`,
    description: product.tagline.en,
  };
}

export default async function DownloadPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) notFound();

  return (
    <main className="relative flex min-h-[70vh] items-center overflow-hidden px-5 py-14">
      <div className="soft-grid absolute inset-0 opacity-50" />
      <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-sun/20 blur-3xl" />
      <div className="relative mx-auto w-full max-w-xl">
        <Link
          href={`/products/${product.slug}/`}
          className="mb-5 inline-block text-xs font-bold uppercase tracking-[.16em] text-caju"
        >
          ← <T zh="返回产品" en="Back to app" />
        </Link>
        <section className="prose-card p-5 sm:p-8">
          <div className="mb-7 flex items-center gap-4 border-b border-line pb-6">
            <img
              src={product.iconUrl}
              alt=""
              width={68}
              height={68}
              className="h-[68px] w-[68px] rounded-[20px] shadow-[0_12px_24px_rgba(83,42,20,.16)]"
            />
            <div>
              <T
                zh={product.name.zh}
                en={product.name.en}
                as="h1"
                className="display-title m-0 text-3xl font-bold"
              />
              <T
                zh="选择下载平台"
                en="Choose your platform"
                as="p"
                className="mt-1 text-sm text-muted"
              />
            </div>
          </div>
          <DownloadPanel product={product} />
          <T
            zh="下载将前往应用商店或 GitHub Releases。"
            en="Downloads open the app store or GitHub Releases."
            as="p"
            className="mb-0 mt-5 text-center text-xs text-muted"
          />
        </section>
      </div>
    </main>
  );
}
