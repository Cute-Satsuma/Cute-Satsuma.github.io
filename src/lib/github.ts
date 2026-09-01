import { isProduct, type Product } from "./product-types";

export type GithubTarget = {
  owner: string;
  repo: string;
  branch: string;
  contentPath: string;
  token: string;
};

export type RepoFile = {
  name: string;
  path: string;
  sha: string;
};

export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

export type GithubRelease = {
  tag_name: string;
  name: string;
  assets: ReleaseAsset[];
};

const api = "https://api.github.com";

function headers(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function request<T>(
  target: GithubTarget,
  path: string,
  init?: RequestInit & { allowNotFound?: boolean },
): Promise<T> {
  const { allowNotFound, ...fetchInit } = init ?? {};
  const res = await fetch(`${api}${path}`, {
    ...fetchInit,
    headers: {
      ...headers(target.token),
      ...(fetchInit.headers ?? {}),
    },
  });
  if (allowNotFound && res.status === 404) return null as T;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status}: ${body.slice(0, 280)}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function verifyAccess(target: GithubTarget): Promise<string> {
  const user = await request<{ login: string }>(target, "/user");
  await request(target, `/repos/${target.owner}/${target.repo}`);
  return user.login;
}

export async function listProductFiles(target: GithubTarget): Promise<RepoFile[]> {
  const data = await request<RepoFile[] | RepoFile | null>(
    target,
    `/repos/${target.owner}/${target.repo}/contents/${target.contentPath}?ref=${encodeURIComponent(target.branch)}`,
    { allowNotFound: true },
  );
  if (!data) return [];
  const files = Array.isArray(data) ? data : [data];
  return files.filter((file) => file.name.endsWith(".json"));
}

export async function readProductFile(
  target: GithubTarget,
  path: string,
): Promise<{ product: Product; sha: string }> {
  const data = await request<{ content: string; encoding: string; sha: string }>(
    target,
    `/repos/${target.owner}/${target.repo}/contents/${path}?ref=${encodeURIComponent(target.branch)}`,
  );
  const json = decodeBase64Utf8(data.content.replace(/\n/g, ""));
  const product = JSON.parse(json) as unknown;
  if (!isProduct(product)) {
    throw new Error(`Not a product file: ${path}`);
  }
  return { product, sha: data.sha };
}

export async function writeProductFile(
  target: GithubTarget,
  product: Product,
  sha?: string,
): Promise<void> {
  const path = `${target.contentPath}/${product.slug}.json`;
  const body = {
    message: sha
      ? `admin: update ${product.slug}`
      : `admin: add ${product.slug}`,
    content: encodeBase64Utf8(`${JSON.stringify(product, null, 2)}\n`),
    branch: target.branch,
    ...(sha ? { sha } : {}),
  };
  await request(target, `/repos/${target.owner}/${target.repo}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteProductFile(
  target: GithubTarget,
  slug: string,
  sha: string,
): Promise<void> {
  const path = `${target.contentPath}/${slug}.json`;
  await request(target, `/repos/${target.owner}/${target.repo}/contents/${path}`, {
    method: "DELETE",
    body: JSON.stringify({
      message: `admin: remove ${slug}`,
      sha,
      branch: target.branch,
    }),
  });
}

export async function listReleases(target: GithubTarget): Promise<GithubRelease[]> {
  return request<GithubRelease[]>(
    target,
    `/repos/${target.owner}/${target.repo}/releases?per_page=20`,
  );
}

function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64Utf8(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
