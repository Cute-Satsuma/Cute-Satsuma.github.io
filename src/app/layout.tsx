import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Caju",
    template: "%s",
  },
  description:
    "Caju apps for Android, Web, macOS and Windows. Download a build or open the web app.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Caju",
    description:
      "Small tools from Cute-Satsuma. Download or open Caju apps across platforms.",
    url: site.url,
    siteName: "Caju",
    images: [{ url: "/brand/caju_logo_512.png" }],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Script id="caju-lang" strategy="beforeInteractive">{`
          (function () {
            try {
              var stored = localStorage.getItem("caju-lang");
              var lang = stored
                ? (stored === "zh" ? "zh-CN" : "en")
                : ((navigator.language || "").toLowerCase().indexOf("zh") === 0 ? "zh-CN" : "en");
              document.documentElement.lang = lang;
            } catch (e) {}
          })();
        `}</Script>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
