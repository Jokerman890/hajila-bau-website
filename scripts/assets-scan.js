/**
 * Assets Scanner
 * - Scannt public/uploads/ rekursiv
 * - Bildet SHA256-Hashes zur Duplikaterkennung
 * - Erkennt verwaiste Dateien durch Referenzsuche im Repo (Vorkommen von /uploads/... oder Dateinamen)
 * - Erzeugt Reports:
 *    - docs/assets/duplicates.csv + duplicates.md
 *    - docs/assets/orphaned.csv + orphaned.md
 *    - docs/assets/large-images.csv (optional Optimierungskandidaten > thresholdKB)
 *
 * Aufruf:
 *   node scripts/assets-scan.js [--thresholdKB=300]
 *
 * Hinweis:
 * - Referenzsuche: durchsucht Textdateien (ts, tsx, js, jsx, md, css, html, json, mjs, cjs)
 * - Ignoriert: node_modules, .git, .next, out, .vercel, .turbo, public/uploads
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads');
const REPORT_DIR = path.join(ROOT, 'docs', 'assets');

const DEFAULT_THRESHOLD_KB = 300;
const args = process.argv.slice(2);
const argThreshold = args.find(a => a.startsWith('--thresholdKB='));
const THRESHOLD_KB = argThreshold ? parseInt(argThreshold.split('=')[1], 10) : DEFAULT_THRESHOLD_KB;

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.md', '.css', '.scss', '.sass', '.html', '.htm', '.json', '.mjs', '.cjs', '.txt'
]);

const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'out', '.vercel', '.turbo']);
const REPO_SCAN_EXCLUDE_ABS = new Set([
  path.join(ROOT, 'public', 'uploads')
]);

/**
 * Utils
 */
// legacy helper removed — kept in git history if needed

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function walkDir(dir, options = {}) {
  const results = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      if (REPO_SCAN_EXCLUDE_ABS.has(abs)) continue;
      const sub = await walkDir(abs, options);
      results.push(...sub);
    } else if (entry.isFile()) {
      results.push(abs);
    }
  }
  return results;
}

async function walkUploads(dir) {
  const results = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await walkUploads(abs);
      results.push(...sub);
    } else if (entry.isFile()) {
      results.push(abs);
    }
  }
  return results;
}

async function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    hash.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.pipe(hash);
  });
}

function formatCSVRow(values) {
  // Escape quotes and wrap fields containing commas, quotes, or newlines in quotes
  const esc = (v) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  return values.map(esc).join(',');
}

function relFromPublic(absPath) {
  const rel = path.relative(path.join(ROOT, 'public'), absPath).split(path.sep).join('/');
  return rel; // e.g. uploads/sub/file.png
}

function humanKB(bytes) {
  return (bytes / 1024).toFixed(1);
}

/**
 * Sammle Repository-Referenzen:
 * - Alle Vorkommen von /uploads/... Pfaden
 * - Alle Dateinamen mit typischen Asset-Endungen
 */
async function collectRepoReferences() {
  const allFiles = await walkDir(ROOT);
  const uploadsPathSet = new Set(); // e.g. /uploads/foo/bar.png
  const filenameSet = new Set();    // e.g. bar.png

  const assetNameRegex = /[A-Za-z0-9._-]+\.(?:png|jpg|jpeg|webp|gif|svg|pdf)/gi;
  const uploadsPathRegex = /\/uploads\/[^\s"'()<>]+/g;

  for (const file of allFiles) {
    if (!isTextFile(file)) continue;
    try {
      const content = await fsp.readFile(file, 'utf8');

      const pathMatches = content.match(uploadsPathRegex);
      if (pathMatches) {
        for (const m of pathMatches) {
          // Normalize potential trailing punctuation
          const cleaned = m.replace(/[),.;:]+$/, '');
          uploadsPathSet.add(cleaned);
        }
      }

      const nameMatches = content.match(assetNameRegex);
      if (nameMatches) {
        for (const m of nameMatches) {
          filenameSet.add(m);
        }
      }
    } catch (err) {
      void err; // ignore read errors
    }
  }

  return { uploadsPathSet, filenameSet };
}

/**
 * Main
 */
