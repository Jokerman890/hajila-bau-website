import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hajila-bau.de'
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.1, // Niedrige Priorität für Admin-Bereich
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
