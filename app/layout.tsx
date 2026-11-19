import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { company } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
  themeColor: "#ffffff",
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
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-dvh overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-blue focus:px-5 focus:py-3 focus:text-label focus:uppercase focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Nav />
          {/* The top padding clears the fixed navigation bar (4rem plus its 4px border). */}
          <main id="main" className="pt-17">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
