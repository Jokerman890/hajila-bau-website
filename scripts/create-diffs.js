import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);

// Konfiguration basierend auf Umgebungsvariablen
const TEST_MODE = process.env.TEST_MODE === 'true';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Robust: ROOT relativ zum Skriptordner (../)
const ROOT = path.resolve(__dirname, '..');

// Pfade basierend auf Testmodus setzen
const getPaths = () => {
  const testRoot = path.join(ROOT, 'test-diffs');
  const isTestEnv = TEST_MODE || fsSync.existsSync(testRoot);
  if (isTestEnv) {
    const testRoot = path.join(ROOT, 'test-diffs');
    console.log('[create-diffs] TEST_MODE erkannt');
    console.log('[create-diffs] process.cwd() =', process.cwd());
    console.log('[create-diffs] ROOT =', ROOT);
    console.log('[create-diffs] testRoot =', testRoot);
    return {
      diffs: path.join(testRoot, 'diffs'),
      current: path.join(testRoot, 'current'),
      snapshots: path.join(testRoot, 'snapshots')
    };
  }
  
  return {
    diffs: path.join(ROOT, 'docs', 'context7', 'diffs'),
    current: path.join(ROOT, 'docs', 'context7', 'current'),
    snapshots: path.join(ROOT, 'docs', 'context7', 'snapshots')
  };
};

const { diffs: DIFFS_DIR, current: CURRENT_DIR, snapshots: SNAPSHOTS_DIR } = getPaths();

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function getFilesRecursively(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFilesRecursively(res) : res;
    })
  );
  return files.flat();
}

async function createDiffs() {
  try {
    // Ensure directories exist
    await ensureDir(DIFFS_DIR);
    await ensureDir(CURRENT_DIR);
    await ensureDir(SNAPSHOTS_DIR);
    if (TEST_MODE) {
      console.log('[create-diffs] DIFFS_DIR =', DIFFS_DIR);
      console.log('[create-diffs] CURRENT_DIR =', CURRENT_DIR);
      console.log('[create-diffs] SNAPSHOTS_DIR =', SNAPSHOTS_DIR);
      try {
        const curList = await fs.readdir(CURRENT_DIR, { withFileTypes: true });
        const snapList = await fs.readdir(SNAPSHOTS_DIR, { withFileTypes: true });
        console.log('[create-diffs] CURRENT_DIR entries:', curList.map(d => d.name));
        console.log('[create-diffs] SNAPSHOTS_DIR entries:', snapList.map(d => d.name));
      } catch (e) {
        console.warn('[create-diffs] Verzeichnisauflistung fehlgeschlagen:', e?.message || e);
      }
    }
    
    // Get all markdown files in current directory
    const files = await getFilesRecursively(CURRENT_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    if (TEST_MODE) {
      console.log('[create-diffs] Gefundene Dateien in CURRENT_DIR:', files.length);
      console.log('[create-diffs] Markdown-Dateien:', mdFiles.map(f => path.relative(CURRENT_DIR, f)));
    }
    
    // Create diffs for each file
    for (const file of mdFiles) {
      const relativePath = path.relative(CURRENT_DIR, file);
      const snapshotPath = path.join(SNAPSHOTS_DIR, relativePath);
      const diffPath = path.join(DIFFS_DIR, `${relativePath}.diff`);
      
      // Create directory for diff if it doesn't exist
      await ensureDir(path.dirname(diffPath));
      
      try {
        // Check if snapshot exists
        await fs.access(snapshotPath);
        
        // Create diff
        console.log(`Creating diff for ${relativePath}`);
        let diffOutput = '';
        try {
          const { stdout, stderr } = await execPromise(
            `git diff --no-index "${snapshotPath}" "${file}"`,
            { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer for large files
          );
          diffOutput = stdout || 'No changes';
          if (stderr) {
            console.error(`Error creating diff for ${relativePath}:`, stderr);
          }
        } catch {
          // Fallback: simple inline diff if git is unavailable
          try {
            const [oldContent, newContent] = await Promise.all([
              fs.readFile(snapshotPath, 'utf8'),
              fs.readFile(file, 'utf8'),
            ]);
            diffOutput = [
              'Fallback diff (git unavailable)\n',
              '--- snapshot\n',
              '+++ current\n',
              `- ${oldContent.split('\n').join('\n- ')}`,
              `+ ${newContent.split('\n').join('\n+ ')}`,
            ].join('');
          } catch (fallbackErr) {
            console.error(`Fallback diff failed for ${relativePath}:`, fallbackErr);
            diffOutput = 'Initial version\n';
          }
        }
        
        // Write diff to file
        await fs.writeFile(diffPath, diffOutput, 'utf8');
        if (TEST_MODE) {
          console.log('[create-diffs] Diff geschrieben:', diffPath);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Snapshot doesn't exist, create an "initial" diff
          console.log(`No snapshot found for ${relativePath}, creating initial diff`);
          await fs.writeFile(diffPath, 'Initial version\n', 'utf8');
          if (TEST_MODE) {
            console.log('[create-diffs] Initial-Diff geschrieben:', diffPath);
          }
        } else {
          console.error(`Error processing ${relativePath}:`, error);
        }
      }
    }
    
    console.log('All diffs created successfully');
  } catch (error) {
    console.error('Error in createDiffs:', error);
    process.exit(1);
  }
}

// Run the script
createDiffs();
