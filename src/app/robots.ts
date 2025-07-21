import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hajila-bau.de'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',          // Admin-Bereich ausschließen
          '/api/',           // API-Routen ausschließen
          '/photo-demo/',    // Demo-Seiten ausschließen
          '/_next/',         // Next.js interne Dateien
          '/uploads/',       // Upload-Ordner (optional - je nach Wunsch)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
