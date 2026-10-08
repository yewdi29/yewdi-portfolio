import type { Metadata } from "next";
import { Inter, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.dossier}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL("https://yewdielvenzor.com"),
  openGraph: {
    title: `${site.name} — ${site.dossier}`,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable}`}>
      <body className={`${grotesk.className} antialiased`}>{children}</body>
    </html>
  );
}
