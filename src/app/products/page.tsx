import type { Metadata } from "next";
import { ProductCatalog } from "@/components/ProductCatalog";
import { T } from "@/components/T";
import { copy } from "@/lib/copy";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Apps · Caju",
};

export default function ProductsPage() {
  const products = getPublishedProducts();
  return (
    <main>
      <section className="soft-grid border-b border-line px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <T zh="Caju 产品" en="The Caju collection" as="p" className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-caju" />
          <T
            zh={copy.allApps.zh}
            en={copy.allApps.en}
            as="h1"
            className="display-title m-0 text-5xl font-bold sm:text-6xl"
          />
          <T
            zh="小而专注，打开就能用。"
            en="Small, focused, and ready when you are."
            as="p"
            className="mt-4 text-lg text-muted"
          />
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <ProductCatalog products={products} />
      </div>
    </main>
  );
}
