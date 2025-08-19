/**
 * Context7 Docs Pull & Diff – Gerüst
 *
 * Ziel:
 *  - Operativer Workflow für Doku-Aktualisierung via Context7 (manuell befüllte Inbox)
 *  - Snapshots mit Zeitstempel ablegen
 *  - Diffs gegenüber letztem Snapshot erzeugen (vereinfachter Vergleich)
 *
 * WICHTIG:
 *  - Dieses Skript ruft Context7 NICHT direkt auf (kein MCP in CI).
 *  - Stattdessen: Inhalte aus Context7 manuell in die Inbox legen (oder über separates Tool),
 *    danach dieses Skript ausführen, um Snapshots/Diffs zu generieren.
 *
 * Ordnerstruktur:
 *  docs/context7/
 *    targets.json                 -> Zielbibliotheken und Topics
 *    inbox/<lib>/<topic>.md       -> NEUE Rohinhalte (manuell einfügen)
 *    current/<lib>/<topic>.md     -> Kopie der jüngsten Inhalte
 *    snapshots/<timestamp>/<lib>/<topic>.md -> Versionierte Ablage
 *    diffs/diff-<timestamp>.md    -> Report mit Änderungsübersicht
 *
 * Nutzung:
 *  1) Initialisieren:
 *     node scripts/context7-docs-diff.js --init
 *     -> legt Struktur + Stub-Dateien für alle Targets an
 *
 *  2) Inhalte in inbox/<lib>/<topic>.md einfügen (aus Context7-MCP Ergebnis)
 *
 *  3) Diff/Snapshot ausführen:
 *     node scripts/context7-docs-diff.js
 *
 * Optional:
 *  - Nur Bericht erstellen ohne Snapshot-Aktualisierung:
 *     node scripts/context7-docs-diff.js --dry-run
 */

import fsp from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const BASE = path.join(ROOT, 'docs', 'context7');
const TARGETS = path.join(BASE, 'targets.json');
const INBOX = path.join(BASE, 'inbox');
const CURRENT = path.join(BASE, 'current');
const SNAPSHOTS = path.join(BASE, 'snapshots');
const DIFFS = path.join(BASE, 'diffs');

const args = process.argv.slice(2);
const isInit = args.includes('--init');
const isDryRun = args.includes('--dry-run');

function ts() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}${m}${dd}-${hh}${mm}`;
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

function sanitizeLibId(id) {
  // e.g. "/vercel/next.js" -> "vercel-next.js"
  return id.replace(/^\//, '').replace(/\//g, '-');
}

async function readTargets() {
  const raw = await fsp.readFile(TARGETS, 'utf8');
  const json = JSON.parse(raw);
  if (!json.libraries || !Array.isArray(json.libraries)) {
    throw new Error('targets.json: Feld "libraries" fehlt oder ist ungültig');
  }
  return json;
}

async function listSnapshotFolders() {
  try {
    const entries = await fsp.readdir(SNAPSHOTS, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name).sort();
  } catch {
    return [];
  }
}

async function readFileIfExists(p) {
  try {
    return await fsp.readFile(p, 'utf8');
  } catch {
    return null;
  }
}

function simpleDiffSummary(oldStr, newStr) {
  if (oldStr === null && newStr === null) {
    return { changed: false, summary: 'Kein alter/aktueller Inhalt vorhanden.' };
  }
  if (oldStr === null && newStr !== null) {
    const size = newStr.length;
    return { changed: true, summary: `NEU (keine vorherige Version). neue Länge: ${size} Zeichen.` };
  }
  if (oldStr !== null && newStr === null) {
    const size = oldStr.length;
    return { changed: true, summary: `ENTFERNT (neue Version fehlt). vorherige Länge: ${size} Zeichen.` };
  }
  if (oldStr === newStr) {
    return { changed: false, summary: 'Unverändert.' };
  }
  // Grobe Heuristik: Anzahl unterschiedlicher Zeilen
  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');
  let diffCount = 0;
  const max = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < max; i++) {
    if ((oldLines[i] || '') !== (newLines[i] || '')) {
      diffCount++;
    }
  }
  return { changed: true, summary: `Geändert – geschätzte abweichende Zeilen: ${diffCount}.` };
}

async function initStructure(targets) {
  await ensureDir(BASE);
  await ensureDir(INBOX);
  await ensureDir(CURRENT);
  await ensureDir(SNAPSHOTS);
  await ensureDir(DIFFS);

  for (const lib of targets.libraries) {
    const libKey = sanitizeLibId(lib.id);
    for (const topic of lib.topics) {
      const inboxPath = path.join(INBOX, libKey, `${topic}.md`);
      await ensureDir(path.dirname(inboxPath));
      if (!(await exists(inboxPath))) {
        const stub = [
          `# ${lib.id} – ${topic}`,
          '',
          '_Füge hier die aus Context7 erhaltenen Inhalte ein._',
          ''
        ].join('\n');
        await fsp.writeFile(inboxPath, stub, 'utf8');
      }
    }
  }
}

