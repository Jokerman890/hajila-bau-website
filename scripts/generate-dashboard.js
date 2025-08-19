#!/usr/bin/env node
/**
 * Dashboard Generator
 * - Liest KPIs aus docs/status/status-YYYYMM.csv (falls vorhanden, sonst aktuell)
 * - Liest assets-Reports aus docs/assets/*.csv
 * - Erzeugt: docs/status/dashboard-README.md
 * - Erzeugt einfache SVG-Charts unter docs/status/images/
 *
 * Ziel: leichtgewichtige, dependency-free Darstellung für CI/Monats-Reports.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = process.cwd();
const STATUS_DIR = path.join(ROOT, 'docs', 'status');
const ASSETS_DIR = path.join(ROOT, 'docs', 'assets');
const IMAGES_DIR = path.join(STATUS_DIR, 'images');

function yyyymm(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}${m}`;
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

function parseKeyValueCsv(text) {
  // Expect key,value pairs with optional header
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const map = new Map();
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length < 2) continue;
    const key = parts[0].replace(/^\s*"|"\s*$/g, '').trim();
    const value = parts.slice(1).join(',').replace(/^\s*"|"\s*$/g, '').trim();
    map.set(key, value);
  }
  return map;
}

function parseGenericCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = lines.map(l => {
    // naive CSV split: handles simple cases since reports are produced by our scripts
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (c === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (c === ',' && !inQuotes) {
        cols.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    cols.push(cur);
    return cols;
  });
  return rows;
}

function createBarSvg({ labels, values, width = 800, height = 240, title = '' }) {
  // simple horizontal bar chart SVG
  const max = Math.max(...values, 1);
  const barAreaWidth = width - 220; // allocate left column for labels
  const barHeight = Math.max(12, Math.floor((height - 40) / labels.length));
  const gap = 8;
  const totalHeight = Math.max(height, labels.length * (barHeight + gap) + 40);

  const rows = labels.map((label, i) => {
    const v = Number(values[i] || 0);
    const w = Math.round((v / max) * barAreaWidth);
    const y = 30 + i * (barHeight + gap);
    return { label, v, w, y };
  });

  const svgRows = rows.map(r => `
    <g>
      <text x="10" y="${r.y + barHeight - 3}" font-family="sans-serif" font-size="12">${escapeHtml(r.label)}</text>
      <rect x="200" y="${r.y}" width="${r.w}" height="${barHeight}" fill="#3b82f6" rx="3"></rect>
      <text x="${200 + r.w + 8}" y="${r.y + barHeight - 3}" font-family="sans-serif" font-size="12">${r.v}</text>
    </g>`).join('\n');

  const svg = `<?xml version="1.0" encoding="utf-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}">
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="10" y="16" font-family="sans-serif" font-size="14" font-weight="600">${escapeHtml(title)}</text>
    ${svgRows}
  </svg>`;
  return svg;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function findLatestStatusCsv() {
  const files = await fsp.readdir(STATUS_DIR).catch(() => []);
  const candidates = files.filter(f => /^status-\d{6}\.csv$/.test(f)).sort().reverse();
  if (candidates.length) return path.join(STATUS_DIR, candidates[0]);
  // fallback to current month
  const file = path.join(STATUS_DIR, `status-${yyyymm()}.csv`);
  return fs.existsSync(file) ? file : null;
}

async function readCsvIf(filePath) {
  try {
    const t = await fsp.readFile(filePath, 'utf8');
    return t;
  } catch (e) {
    return null;
  }
}

async function main() {
  await ensureDir(IMAGES_DIR);

  const statusCsv = await findLatestStatusCsv();
  const status = {};
  if (statusCsv) {
    const text = await readCsvIf(statusCsv);
    if (text) {
      const map = parseKeyValueCsv(text);
      for (const [k, v] of map.entries()) status[k] = v;
    }
  }

  // Read assets CSVs to create small charts
  const duplicatesCsv = path.join(ASSETS_DIR, 'duplicates.csv');
  const orphanedCsv = path.join(ASSETS_DIR, 'orphaned.csv');
  const largeCsv = path.join(ASSETS_DIR, 'large-images.csv');

  const dupText = await readCsvIf(duplicatesCsv);
  const orpText = await readCsvIf(orphanedCsv);
  const largeText = await readCsvIf(largeCsv);

  const dupCount = dupText ? Math.max(0, parseGenericCsv(dupText).length - 1) : 0;
  const orphanCount = orpText ? Math.max(0, parseGenericCsv(orpText).length - 1) : 0;
  const largeCount = largeText ? Math.max(0, parseGenericCsv(largeText).length - 1) : 0;

  // Compose charts
  const month = status.month || yyyymm();

  const labels = ['duplicate_groups', 'duplicate_entries', 'orphaned_files', 'large_images'];
  const values = [Number(status.duplicate_groups || 0), Number(status.duplicate_entries || dupCount), Number(status.orphaned_files || orphanCount), Number(status.large_images || largeCount)];

  const summarySvg = createBarSvg({ labels: ['Duplicate Groups','Duplicate Entries','Orphaned Files','Large Images'], values, width: 900, height: Math.max(240, labels.length * 34), title: `KPIs – ${month}` });
  const summarySvgPath = path.join(IMAGES_DIR, `kpi-summary-${month}.svg`);
  await fsp.writeFile(summarySvgPath, summarySvg, 'utf8');

  // Top large images table (from status-report topLarge isn't in CSV; attempt to read large-images.csv rows)
  let topLargeMd = '_Keine Daten verfügbar_';
  if (largeText) {
    const rows = parseGenericCsv(largeText);
    if (rows.length > 1) {
      const items = rows.slice(1).map(r => ({ path: r[0], sizeKB: r[2] || r[1] || '' }));
      const top = items.slice(0, 10);
      topLargeMd = top.map((it, i) => `${i+1}. ${it.path} – ${it.sizeKB} KB`).join('\n');
    }
  }

  // Dashboard markdown
  const md = [
    `# Status Dashboard – ${month}`,
    '',
    '## KPIs',
    '',
    `![KPI Summary](${path.relative(STATUS_DIR, summarySvgPath).replace(/\\/g, '/')})`,
    '',
    '### Zahlen',
    '',
    `- Duplicate Groups: ${status.duplicate_groups || '0'}`,
    `- Duplicate Entries: ${status.duplicate_entries || dupCount}`,
    `- Orphaned Files: ${status.orphaned_files || orphanCount}`,
    `- Large Images: ${status.large_images || largeCount}`,
    '',
    '## Top große Bilder',
    '',
    topLargeMd,
    '',
    '## Quellen',
    '',
    '- `docs/assets/duplicates.csv`',
    '- `docs/assets/orphaned.csv`',
    '- `docs/assets/large-images.csv`',
    '',
    '## Hinweise',
    '',
    '- SVG-Charts sind einfach gerendert (keine externe Bibliothek).',
    '- Wenn du PNGs brauchst, kannst du Puppeteer nutzen, um SVG zu PNG zu konvertieren in CI.',
    ''
  ].join('\n');

  const outPath = path.join(STATUS_DIR, 'dashboard-README.md');
  await fsp.writeFile(outPath, md, 'utf8');

  console.log('Dashboard generiert:');
  console.log(` - ${path.relative(ROOT, outPath)}`);
  console.log(` - ${path.relative(ROOT, summarySvgPath)}`);
}

main().catch(err => {
  console.error('Fehler beim Dashboard-Generator:', err);
  process.exit(1);
});
