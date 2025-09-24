import type { Metadata } from "next";
import { Merriweather, Open_Sans } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://hajila-bau.de"),
  title: "Hajila Bau GmbH - Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück",
  description: "Professionelle Baudienstleistungen in Osnabrück: Klinkerarbeiten, Verblendmauerwerk, Betonbau, WDVS und mehr. Qualität und Präzision seit 2016.",
  keywords: "Hajila Bau, Osnabrück, Klinkerarbeiten, Verblendmauerwerk, Betonbau, WDVS, Bauunternehmen, Hochbau",
  authors: [{ name: "Hajila Bau GmbH" }],
  creator: "Hajila Bau GmbH",
  publisher: "Hajila Bau GmbH",
  robots: "index, follow",
  generator: "Next.js",
  applicationName: "Hajila Bau GmbH",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://hajila-bau.de",
  },
  openGraph: {
    title: "Hajila Bau GmbH - Ihr Partner für Hochbau & Klinkerarbeiten",
    description: "Professionelle Baudienstleistungen in Osnabrück: Klinkerarbeiten, Verblendmauerwerk, Betonbau, WDVS und mehr.",
    url: "https://hajila-bau.de",
    siteName: "Hajila Bau GmbH",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/uploads/logo_2d.png",
        width: 800,
        height: 600,
        alt: "Hajila Bau GmbH Logo",
      },
      {
        url: "/uploads/Hexagon-logo.jpg",
        width: 400,
        height: 400,
        alt: "Hajila Bau Hexagon Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hajila Bau GmbH - Ihr Partner für Hochbau & Klinkerarbeiten",
    description: "Professionelle Baudienstleistungen in Osnabrück",
    images: ["/uploads/logo_2d.png"],
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

// Schema.org JSON-LD für lokales Geschäft
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://hajila-bau.de",
  name: "Hajila Bau GmbH",
  description: "Professionelle Baudienstleistungen in Osnabrück: Klinkerarbeiten, Verblendmauerwerk, Betonbau, WDVS und mehr. Qualität und Präzision seit 2016.",
  url: "https://hajila-bau.de",
  logo: "https://hajila-bau.de/uploads/logo_2d.png",
  image: [
    "https://hajila-bau.de/uploads/logo_2d.png",
    "https://hajila-bau.de/uploads/Hexagon-logo.jpg"
  ],
  telephone: "+49", // TODO: Echte Telefonnummer einfügen
  email: "info@hajila-bau.de", // TODO: Echte E-Mail einfügen
  address: {
    "@type": "PostalAddress",
    streetAddress: "", // TODO: Echte Adresse einfügen
    addressLocality: "Osnabrück",
    addressRegion: "Niedersachsen",
    postalCode: "", // TODO: PLZ einfügen
    addressCountry: "DE"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 52.2799, // Osnabrück coordinates (approximate)
    longitude: 8.0472
  },
  foundingDate: "2016",
  sameAs: [
    // TODO: Social Media Links hinzufügen wenn vorhanden
  ],
  areaServed: {
    "@type": "City",
    name: "Osnabrück"
  },
  serviceType: [
    "Klinkerarbeiten",
    "Verblendmauerwerk", 
    "Betonbau",
    "WDVS",
    "Hochbau",
    "Bauunternehmen"
  ],
  priceRange: "$$", // Mittelpreisig
  openingHours: "Mo-Fr 07:00-17:00", // TODO: Echte Öffnungszeiten einfügen
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body
        className={`${merriweather.variable} ${openSans.variable} antialiased`}
      >
        {/* <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} /> */}
        {children}
      </body>
    </html>
  );
}
