# Next.js Konfigurationsdokumentation

## Grundlegende Konfiguration

### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Grundlegende Konfiguration
  reactStrictMode: true,
  swcMinify: true,
  
  // Umgebungsvariablen
  env: {
    API_URL: process.env.API_URL,
  },
  
  // Bilder-Domains
  images: {
    domains: ['example.com', 'cdn.example.org'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Kompilierungsoptimierungen
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
```

## Erweiterte Konfiguration

### Statische Export-Konfiguration
```js
// next.config.js
module.exports = {
  output: 'export',  // Statische HTML-Exporte
  images: {
    unoptimized: true,  // Erforderlich für statische Exporte
  },
};
```

### Internationalisierung (i18n)
```js
// next.config.js
module.exports = {
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    localeDetection: false,
  },
};
```

### Umgebungsvariablen
```js
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=your-secret-key

// next.config.js
module.exports = {
  env: {
    // Öffentlich zugänglich (Client + Server)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    
    // Nur serverseitig verfügbar
    SECRET_KEY: process.env.SECRET_KEY,
  },
};
```

## Performance-Optimierungen

### Bundle-Analyse
```bash
# Installieren Sie zuerst das Paket
npm install --save-dev @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Ihre Konfiguration
});
```

### Komponenten-Lazy-Loading
```jsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('../components/HeavyComponent'),
  { 
    loading: () => <p>Lade...</p>,
    ssr: false  // Client-seitiges Laden
  }
);
```

## Sicherheit

### Content Security Policy (CSP)
```js
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Sicherheits-Header
```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

## Build- und Deploy-Konfiguration

### Statische Exporte
```js
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Deaktiviert die Erstellung von HTML-Dateien für nicht-exportierte Routen
  skipTrailingSlashRedirect: true,
};
```

### Docker-Konfiguration
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Development
FROM base AS dev
ENV NODE_ENV=development
RUN npm run build
CMD ["npm", "run", "dev"]

# Production
FROM base AS prod
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "start"]
```

## Vercel-spezifische Konfiguration

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### Edge Functions
```js
// pages/api/hello.js
export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return new Response(JSON.stringify({ name: 'John Doe' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

## Debugging

### Source Maps
```js
// next.config.js
module.exports = {
  productionBrowserSourceMaps: true,  // Für Produktion
};
```

### TypeScript-Pfadaliase
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["components/*"],
      "@styles/*": ["styles/*"]
    }
  }
}
```

## Best Practices

### Optimierte Bildverarbeitung
```jsx
import Image from 'next/image';

export default function Home() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profilbild"
      width={500}
      height={500}
      priority  // Für das Lazy-Loading deaktivieren
    />
  );
}
```

### Umgebungsvariablen
```
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Nützliche Module

### next-compose-plugins
```bash
npm install --save-dev next-compose-plugins
```

```js
// next.config.js
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Ihre Konfiguration
};

module.exports = withPlugins([
  [withBundleAnalyzer],
  // Weitere Plugins hier
], nextConfig);
```

## Fehlerbehebung

### Häufige Probleme
1. **Modul nicht gefunden**: Stellen Sie sicher, dass das Modul installiert ist
2. **Build-Fehler**: Überprüfen Sie die Browser-Konsole und Server-Logs
3. **Performance-Probleme**: Nutzen Sie die integrierten Analyse-Tools

## Weitere Ressourcen
- [Offizielle Next.js Dokumentation](https://nextjs.org/docs)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)
- [Vercel Platform Documentation](https://vercel.com/docs)

---
_Diese Dokumentation wurde automatisch generiert._ /vercel/next.js – config

_Füge hier die aus Context7 erhaltenen Inhalte ein._
