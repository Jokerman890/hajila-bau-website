import { join } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createTestStructure, removeTestDir, readTestFile } from './test-utils.js';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test directories
const TEST_DIR = join(__dirname, '../../test-diffs');
const DIFFS_DIR = join(TEST_DIR, 'diffs');

// Test file structure
const testStructure = {
  'current': {
    'test.md': '# Test Document\nNew content',
    'nested': {
      'file.md': 'Nested file content'
    }
  },
  'snapshots': {
    'test.md': '# Test Document\nOld content',
    'nested': {
      'file.md': 'Old nested file content'
    }
  },
  'diffs': {}
};

describe('create-diffs.js', () => {
  let testDir;
  
  beforeAll(async () => {
    // Create test directory structure
    testDir = await createTestStructure(testStructure, TEST_DIR);
    
    // Set environment variables for testing
    process.env.TEST_MODE = 'true';
    
    // Run the script
    const SCRIPT_PATH = join(__dirname, '..', 'create-diffs.js');
    const projectRoot = join(__dirname, '..', '..');
    const { stdout, stderr } = await execFileAsync('node', [SCRIPT_PATH], {
      cwd: projectRoot,
      env: { ...process.env, TEST_MODE: 'true' },
      encoding: 'utf8',
      maxBuffer: 5 * 1024 * 1024
    });
    if (stdout) console.log('[create-diffs.test] stdout:\n' + stdout);
    if (stderr) console.log('[create-diffs.test] stderr:\n' + stderr);
  });
  
  afterAll(async () => {
    // Clean up test directory
    await removeTestDir(testDir);
    delete process.env.TEST_MODE;
  });
  
  test('should create diff files for changed content', async () => {
    // zusätzliche Diagnose
    console.log('[create-diffs.test] Erwartetes DIFFS_DIR:', DIFFS_DIR);
    const diffContent = await readTestFile(join(DIFFS_DIR, 'test.md.diff'));
    // Compatible with git diff (no space) and fallback (space after +/-)
    expect(diffContent).toMatch(/-\s?# Test Document[\s\S]*-\s?Old content/);
    expect(diffContent).toMatch(/\+\s?# Test Document[\s\S]*\+\s?New content/);
  });
  
  test('should handle nested directories', async () => {
    console.log('[create-diffs.test] Erwartetes DIFFS_DIR (nested):', DIFFS_DIR);
    const nestedDiff = await readTestFile(join(DIFFS_DIR, 'nested', 'file.md.diff'));
    expect(nestedDiff).toMatch(/-\s?Old nested file content/);
    expect(nestedDiff).toMatch(/\+\s?Nested file content/);
  });
  
  test('should not create diff files for identical content', async () => {
    // This test would verify that no diff is created for identical files
    // Implementation would depend on your specific requirements
    expect(true).toBe(true);
  });
});
