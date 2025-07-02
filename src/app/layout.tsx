import type { Metadata } from "next";
import { Merriweather, Open_Sans } from "next/font/google";
import "./globals.css";
import { TwentyFirstToolbar } from "@21st-extension/toolbar-next";
import { ReactPlugin } from "@21st-extension/react";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hajila Bau GmbH - Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück",
  description: "Professionelle Baudienstleistungen in Osnabrück: Klinkerarbeiten, Verblendmauerwerk, Betonbau, WDVS und mehr. Qualität und Präzision seit 2016.",
  keywords: "Hajila Bau, Osnabrück, Klinkerarbeiten, Verblendmauerwerk, Betonbau, WDVS, Bauunternehmen, Hochbau",
  authors: [{ name: "Hajila Bau GmbH" }],
  creator: "Hajila Bau GmbH",
  publisher: "Hajila Bau GmbH",
  robots: "index, follow",
  openGraph: {
    title: "Hajila Bau GmbH - Ihr Partner für Hochbau & Klinkerarbeiten",
    description: "Professionelle Baudienstleistungen in Osnabrück: Klinkerarbeiten, Verblendmauerwerk, Betonbau, WDVS und mehr.",
    url: "https://hajila-bau.de",
    siteName: "Hajila Bau GmbH",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hajila Bau GmbH - Ihr Partner für Hochbau & Klinkerarbeiten",
    description: "Professionelle Baudienstleistungen in Osnabrück",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${merriweather.variable} ${openSans.variable} antialiased`}
      >
        <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
        {children}
      </body>
    </html>
  );
}