async function main() {
  const started = Date.now();
  // Ensure report dir
  await ensureDir(REPORT_DIR);

  // Validate uploads dir
  try {
    const st = await fsp.stat(UPLOADS_DIR);
    if (!st.isDirectory()) {
      console.error('Hinweis: public/uploads ist kein Verzeichnis.');
      process.exit(1);
    }
  } catch {
    console.error('Hinweis: public/uploads nicht gefunden.');
    process.exit(1);
  }

  const uploadFiles = await walkUploads(UPLOADS_DIR);

  // Hashes berechnen
  const hashMap = new Map(); // hash -> [{ absPath, size, mtime }]
  for (const abs of uploadFiles) {
    try {
      const [hash, stat] = await Promise.all([sha256File(abs), fsp.stat(abs)]);
      const list = hashMap.get(hash) || [];
      list.push({
        absPath: abs,
        relPath: relFromPublic(abs), // uploads/...
        size: stat.size,
        mtime: stat.mtime
      });
      hashMap.set(hash, list);
    } catch (err) {
      console.warn(`Warnung: Hash fehlgeschlagen für ${abs}: ${err.message}`);
    }
  }

  // Repo-Referenzen sammeln
  const { uploadsPathSet, filenameSet } = await collectRepoReferences();

  // Duplikate identifizieren
  const duplicates = [];
  for (const [hash, items] of hashMap.entries()) {
    if (items.length > 1) {
      // Sort by path for determinism
      items.sort((a, b) => a.relPath.localeCompare(b.relPath));
      for (const it of items) {
        duplicates.push({
          hash,
          relPath: it.relPath,
          size: it.size,
          mtime: it.mtime
        });
      }
    }
  }

  // Verwaiste identifizieren + große Dateien
  const orphaned = [];
  const largeImages = [];

  for (const items of hashMap.values()) {
    for (const it of items) {
      const rel = it.relPath; // uploads/...
      const uploadsKey = '/' + rel; // /uploads/...
      const fname = path.basename(rel);

      const isRef = uploadsPathSet.has(uploadsKey) || filenameSet.has(fname);

      if (!isRef) {
        orphaned.push({
          relPath: rel,
          size: it.size,
          mtime: it.mtime
        });
      }

      // Optional: Optimierungskandidaten
      const ext = path.extname(rel).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
        const sizeKB = it.size / 1024;
        if (sizeKB > THRESHOLD_KB) {
          largeImages.push({
            relPath: rel,
            size: it.size
          });
        }
      }
    }
  }

  // CSV/MD schreiben
  const dupCsvPath = path.join(REPORT_DIR, 'duplicates.csv');
  const dupMdPath = path.join(REPORT_DIR, 'duplicates.md');
  const orpCsvPath = path.join(REPORT_DIR, 'orphaned.csv');
  const orpMdPath = path.join(REPORT_DIR, 'orphaned.md');
  const largeCsvPath = path.join(REPORT_DIR, 'large-images.csv');

  // Duplicates CSV
  {
    const header = formatCSVRow(['hash', 'path', 'size_bytes', 'size_kb', 'mtime_iso']);
    const rows = duplicates.map(d => formatCSVRow([
      d.hash,
      d.relPath,
      d.size,
      humanKB(d.size),
      d.mtime.toISOString()
    ]));
    const csv = [header, ...rows].join('\n');
    await fsp.writeFile(dupCsvPath, csv, 'utf8');

    const md = [
      '# Duplicate Assets Report',
      '',
      `Erzeugt: ${new Date().toISOString()}`,
      '',
      `Gesamt Duplikat-Einträge: ${duplicates.length}`,
      '',
      '> CSV-Datei: `docs/assets/duplicates.csv`',
      ''
    ].join('\n');
    await fsp.writeFile(dupMdPath, md, 'utf8');
  }

  // Orphaned CSV
  {
    const header = formatCSVRow(['path', 'size_bytes', 'size_kb', 'mtime_iso']);
    const rows = orphaned.map(o => formatCSVRow([
      o.relPath,
      o.size,
      humanKB(o.size),
      o.mtime.toISOString()
    ]));
    const csv = [header, ...rows].join('\n');
    await fsp.writeFile(orpCsvPath, csv, 'utf8');

    const md = [
      '# Orphaned Assets Report',
      '',
      `Erzeugt: ${new Date().toISOString()}`,
      '',
      `Gesamt verwaiste Dateien: ${orphaned.length}`,
      '',
      '> CSV-Datei: `docs/assets/orphaned.csv`',
      '',
      'Hinweis:',
      '- Referenzen werden anhand von Vorkommen von `/uploads/...` oder Dateinamen in Textdateien ermittelt.',
      '- False Positives sind möglich, Review empfohlen bevor Dateien gelöscht werden.'
    ].join('\n');
    await fsp.writeFile(orpMdPath, md, 'utf8');
  }

  // Large Images CSV
  {
    const header = formatCSVRow(['path', 'size_bytes', 'size_kb', 'threshold_kb']);
    const rows = largeImages.map(o => formatCSVRow([
      o.relPath,
      o.size,
      humanKB(o.size),
      THRESHOLD_KB
    ]));
    const csv = [header, ...rows].join('\n');
    await fsp.writeFile(largeCsvPath, csv, 'utf8');
  }

  const durationMs = Date.now() - started;
  const uniqAssets = [...hashMap.values()].reduce((acc, arr) => acc + arr.length, 0);
  const dupGroups = new Map();
  for (const [hash, items] of hashMap.entries()) {
    if (items.length > 1) dupGroups.set(hash, items.length);
  }

  console.log('=== Assets Scan abgeschlossen ===');
  console.log(`Uploads gesamt: ${uniqAssets}`);
  console.log(`Duplikat-Gruppen: ${dupGroups.size} (Einträge: ${duplicates.length})`);
  console.log(`Verwaiste Dateien: ${orphaned.length}`);
  console.log(`Große Bilder (> ${THRESHOLD_KB}KB): ${largeImages.length}`);
  console.log('');
  console.log('Reports:');
  console.log(` - ${path.relative(ROOT, dupCsvPath)}`);
  console.log(` - ${path.relative(ROOT, dupMdPath)}`);
  console.log(` - ${path.relative(ROOT, orpCsvPath)}`);
  console.log(` - ${path.relative(ROOT, orpMdPath)}`);
  console.log(` - ${path.relative(ROOT, largeCsvPath)}`);
  console.log('');
  console.log(`Dauer: ${durationMs}ms`);
}

main().catch(err => {
  console.error('Fehler beim Assets-Scan:', err);
  process.exit(1);
});
