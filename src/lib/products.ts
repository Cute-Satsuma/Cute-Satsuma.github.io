import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isProduct, PRODUCT_CATEGORIES, type Product, type ProductCategory } from "./product-types";

const productsDir = join(process.cwd(), "content/products");

export function getAllProducts(): Product[] {
  const files = readdirSync(productsDir).filter((name) => name.endsWith(".json"));
  const products: Product[] = [];
  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(productsDir, file), "utf8")) as unknown;
    if (!isProduct(raw)) {
      throw new Error(`Invalid product file: ${file}`);
    }
    products.push(raw);
  }
  return products.sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug));
}

export function getPublishedProducts(): Product[] {
  return getAllProducts().filter((product) => product.published);
}

export function getPublishedProduct(slug: string): Product | undefined {
  return getPublishedProducts().find((product) => product.slug === slug);
}

export type ProductCategoryGroup = {
  category: ProductCategory;
  products: Product[];
};

export function groupProductsByCategory(products: Product[]): ProductCategoryGroup[] {
  const buckets = new Map<ProductCategory, Product[]>();
  for (const category of PRODUCT_CATEGORIES) {
    buckets.set(category, []);
  }
  for (const product of products) {
    buckets.get(product.category)?.push(product);
  }
  return PRODUCT_CATEGORIES.flatMap((category) => {
    const grouped = buckets.get(category) ?? [];
    if (grouped.length === 0) return [];
    return [{ category, products: grouped }];
  });
}
