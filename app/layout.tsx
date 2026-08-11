import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/site-header/navbar";
import { Footer } from "@/components/site-footer/footer";
import { AnalyticsTracker } from "@/components/auth/analytics-tracker";
import { CookieConsent } from "@/components/auth/cookie-consent";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kodedristi.com"),
  title: {
    default: "KodeDristi Software — One Platform. Every Solution.",
    template: "%s — KodeDristi Software",
  },
  description:
    "KodeDristi Software Pvt. Ltd. builds web & mobile apps, SaaS products, AI automation and custom software, and runs applied IT courses — #WithYouEveryStep.",
  keywords: [
    "KodeDristi",
    "software development Nepal",
    "AI software development Nepal",
    "custom software development",
    "IT courses Nepal",
  ],
  openGraph: {
    title: "KodeDristi Software — One Platform. Every Solution.",
    description:
      "Web & mobile apps, SaaS products, AI automation, custom software and applied IT courses. #WithYouEveryStep",
    siteName: "KodeDristi Software",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-text-secondary">
        <ThemeProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <AnalyticsTracker />
            <CookieConsent />
          </ThemeProvider>
      </body>
    </html>
  );
}
