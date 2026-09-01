import { ProductCard } from "@/components/ProductCard";
import { T } from "@/components/T";
import { categoryLabel, copy } from "@/lib/copy";
import { groupProductsByCategory } from "@/lib/products";
import type { Product } from "@/lib/product-types";

export function ProductCatalog({ products }: { products: Product[] }) {
  const groups = groupProductsByCategory(products);
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      {groups.map(({ category, products: items }) => (
        <section key={category} aria-labelledby={`catalog-${category}`}>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
            <div>
              <T
                zh={copy.appType.zh}
                en={copy.appType.en}
                as="p"
                className="mb-1.5 text-xs font-bold uppercase tracking-[.18em] text-caju"
              />
              <h3 id={`catalog-${category}`} className="display-title m-0 text-2xl font-bold sm:text-3xl">
                <T zh={categoryLabel[category].zh} en={categoryLabel[category].en} />
              </h3>
            </div>
            <p className="m-0 text-sm text-muted">
              {items.length}
              <span className="lang-zh"> 款</span>
              <span className="lang-en"> {items.length === 1 ? "app" : "apps"}</span>
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
