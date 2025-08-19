# Next.js Routing Dokumentation

## Seitenbasiertes Routing

### Grundlegendes Routing
```jsx
// pages/index.js → /
function Home() {
  return <div>Startseite</div>;
}

export default Home;

// pages/about.js → /about
function About() {
  return <div>Über uns</div>;
}

export default About;
```

### Dynamische Routen
```jsx
// pages/posts/[id].js → /posts/1, /posts/abc, etc.
import { useRouter } from 'next/router';

function Post() {
  const router = useRouter();
  const { id } = router.query;

  return <p>Post: {id}</p>;
}

export default Post;
```

### Geschachtelte Routen
```jsx
// pages/blog/first-post.js → /blog/first-post
function FirstPost() {
  return <h1>Erster Blog-Post</h1>;
}

export default FirstPost;
```

## App Router (Next.js 13+)

### Grundlegende Struktur
```
app/
  page.js                # / (Hauptseite)
  about/
    page.js             # /about
  blog/
    page.js             # /blog
    [slug]/
      page.js           # /blog/:slug (dynamischer Parameter)
    featured/
      page.js           # /blog/featured
```

### Dynamische Segmente
```jsx
// app/blog/[slug]/page.js
export default function Page({ params }) {
  return <div>Blog-Post: {params.slug}</div>;
}
```

### Lade- und Fehlerzustände
```jsx
// app/dashboard/loading.js
export default function Loading() {
  return <div>Lade Dashboard...</div>;
}

// app/dashboard/error.js
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Etwas ist schief gelaufen!</h2>
      <button onClick={() => reset()}>Erneut versuchen</button>
    </div>
  );
}
```

## API-Routen

### Einfache API-Route
```js
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' });
}
```

### Dynamische API-Routen
```js
// pages/api/post/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  res.status(200).json({ postId: id });
}
```

## Middleware

### Grundlegende Middleware
```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Beispiel: Umleitung basierend auf Benutzerrolle
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

## Weiterleitung und Neuschreibung

### Weiterleitungen in next.config.js
```js
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ];
  },
};
```

### URL-Neuschreibung
```js
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
};
```

## Internationalisierung (i18n)

### Grundkonfiguration
```js
// next.config.js
module.exports = {
  i18n: {
    locales: ['de', 'en', 'fr'],
    defaultLocale: 'de',
  },
};
```

### Sprachwechsler-Komponente
```jsx
'use client';

import { useRouter } from 'next/navigation';

export default function LocaleSwitcher() {
  const router = useRouter();
  
  const changeLanguage = (e) => {
    const locale = e.target.value;
    // Aktuelle URL mit neuem Locale
    router.push(router.pathname, undefined, { locale });
  };

  return (
    <select onChange={changeLanguage}>
      <option value="de">Deutsch</option>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

## Best Practices

### Client-seitige Navigation
```jsx
'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Zum Dashboard
    </button>
  );
}
```

### Prefetching
```jsx
import Link from 'next/link';

// Automatisches Prefetching im Viewport
<Link href="/about" prefetch={true}>
  Über uns
</Link>
```

## Weitere Ressourcen
- [Offizielle Next.js Routing Dokumentation](https://nextjs.org/docs/routing/introduction)
- [App Router Dokumentation](https://nextjs.org/docs/app/building-your-application/routing)
- [API Routes Dokumentation](https://nextjs.org/docs/api-routes/introduction)

---
_Diese Dokumentation wurde automatisch generiert._ /vercel/next.js – routing

_Füge hier die aus Context7 erhaltenen Inhalte ein._
