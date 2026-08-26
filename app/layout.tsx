import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FirstLoadSplash } from "@/components/motion/first-load-splash";
import { Navbar } from "@/components/site-header/navbar";
import { Footer } from "@/components/site-footer/footer";
import { GlobalChrome } from "@/components/global-chrome";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { AnalyticsTracker } from "@/components/auth/analytics-tracker";
import { CookieConsent } from "@/components/auth/cookie-consent";
import { navGroups } from "@/lib/data/nav";
import { getSolutions } from "@/lib/content/resolvers";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  display: "swap",
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

/**
 * The Solutions dropdown used to be pure static data. It went stale the
 * moment someone unpublished a solution in the admin — the nav kept
 * linking to it regardless, and every one of those links 404’d. Rebuilding
 * this group from the actual published list on every request means an
 * unpublish is instantly reflected everywhere the nav renders (desktop,
 * mobile, footer all take the same resolved list), and it can never drift
 * out of sync again — there is nothing left to keep in sync.
 */
async function getLiveNavGroups() {
  const solutions = await getSolutions();
  return navGroups.map((group) =>
    group.label === "Solutions"
      ? {
          ...group,
          items: solutions.map((s) => ({
            label: s.name,
            href: `/solutions/${s.slug}`,
            description: s.tagline,
          })),
        }
      : group
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const liveNavGroups = await getLiveNavGroups();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${albertSans.variable}`}
    >
      <head>
        {/* Scroll reveals are written into the server markup as opacity: 0,
            so with scripting off there is nothing left to turn them back on.
            `!important` is what lets a stylesheet rule beat those inline
            styles. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
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
          <GlobalChrome navbar={<Navbar navGroups={liveNavGroups} />} footer={<Footer navGroups={liveNavGroups} />}>
            {children}
          </GlobalChrome>
          <AnalyticsTracker />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
