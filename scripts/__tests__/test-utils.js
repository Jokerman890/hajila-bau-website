import { mkdir, readFile, writeFile, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Creates a temporary test directory structure
 * @param {Object} structure - The directory structure to create
 * @param {string} [basePath=__dirname] - The base path to create the structure in
 * @returns {Promise<string>} The path to the created test directory
 */
export async function createTestStructure(structure, basePath = __dirname) {
  // Wenn ein basePath übergeben wurde, verwende ihn direkt als Root.
  // Nur wenn keiner übergeben wurde, lege unter __dirname/test-temp an.
  const testDir = basePath ? basePath : join(__dirname, 'test-temp');
  await mkdir(testDir, { recursive: true });
  
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = join(testDir, name);
    if (typeof content === 'string') {
      // It's a file
      await writeFile(fullPath, content, 'utf8');
    } else {
      // It's a directory
      await mkdir(fullPath, { recursive: true });
      // Recursively create the directory structure
      await createTestStructure(content, fullPath);
    }
  }
  
  return testDir;
}

/**
 * Removes a directory and all its contents
 * @param {string} dir - The directory to remove
 * @returns {Promise<void>}
 */
export async function removeTestDir(dir) {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch (err) {
    // Non-fatal in tests
    console.warn(`[TEST] removeTestDir warning for ${dir}:`, err?.message || err);
  }
}

/**
 * Creates a test file
 * @param {string} path - The path where to create the file
 * @param {string} content - The content of the file
 * @returns {Promise<void>}
 */
export async function createTestFile(path, content = '') {
  await writeFile(path, content, 'utf8');
}

/**
 * Reads a test file
 * @param {string} path - The path to the file to read
 * @returns {Promise<string>} The content of the file
 */
export async function readTestFile(path) {
  return await readFile(path, 'utf8');
}
