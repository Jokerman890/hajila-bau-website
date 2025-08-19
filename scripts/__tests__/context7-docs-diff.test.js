import { mkdtemp, rm, readFile, writeFile, readdir, stat, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Absolute path to the script under test
const SCRIPT_PATH = resolve(__dirname, '..', 'context7-docs-diff.js');

async function pathExists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function listDirs(p) {
  const items = await readdir(p, { withFileTypes: true });
  return items.filter(i => i.isDirectory()).map(i => i.name);
}

describe('context7-docs-diff.js', () => {
  let sandbox;

  beforeAll(async () => {
    sandbox = await mkdtemp(join(tmpdir(), 'ctx7-test-'));
  });

  afterAll(async () => {
    // Cleanup sandbox
    await rm(sandbox, { recursive: true, force: true });
  });

  test('--init creates structure and stubs', async () => {
    // Run: node scripts/context7-docs-diff.js --init in sandbox cwd
    const { stdout } = await execFileAsync('node', [SCRIPT_PATH, '--init'], { cwd: sandbox, env: process.env, encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
    expect(stdout).toContain('Struktur & Inbox-Stubs angelegt.');

    const base = join(sandbox, 'docs', 'context7');
    const expectedDirs = ['inbox', 'current', 'snapshots', 'diffs'];
    for (const d of expectedDirs) {
      expect(await pathExists(join(base, d))).toBe(true);
    }

    // targets.json should exist and be valid JSON
    const targetsPath = join(base, 'targets.json');
    expect(await pathExists(targetsPath)).toBe(true);
    const targets = JSON.parse(await readFile(targetsPath, 'utf8'));
    expect(Array.isArray(targets.libraries)).toBe(true);

    // One stub file should be created for each topic of each library
    // Check for a known default lib/topic path e.g. /reactjs/react.dev hooks
    const reactLibKey = 'reactjs-react.dev';
    const stubPath = join(base, 'inbox', reactLibKey, 'hooks.md');
    expect(await pathExists(stubPath)).toBe(true);
    const stub = await readFile(stubPath, 'utf8');
    expect(stub).toContain('# /reactjs/react.dev – hooks');
  });

  test('run creates snapshot/current and diff report', async () => {
    const base = join(sandbox, 'docs', 'context7');

    // Write inbox content for one lib/topic
    const libKey = 'vercel-next.js';
    const topic = 'routing';
    const inboxFile = join(base, 'inbox', libKey, `${topic}.md`);
    await mkdir(join(base, 'inbox', libKey), { recursive: true });
    await writeFile(inboxFile, '# Next.js Routing\nNew content', 'utf8');

    // Run without flags
    const { stdout } = await execFileAsync('node', [SCRIPT_PATH], { cwd: sandbox, env: process.env, encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
    expect(stdout).toContain('Fertig.');

    // Find latest snapshot folder
    const snapshotsDir = join(base, 'snapshots');
    const folders = await listDirs(snapshotsDir);
    expect(folders.length).toBeGreaterThan(0);
    const latest = folders.sort()[folders.length - 1];

    // Verify snapshot and current file were written
    const snapFile = join(snapshotsDir, latest, libKey, `${topic}.md`);
    const curFile = join(base, 'current', libKey, `${topic}.md`);
    expect(await pathExists(snapFile)).toBe(true);
    expect(await pathExists(curFile)).toBe(true);

    // Verify a diff report exists with timestamp in name
    const diffsDir = join(base, 'diffs');
    const diffFiles = (await readdir(diffsDir)).filter(f => f.startsWith('diff-') && f.endsWith('.md'));
    expect(diffFiles.length).toBeGreaterThan(0);
  });
});
