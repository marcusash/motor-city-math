/**
 * validate-standards-map.test.js
 * Adversary tests for scripts/validate-standards-map.cjs
 *
 * Run: node tests/validate-standards-map.test.js
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts', 'validate-standards-map.cjs');

let pass = 0;
let fail = 0;

function test(name, fn) {
  try {
    fn();
    pass++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    fail++;
    console.log(`  ❌ ${name}: ${err.message}`);
  }
}

function writeJson(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

function createTempDataDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcm-standards-'));
  return dir;
}

function runValidator(dataDir) {
  return spawnSync('node', [SCRIPT], {
    env: { ...process.env, MCM_DATA_DIR: dataDir },
    encoding: 'utf8'
  });
}

function buildBaseFiles(dataDir, standardsData, questionsData, examData) {
  writeJson(path.join(dataDir, 'standards.json'), standardsData);
  writeJson(path.join(dataDir, 'questions.json'), questionsData);
  writeJson(path.join(dataDir, 'retake-practice-1.json'), examData);
}

console.log('\n🏀 validate-standards-map.test.js\n');

test('Fails on missing standard field', () => {
  const dataDir = createTempDataDir();
  buildBaseFiles(
    dataDir,
    { units: [{ id: 'unit1', standards: [{ id: 'W1.a' }] }] },
    { questions: [{ id: 'q1' }] },
    { questions: [{ id: 'e1', standard: 'W1.a' }] }
  );

  const result = runValidator(dataDir);
  if (result.status === 0) throw new Error('Expected non-zero exit code');
  if (!result.stdout.includes('missing standard') && !result.stderr.includes('missing standard')) {
    throw new Error('Missing standard error not reported');
  }
});

test('Fails on typo standard ID', () => {
  const dataDir = createTempDataDir();
  buildBaseFiles(
    dataDir,
    { units: [{ id: 'unit1', standards: [{ id: 'W1.a' }] }] },
    { questions: [{ id: 'q1', standard: 'W1.z' }] },
    { questions: [{ id: 'e1', standard: 'W1.a' }] }
  );

  const result = runValidator(dataDir);
  if (result.status === 0) throw new Error('Expected non-zero exit code');
  if (!result.stdout.includes('unknown standard') && !result.stderr.includes('unknown standard')) {
    throw new Error('Unknown standard error not reported');
  }
});

test('Fails on duplicate standard IDs', () => {
  const dataDir = createTempDataDir();
  buildBaseFiles(
    dataDir,
    { units: [{ id: 'unit1', standards: [{ id: 'W1.a' }, { id: 'W1.a' }] }] },
    { questions: [{ id: 'q1', standard: 'W1.a' }] },
    { questions: [{ id: 'e1', standard: 'W1.a' }] }
  );

  const result = runValidator(dataDir);
  if (result.status === 0) throw new Error('Expected non-zero exit code');
  if (!result.stdout.includes('Duplicate standard IDs') && !result.stderr.includes('Duplicate standard IDs')) {
    throw new Error('Duplicate standard ID error not reported');
  }
});

console.log(`\nResults: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