async function exists(p) {
  try {
    await fsp.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('== Context7 Docs Diff – Gerüst ==');
  await ensureDir(BASE);
  await ensureDir(DIFFS);

  // ensure default targets.json if missing
  if (!(await exists(TARGETS))) {
    const defaultTargets = {
      libraries: [
        { id: "/websites/npmjs", topics: ["commands", "install"] },
        { id: "/vercel/next.js", topics: ["routing", "config"] },
        { id: "/reactjs/react.dev", topics: ["hooks", "components"] }
      ],
      tokens: 4000
    };
    await ensureDir(path.dirname(TARGETS));
    await fsp.writeFile(TARGETS, JSON.stringify(defaultTargets, null, 2), 'utf8');
    console.log(`targets.json erzeugt: ${path.relative(ROOT, TARGETS)}`);
  }

  const targets = await readTargets();

  if (isInit) {
    await initStructure(targets);
    console.log('Struktur & Inbox-Stubs angelegt.');
    console.log(`Bitte Inhalte in ${path.relative(ROOT, INBOX)} einfügen und ohne --init erneut ausführen.`);
    return;
  }

  await ensureDir(INBOX);
  await ensureDir(CURRENT);
  await ensureDir(SNAPSHOTS);

  const tsNow = ts();
  const snapshotDir = path.join(SNAPSHOTS, tsNow);
  const snapshotRel = path.relative(ROOT, snapshotDir);
  if (!isDryRun) {
    await ensureDir(snapshotDir);
  }

  const prevFolders = await listSnapshotFolders();
  const prevFolder = prevFolders.length ? prevFolders[prevFolders.length - 1] : null;

  let diffReport = [
    `# Context7 Diffs – ${tsNow}`,
    '',
    prevFolder ? `Vergleich mit letztem Snapshot: ${prevFolder}` : 'Kein vorheriger Snapshot gefunden.',
    ''
  ];

  let changedCount = 0;
  let processed = 0;

  for (const lib of targets.libraries) {
    const libKey = sanitizeLibId(lib.id);
    for (const topic of lib.topics) {
      processed++;
      const inboxPath = path.join(INBOX, libKey, `${topic}.md`);
      const currentPath = path.join(CURRENT, libKey, `${topic}.md`);
      const prevPath = prevFolder ? path.join(SNAPSHOTS, prevFolder, libKey, `${topic}.md`) : null;
      const newContent = await readFileIfExists(inboxPath);
      const oldContent = prevPath ? await readFileIfExists(prevPath) : null;

      const { changed, summary } = simpleDiffSummary(oldContent, newContent);

      diffReport.push(`## ${lib.id} – ${topic}`);
      diffReport.push('');
      diffReport.push(`- Inbox: ${path.relative(ROOT, inboxPath)}`);
      if (prevPath) diffReport.push(`- Vorher: ${path.relative(ROOT, prevPath)}`);
      diffReport.push(`- Status: ${summary}`);
      diffReport.push('');

      if (!isDryRun && newContent !== null) {
        // write snapshot + current
        const snapTarget = path.join(snapshotDir, libKey, `${topic}.md`);
        await ensureDir(path.dirname(snapTarget));
        await fsp.writeFile(snapTarget, newContent, 'utf8');

        const curTarget = currentPath;
        await ensureDir(path.dirname(curTarget));
        await fsp.writeFile(curTarget, newContent, 'utf8');
      }

      if (changed) changedCount++;
    }
  }

  // write diff report
  const diffPath = path.join(DIFFS, `diff-${tsNow}.md`);
  diffReport.push('---');
  diffReport.push(`Gesamt verarbeitet: ${processed}`);
  diffReport.push(`Geändert: ${changedCount}`);
  diffReport.push('');
  if (!isDryRun) {
    await fsp.writeFile(diffPath, diffReport.join('\n'), 'utf8');
    console.log(`Diff-Report: ${path.relative(ROOT, diffPath)}`);
    console.log(`Snapshot:    ${snapshotRel}`);
  } else {
    console.log('(Dry-Run) Diff-Report Vorschau:');
    console.log(diffReport.slice(0, 20).join('\n'));
    console.log('... (gekürzt) ...');
  }

  console.log('Fertig.');
}

main().catch(err => {
  console.error('Fehler:', err);
  process.exit(1);
});
