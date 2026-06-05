import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f1e8",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://arzware.com"),
  title: "Arzware — Websites, Software Systems, Dashboards & Automation",
  description:
    "Arzware helps businesses modernize outdated websites, manual workflows, scattered tools, and unclear operations with premium websites, dashboards, automations, web apps, and AI-assisted systems.",
  applicationName: "Arzware",
  authors: [{ name: "Arzware" }],
  keywords: [
    "Arzware",
    "premium websites",
    "custom software",
    "business automation",
    "dashboards",
    "CRM-lite systems",
    "AI-assisted workflows",
    "digital modernization",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Arzware — Websites, Software Systems, Dashboards & Automation",
    description:
      "Modernize outdated websites, manual workflows, scattered tools, and unclear operations with premium websites, dashboards, automations, web apps, and AI-assisted systems.",
    url: "https://arzware.com",
    siteName: "Arzware",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arzware — Websites, Software Systems, Dashboards & Automation",
    description:
      "Premium websites, dashboards, automations, web apps, and AI-assisted systems for cleaner digital operations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
