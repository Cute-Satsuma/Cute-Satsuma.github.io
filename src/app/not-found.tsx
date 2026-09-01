import Link from "next/link";
import { T } from "@/components/T";
import { copy } from "@/lib/copy";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-xl px-5 py-16 text-center">
      <T
        zh={copy.notFoundTitle.zh}
        en={copy.notFoundTitle.en}
        as="h1"
        className="text-2xl font-bold"
      />
      <T
        zh={copy.notFoundBody.zh}
        en={copy.notFoundBody.en}
        as="p"
        className="mt-3 text-muted"
      />
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-caju px-5 py-2.5 font-semibold text-white"
      >
        <T zh={copy.homeLink.zh} en={copy.homeLink.en} />
      </Link>
    </main>
  );
}
