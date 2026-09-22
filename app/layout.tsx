import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
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
    <html lang="en">
      <body className={`${grotesk.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
