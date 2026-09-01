"use client";

import { useSyncExternalStore } from "react";
import { PlatformCtas } from "./ProductCard";
import { detectClientPlatform, type Product } from "@/lib/product-types";

function subscribe() {
  return () => {};
}

export function DownloadPanel({ product }: { product: Product }) {
  const highlight = useSyncExternalStore(
    subscribe,
    detectClientPlatform,
    () => null,
  );
  return <PlatformCtas product={product} highlight={highlight} />;
}
