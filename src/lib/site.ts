export const site = {
  name: "Caju",
  brandZh: "可爱桔",
  org: "Cute-Satsuma",
  githubOrg: "https://github.com/Cute-Satsuma",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cute-satsuma.github.io",
  github: {
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? "Cute-Satsuma",
    repo: process.env.NEXT_PUBLIC_GITHUB_REPO ?? "Cute-Satsuma.github.io",
    branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "main",
    contentPath: "content/products",
  },
} as const;
