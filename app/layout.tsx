import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Material for MkDocs Configurator",
  description: "Configure your documentation visually",
  openGraph: {
    title: "Material for MkDocs Configurator",
    description: "Configure your documentation visually",
    url: "https://materialconfig.dev",
    siteName: "materialconfig.dev",
    images: [
      {
        url: "https://materialconfig.dev/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "materialconfig.dev",
      },
    ],
    locale: "en_US",
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
