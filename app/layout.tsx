import type { Metadata, Viewport } from "next";
import { Geist_Mono, Hanken_Grotesk, Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { company } from "@/lib/content";
import "./globals.css";

/*
 * Headings, reading text and the small capital labels. To change a face, swap
 * it here and keep the variable name: the stylesheet only knows the variables.
 */
const display = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Polaris Consulting | Custom ERP built around how your business works",
    template: "%s | Polaris Consulting",
  },
  description:
    "Polaris Consulting designs and builds custom ERP systems, workflow automation and post-sales WhatsApp CRM agents around the way your organisation actually works. Live in 3 months, for less than a standard ERP.",
  keywords: [
    "custom ERP",
    "ERP for manufacturing",
    "business process consulting",
    "WhatsApp CRM",
    "post sales automation",
    "inventory management",
    "Polaris Consulting",
  ],
  openGraph: {
    type: "website",
    siteName: "Polaris Consulting",
    title: "Polaris Consulting | Software that fits your business",
    description:
      "Custom ERP, process consulting and automation. Your business should not change to fit the software.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.name,
  slogan: company.tagline,
  description:
    "Business consulting and technology solutions: process improvement, custom ERP modules, workflow automation and post-sales CRM agents.",
  email: company.email,
  telephone: company.phoneDisplay,
  url: siteUrl,
  areaServed: "IN",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-dvh overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-5 focus:py-4 focus:mono-label focus:text-navy"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
