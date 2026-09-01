"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  deleteProductFile,
  listProductFiles,
  listReleases,
  readProductFile,
  verifyAccess,
  writeProductFile,
  type GithubRelease,
  type GithubTarget,
} from "@/lib/github";
import {
  emptyProduct,
  PLATFORM_IDS,
  type PlatformId,
  type PlatformRelease,
  type Product,
} from "@/lib/product-types";
import { site } from "@/lib/site";

const SESSION_KEY = "caju-admin-session";

type Draft = Product & { sha?: string };

function loadSession(): GithubTarget | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GithubTarget;
  } catch {
    return null;
  }
}

function slugOk(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function AdminApp() {
  const [target, setTarget] = useState<GithubTarget | null>(null);
  const [login, setLogin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<Draft[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [releases, setReleases] = useState<GithubRelease[]>([]);

  useEffect(() => {
    const saved = loadSession();
    if (!saved?.token) return;
    void connect(saved);
    // Restore a tab session once on mount; connect is recreated each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connect(next: GithubTarget) {
    setBusy(true);
    setError("");
    try {
      const user = await verifyAccess(next);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setTarget(next);
      setLogin(user);
      await refresh(next);
    } catch (err) {
      sessionStorage.removeItem(SESSION_KEY);
      setTarget(null);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function refresh(next = target) {
    if (!next) return;
    setBusy(true);
    setError("");
    try {
      const files = await listProductFiles(next);
      const loaded = await Promise.all(
        files.map((file) => readProductFile(next, file.path)),
      );
      setItems(
        loaded
          .map(({ product, sha }) => ({ ...product, sha }))
          .sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug)),
      );
      try {
        setReleases(await listReleases(next));
      } catch {
        setReleases([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setBusy(false);
    }
  }

  async function save(draft: Draft) {
    if (!target) return;
    if (!slugOk(draft.slug)) {
      setError("slug 只能用小写字母、数字和连字符");
      return;
    }
    if (!draft.name.zh.trim() || !draft.name.en.trim()) {
      setError("中英文名称都要填");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { sha, ...product } = draft;
      await writeProductFile(target, product, sha);
      setEditing(null);
      await refresh(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(draft: Draft) {
    if (!target || !draft.sha) return;
    if (!window.confirm(`删除 ${draft.slug}？`)) return;
    setBusy(true);
    setError("");
    try {
      await deleteProductFile(target, draft.slug, draft.sha);
      setEditing(null);
      await refresh(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  if (!target) {
    return (
      <LoginForm
        busy={busy}
        error={error}
        onSubmit={(next) => void connect(next)}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-2xl font-bold">Admin</h1>
          <p className="m-0 text-sm text-muted">
            {login} · {target.owner}/{target.repo}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold"
            onClick={() => void refresh()}
            disabled={busy}
          >
            刷新
          </button>
          <button
            type="button"
            className="rounded-full bg-caju px-4 py-2 text-sm font-semibold text-white"
            onClick={() =>
              setEditing({
                ...emptyProduct(),
                sort: (items.at(-1)?.sort ?? 0) + 1,
              })
            }
          >
            新产品
          </button>
          <button
            type="button"
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold"
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setTarget(null);
              setEditing(null);
            }}
          >
            退出
          </button>
        </div>
      </div>
      {error ? <p className="m-0 text-sm text-red-700">{error}</p> : null}
      {busy ? <p className="m-0 text-sm text-muted">处理中…</p> : null}

      {editing ? (
        <ProductEditor
          draft={editing}
          isNew={!editing.sha}
          releases={releases}
          onChange={setEditing}
          onSave={() => void save(editing)}
          onDelete={() => void remove(editing)}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0">
          {items.map((item) => (
            <li key={item.slug}>
              <button
                type="button"
                onClick={() => setEditing(item)}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              >
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt=""
                    className="h-10 w-10 rounded-xl"
                  />
                ) : (
                  <span className="h-10 w-10 rounded-xl bg-cream" />
                )}
                <span className="font-semibold">
                  {item.name.zh} / {item.name.en}
                </span>
                <span className="ml-auto text-xs font-semibold text-muted">
                  {item.published ? "已上架" : "草稿"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LoginForm({
  busy,
  error,
  onSubmit,
}: {
  busy: boolean;
  error: string;
  onSubmit: (target: GithubTarget) => void;
}) {
  const [owner, setOwner] = useState(site.github.owner);
  const [repo, setRepo] = useState(site.github.repo);
  const [branch, setBranch] = useState(site.github.branch);
  const [token, setToken] = useState("");

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-3 px-5 py-12"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          owner: owner.trim(),
          repo: repo.trim(),
          branch: branch.trim() || "main",
          contentPath: site.github.contentPath,
          token: token.trim(),
        });
      }}
    >
      <h1 className="m-0 text-2xl font-bold">Admin</h1>
      <p className="m-0 text-sm text-muted">
        使用 Fine-grained PAT（Contents 读写，可选 Releases 只读）。Token
        只存在当前标签页，不会写入仓库。
      </p>
      <label className="text-sm font-semibold">
        Owner
        <input
          className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 font-normal"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
        />
      </label>
      <label className="text-sm font-semibold">
        Repo
        <input
          className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 font-normal"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          required
        />
      </label>
      <label className="text-sm font-semibold">
        Branch
        <input
          className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 font-normal"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
      </label>
      <label className="text-sm font-semibold">
        GitHub token
        <input
          type="password"
          autoComplete="off"
          className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 font-normal"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
      </label>
      {error ? <p className="m-0 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-caju px-4 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        {busy ? "验证中…" : "进入"}
      </button>
    </form>
  );
}

function ProductEditor({
  draft,
  isNew,
  releases,
  onChange,
  onSave,
  onDelete,
  onCancel,
}: {
  draft: Draft;
  isNew: boolean;
  releases: GithubRelease[];
  onChange: (draft: Draft) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const patch = (partial: Partial<Product>) =>
    onChange({ ...draft, ...partial });

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[0_8px_24px_rgba(62,39,35,0.08)]">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="slug">
          <input
            className={fieldClass}
            value={draft.slug}
            disabled={!isNew}
            onChange={(e) =>
              patch({ slug: e.target.value.trim().toLowerCase() })
            }
          />
        </Field>
        <Field label="排序">
          <input
            type="number"
            className={fieldClass}
            value={draft.sort}
            onChange={(e) => patch({ sort: Number(e.target.value) })}
          />
        </Field>
        <Field label="中文名">
          <input
            className={fieldClass}
            value={draft.name.zh}
            onChange={(e) =>
              patch({ name: { ...draft.name, zh: e.target.value } })
            }
          />
        </Field>
        <Field label="English name">
          <input
            className={fieldClass}
            value={draft.name.en}
            onChange={(e) =>
              patch({ name: { ...draft.name, en: e.target.value } })
            }
          />
        </Field>
        <Field label="中文一句话">
          <input
            className={fieldClass}
            value={draft.tagline.zh}
            onChange={(e) =>
              patch({ tagline: { ...draft.tagline, zh: e.target.value } })
            }
          />
        </Field>
        <Field label="English tagline">
          <input
            className={fieldClass}
            value={draft.tagline.en}
            onChange={(e) =>
              patch({ tagline: { ...draft.tagline, en: e.target.value } })
            }
          />
        </Field>
      </div>

      <Field label="中文介绍">
        <textarea
          className={`${fieldClass} min-h-24`}
          value={draft.description.zh}
          onChange={(e) =>
            patch({ description: { ...draft.description, zh: e.target.value } })
          }
        />
      </Field>
      <Field label="English description">
        <textarea
          className={`${fieldClass} min-h-24`}
          value={draft.description.en}
          onChange={(e) =>
            patch({ description: { ...draft.description, en: e.target.value } })
          }
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="卖点（中文，一行一条）">
          <textarea
            className={`${fieldClass} min-h-24`}
            value={draft.highlights.zh.join("\n")}
            onChange={(e) =>
              patch({
                highlights: {
                  ...draft.highlights,
                  zh: lines(e.target.value),
                },
              })
            }
          />
        </Field>
        <Field label="Highlights (EN, one per line)">
          <textarea
            className={`${fieldClass} min-h-24`}
            value={draft.highlights.en.join("\n")}
            onChange={(e) =>
              patch({
                highlights: {
                  ...draft.highlights,
                  en: lines(e.target.value),
                },
              })
            }
          />
        </Field>
      </div>

      <Field label="图标 URL">
        <input
          className={fieldClass}
          value={draft.iconUrl}
          onChange={(e) => patch({ iconUrl: e.target.value })}
        />
      </Field>
      <Field label="截图 URL（一行一个）">
        <textarea
          className={`${fieldClass} min-h-20`}
          value={draft.screenshots.join("\n")}
          onChange={(e) => patch({ screenshots: lines(e.target.value) })}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="隐私政策 URL">
          <input
            className={fieldClass}
            value={draft.privacyUrl ?? ""}
            onChange={(e) => patch({ privacyUrl: e.target.value || undefined })}
          />
        </Field>
        <Field label="产品落地页 URL">
          <input
            className={fieldClass}
            value={draft.landingUrl ?? ""}
            onChange={(e) => patch({ landingUrl: e.target.value || undefined })}
          />
        </Field>
        <Field label="GitHub URL">
          <input
            className={fieldClass}
            value={draft.githubUrl ?? ""}
            onChange={(e) => patch({ githubUrl: e.target.value || undefined })}
          />
        </Field>
        <Field label="分类">
          <select
            className={fieldClass}
            value={draft.category}
            onChange={(e) =>
              patch({ category: e.target.value as Product["category"] })
            }
          >
            <option value="tool">tool</option>
            <option value="game">game</option>
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={draft.published}
          onChange={(e) => patch({ published: e.target.checked })}
        />
        上架到前台
      </label>

      <PlatformEditor
        platforms={draft.platforms}
        releases={releases}
        onChange={(platforms) => patch({ platforms })}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full bg-caju px-4 py-2 text-sm font-semibold text-white"
          onClick={onSave}
        >
          保存到 GitHub
        </button>
        <button
          type="button"
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold"
          onClick={onCancel}
        >
          取消
        </button>
        {!isNew ? (
          <button
            type="button"
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
            onClick={onDelete}
          >
            删除
          </button>
        ) : null}
      </div>
      <p className="m-0 text-xs text-muted">
        保存后 GitHub Actions 会重建站点，大约一分钟后前台更新。大安装包请先在
        GitHub Releases 网页上传，再把下载地址贴进对应平台。
      </p>
    </div>
  );
}

function PlatformEditor({
  platforms,
  releases,
  onChange,
}: {
  platforms: PlatformRelease[];
  releases: GithubRelease[];
  onChange: (platforms: PlatformRelease[]) => void;
}) {
  const assets = useMemo(
    () =>
      releases.flatMap((release) =>
        release.assets.map((asset) => ({
          label: `${release.tag_name} / ${asset.name}`,
          url: asset.browser_download_url,
        })),
      ),
    [releases],
  );

  function update(index: number, partial: Partial<PlatformRelease>) {
    onChange(
      platforms.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-lg font-bold">平台</h2>
        <button
          type="button"
          className="text-sm font-semibold text-caju"
          onClick={() =>
            onChange([...platforms, { platform: "android" satisfies PlatformId }])
          }
        >
          添加平台
        </button>
      </div>
      {platforms.map((item, index) => (
        <div
          key={`${item.platform}-${index}`}
          className="grid gap-2 rounded-xl border border-ink/10 p-3 sm:grid-cols-2"
        >
          <select
            className={fieldClass}
            value={item.platform}
            onChange={(e) =>
              update(index, { platform: e.target.value as PlatformId })
            }
          >
            {PLATFORM_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <input
            className={fieldClass}
            placeholder="version"
            value={item.version ?? ""}
            onChange={(e) =>
              update(index, { version: e.target.value || undefined })
            }
          />
          <input
            className={fieldClass}
            placeholder="商店 URL（Play / App Store）"
            value={item.storeUrl ?? ""}
            onChange={(e) =>
              update(index, { storeUrl: e.target.value || undefined })
            }
          />
          <input
            className={fieldClass}
            placeholder="Web 直开 URL"
            value={item.webUrl ?? ""}
            onChange={(e) =>
              update(index, { webUrl: e.target.value || undefined })
            }
          />
          <input
            className={`${fieldClass} sm:col-span-2`}
            placeholder="直链下载 URL"
            value={item.downloadUrl ?? ""}
            onChange={(e) =>
              update(index, { downloadUrl: e.target.value || undefined })
            }
          />
          {assets.length > 0 ? (
            <select
              className={`${fieldClass} sm:col-span-2`}
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  update(index, { downloadUrl: e.target.value });
                }
              }}
            >
              <option value="">从本仓库 Release 填入下载地址</option>
              {assets.map((asset) => (
                <option key={asset.url} value={asset.url}>
                  {asset.label}
                </option>
              ))}
            </select>
          ) : null}
          <button
            type="button"
            className="justify-self-start text-sm font-semibold text-red-700"
            onClick={() => onChange(platforms.filter((_, i) => i !== index))}
          >
            移除此平台
          </button>
        </div>
      ))}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <div className="mt-1 font-normal">{children}</div>
    </label>
  );
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

const fieldClass =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm";
