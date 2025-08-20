/**
 * Status Report Generator
 * - Liest Reports aus docs/assets (duplicates.csv, orphaned.csv, large-images.csv)
 * - Aggregiert KPIs
 * - Schreibt Monatsbericht:
 *    - docs/status/status-YYYYMM.md
 *    - docs/status/status-YYYYMM.csv (Key/Value)
 *
 * Aufruf:
 *   node scripts/status-report.js
 */

const fsp = require('fs/promises');
const path = require('path');
// const fs = require('fs'); // unused
const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, 'docs', 'assets');
const STATUS_DIR = path.join(ROOT, 'docs', 'status');

function yyyymm(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}${m}`;
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

// Minimal CSV Parser (unterstützt Quotes und Kommas in Feldern)
function parseCSV(text) {
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    // Un-escape double quotes
    if (inQuotes) {
      field = field.replace(/""/g, '"');
    }
    cur.push(field);
    field = '';
  };
  const pushRow = () => {
    rows.push(cur);
    cur = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '""'; // keep as escaped, will unescape later
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        pushField();
      } else if (c === '\r') {
        // ignore
      } else if (c === '\n') {
        pushField();
        pushRow();
      } else {
        field += c;
      }
    }
  }
  // last field/row
  pushField();
  if (cur.length > 1 || (cur.length === 1 && cur[0] !== '')) {
    pushRow();
  }
  return rows;
}

function formatCSVRow(values) {
  const esc = (v) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  return values.map(esc).join(',');
}

async function readCSVIfExists(filePath) {
  try {
    const text = await fsp.readFile(filePath, 'utf8');
    return parseCSV(text);
  } catch {
    return null;
  }
}

async function main() {
  await ensureDir(STATUS_DIR);

  const month = yyyymm();
  const outMd = path.join(STATUS_DIR, `status-${month}.md`);
  const outCsv = path.join(STATUS_DIR, `status-${month}.csv`);

  const dupCsv = path.join(ASSETS_DIR, 'duplicates.csv');
  const orpCsv = path.join(ASSETS_DIR, 'orphaned.csv');
  const largeCsv = path.join(ASSETS_DIR, 'large-images.csv');

  const dupRows = await readCSVIfExists(dupCsv);
  const orpRows = await readCSVIfExists(orpCsv);
  const largeRows = await readCSVIfExists(largeCsv);

  // Defaults if missing
  let duplicatesEntries = 0;
  let duplicateGroups = 0;
  let orphanedCount = 0;
  let largeImagesCount = 0;
  let topLarge = [];

  if (dupRows && dupRows.length > 1) {
    // Header: ['hash','path','size_bytes','size_kb','mtime_iso']
    const byHash = new Map();
    for (let i = 1; i < dupRows.length; i++) {
      const row = dupRows[i];
      const hash = row[0];
      if (!byHash.has(hash)) byHash.set(hash, 0);
      byHash.set(hash, byHash.get(hash) + 1);
    }
    duplicateGroups = byHash.size;
    duplicatesEntries = dupRows.length - 1;
  }

  if (orpRows && orpRows.length > 1) {
    // Header: ['path','size_bytes','size_kb','mtime_iso']
    orphanedCount = orpRows.length - 1;
  }

  if (largeRows && largeRows.length > 1) {
    // Header: ['path','size_bytes','size_kb','threshold_kb']
    largeImagesCount = largeRows.length - 1;
    const items = [];
    for (let i = 1; i < largeRows.length; i++) {
      const row = largeRows[i];
      const rel = row[0];
      const sizeBytes = Number(row[1] || 0);
      const sizeKB = Number(row[2] || 0);
      items.push({ rel, sizeBytes, sizeKB });
    }
    items.sort((a, b) => b.sizeBytes - a.sizeBytes);
    topLarge = items.slice(0, 10);
  }

  // CSV KPIs
  const kpiRows = [
    ['month', month],
    ['duplicate_groups', duplicateGroups],
    ['duplicate_entries', duplicatesEntries],
    ['orphaned_files', orphanedCount],
    ['large_images', largeImagesCount]
  ];
  const csv = ['key,value', ...kpiRows.map(r => formatCSVRow(r))].join('\n');
  await fsp.writeFile(outCsv, csv, 'utf8');

  // Markdown Report
  const md = [
    `# Monatsreport (Docs & Assets) – ${month}`,
    '',
    '## Zusammenfassung',
    '',
    `- Duplikat-Gruppen: ${duplicateGroups}`,
    `- Duplikat-Einträge: ${duplicatesEntries}`,
    `- Verwaiste Dateien: ${orphanedCount}`,
    `- Große Bilder: ${largeImagesCount}`,
    '',
    '## Details',
    '',
    '### Top 10 große Bilder',
    '',
    topLarge.length
  ? topLarge.map(it => `1. ${it.rel} – ${(it.sizeKB).toFixed(1)} KB`).join('\n')
      : '_Keine Daten verfügbar_',
    '',
    '### Quellen',
    '',
    `- Duplicates: \`docs/assets/duplicates.csv\``,
    `- Orphaned: \`docs/assets/orphaned.csv\``,
    `- Large Images: \`docs/assets/large-images.csv\``,
    '',
    '## Nächste Schritte',
    '',
    '- Duplikate prüfen und auf eine Referenz konsolidieren',
    '- Verwaiste Dateien verifizieren und ggf. löschen/archivieren',
    '- Große Bilder optimieren/konvertieren (WEBP, Kompression)',
    ''
  ].join('\n');

  await fsp.writeFile(outMd, md, 'utf8');

  console.log('Status-Report erstellt:');
  console.log(` - ${path.relative(ROOT, outMd)}`);
  console.log(` - ${path.relative(ROOT, outCsv)}`);
}

main().catch(err => {
  console.error('Fehler beim Status-Report:', err);
  process.exit(1);
});
