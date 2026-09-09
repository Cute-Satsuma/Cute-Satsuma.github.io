export const copy = {
  navProducts: { zh: "产品", en: "Apps" },
  navAbout: { zh: "关于", en: "About" },
  langSwitchToEn: { zh: "EN", en: "EN" },
  langSwitchToZh: { zh: "中文", en: "中文" },
  heroTitle: {
    zh: "可爱桔（Caju）的小工具，多平台可用。",
    en: "Small tools from Caju, on the platforms you use.",
  },
  heroLead: {
    zh: "Android、Web、macOS、Windows。能下载的直接下，有网页版的可以直接用。",
    en: "Android, Web, macOS, and Windows. Download where we ship a build; open the web app when there is one.",
  },
  browseApps: { zh: "浏览产品", en: "Browse apps" },
  platforms: { zh: "平台", en: "Platforms" },
  allApps: { zh: "全部产品", en: "All apps" },
  appType: { zh: "应用类型", en: "App type" },
  viewApp: { zh: "了解更多", en: "Learn more" },
  download: { zh: "下载", en: "Download" },
  downloadDirect: { zh: "直接下载", en: "Direct download" },
  openWeb: { zh: "打开使用", en: "Open" },
  getOnPlay: { zh: "前往 Google Play", en: "Get it on Google Play" },
  appStore: { zh: "App Store", en: "App Store" },
  otherPlatforms: { zh: "其它平台", en: "Other platforms" },
  suggestedForYou: { zh: "当前系统建议", en: "Suggested for this device" },
  noBuildYet: {
    zh: "这个平台还没有安装包，可通过商店或其它平台使用。",
    en: "No build for this platform yet. Try the store or another platform.",
  },
  macosGatekeeper: {
    zh: "未公证。若提示无法打开：按住 Control 点图标再打开，或到系统设置 → 隐私与安全性里允许。",
    en: "Not notarized. If macOS blocks it: Control-click the app and choose Open, or allow it in System Settings → Privacy & Security.",
  },
  windowsSmartScreen: {
    zh: "未代码签名。若 SmartScreen 提示已保护电脑：点「更多信息」，再选「仍要运行」。",
    en: "Not code-signed. If SmartScreen says Windows protected your PC: choose More info, then Run anyway.",
  },
  highlights: { zh: "特点", en: "Highlights" },
  screenshots: { zh: "截图", en: "Screenshots" },
  privacy: { zh: "隐私政策", en: "Privacy Policy" },
  landing: { zh: "产品页", en: "Product page" },
  source: { zh: "源代码", en: "Source" },
  footerNote: {
    zh: "Cute-Satsuma · Caju 不翻译",
    en: "Cute-Satsuma · Caju is never translated",
  },
  notFoundTitle: { zh: "没有这个页面", en: "Page not found" },
  notFoundBody: {
    zh: "回到首页看看有哪些产品。",
    en: "Head home to see the apps.",
  },
  homeLink: { zh: "回首页", en: "Home" },
  aboutTitle: { zh: "关于可爱桔（Caju）", en: "About Caju" },
  aboutP1: {
    zh: "Caju 读作「卡朱」，来自 Cute + 桔。GitHub 组织名是 Cute-Satsuma。品牌名在各语言里都不翻译。",
    en: "Caju is pronounced “kah-joo”: Cute + Ju (mandarin orange). The GitHub org is Cute-Satsuma. The name Caju is never translated.",
  },
  aboutP2: {
    zh: "我们做免费、克制、好认的小工具。卖点如实写，不堆装饰，也不承诺实验室级精度。",
    en: "We make small, restrained tools that stay easy to read. Claims stay factual. No laboratory-grade promises.",
  },
  aboutP3: {
    zh: "应用显示名称只使用功能词，例如分贝仪、数独、扫一扫；Caju 是工作室品牌，不作为应用名后缀。",
    en: "App display names use only the function name, such as Sound Meter, Sudoku, and QR Scanner. Caju remains the studio brand, not an app-name suffix.",
  },
  privacyTitle: { zh: "门户隐私说明", en: "Portal privacy" },
  privacyP1: {
    zh: "本站是静态页面，没有账号系统，也不嵌入统计 SDK。各应用的隐私政策集中在本站 /privacy/ 下。商店里已经提交的旧地址会跳转到对应页面。",
    en: "This site is static. There are no accounts and no analytics SDK. App privacy policies live under /privacy/ on this site. Store URLs submitted earlier redirect to the matching page.",
  },
  privacyP2: {
    zh: "下载安装包会跳转到 GitHub Releases 或应用商店。访问记录由托管方（GitHub）按其政策处理。",
    en: "Downloads go to GitHub Releases or an app store. The host (GitHub) may process access logs under its own policy.",
  },
} as const;

export const platformLabel: Record<string, Localized> = {
  android: { zh: "Android", en: "Android" },
  ios: { zh: "iOS", en: "iOS" },
  macos: { zh: "macOS", en: "macOS" },
  windows: { zh: "Windows", en: "Windows" },
  web: { zh: "Web", en: "Web" },
};

export const categoryLabel: Record<"tool" | "game", Localized> = {
  tool: { zh: "工具", en: "Tools" },
  game: { zh: "游戏", en: "Games" },
};

type Localized = { zh: string; en: string };
