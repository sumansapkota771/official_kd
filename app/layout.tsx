import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FirstLoadSplash } from "@/components/motion/first-load-splash";
import { Navbar } from "@/components/site-header/navbar";
import { Footer } from "@/components/site-footer/footer";
import { GlobalChrome } from "@/components/global-chrome";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { AnalyticsTracker } from "@/components/auth/analytics-tracker";
import { CookieConsent } from "@/components/auth/cookie-consent";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://official-kd.vercel.app"),
  title: {
    default: "KodeDristi Software — Software Delivery, AI & Courses",
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
    title: "KodeDristi Software — Software Delivery, AI & Courses",
    description:
      "Web & mobile apps, SaaS products, AI automation, custom software and applied IT courses. #WithYouEveryStep",
    siteName: "KodeDristi Software",
    type: "website",
  },
};

import { listContent } from "@/lib/content/store";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const visualChapters = await listContent("visual-chapter");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${archivo.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-secondary">
        <ThemeProvider>
          <SmoothScroll />
          <FirstLoadSplash />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <GlobalChrome navbar={<Navbar />} footer={<Footer />} visualChapters={visualChapters}>
            {children}
          </GlobalChrome>
          <AnalyticsTracker />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
