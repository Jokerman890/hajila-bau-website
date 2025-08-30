# Hostinger VPS Setup Guide (Next.js + Lokale Uploads)

## Voraussetzungen

- Ubuntu/Debian VPS
- Node.js 18+ und npm
- Nginx als Reverse Proxy
- Persistentes Verzeichnis für Uploads

## Verzeichnisstruktur

```bash
sudo mkdir -p /var/www/hajila/public/uploads/carousel
sudo chown -R $USER:$USER /var/www/hajila
```

## Environment Variablen (optional Supabase)

Datei: `/var/www/hajila/.env`

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NODE_ENV=production
PORT=3000
```

## Build & Start

```bash
cd /var/www/hajila
npm ci
npm run build
```

Systemd Unit `/etc/systemd/system/hajila.service`:

```ini
[Unit]
Description=Hajila Next.js
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hajila
EnvironmentFile=/var/www/hajila/.env
ExecStart=/usr/bin/npm run start -- --port 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Aktivieren:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now hajila
sudo systemctl status hajila
```

## Nginx Reverse Proxy

Konfiguration `/etc/nginx/sites-available/hajila`:

```nginx
server {
  listen 80;
  server_name deine-domain.de;

  client_max_body_size 15M;  # Upload-Limit

  location /uploads/ {
    alias /var/www/hajila/public/uploads/;
    access_log off;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

Aktivieren & SSL:

```bash
sudo ln -s /etc/nginx/sites-available/hajila /etc/nginx/sites-enabled/hajila
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de
```

## Sicherheit & Betrieb

- Upload-API: MIME-Whitelist, Größenlimit, UUID-Dateinamen
- Rechte: Service-User muss auf `public/uploads` schreiben können
- Backups: Regelmäßig `public/uploads` sichern
- Logs: `journalctl -u hajila -f`

## Hinweise

- GitHub Pages Modus (`NEXT_PUBLIC_GITHUB_PAGES=true`) deaktiviert APIs – für VPS nicht setzen.
- `getAssetPath` sorgt für korrekte Pfade, unabhängig vom basePath.

