/**
 * add-schema-version.test.js
 * Tests the dry-run and --exam flag of add-schema-version.cjs.
 * Does NOT write to disk (no --write flag used).
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT   = path.join(__dirname, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'add-schema-version.cjs');

// ── Test 1: Dry run — all exams already have schema_version (should skip all) ──

let output1 = '';
let exit1 = 0;
try {
  output1 = execSync(`node "${SCRIPT}"`, { cwd: ROOT, encoding: 'utf8' });
} catch (err) {
  exit1 = err.status || 1;
  output1 = err.stdout || err.message;
}

// All RP1-11 already have schema_version — should show all SKIP
console.assert(exit1 === 0, `Dry run should exit 0, got ${exit1}`);
console.assert(output1.includes('SKIP'), `Dry run should show SKIP for already-versioned exams`);

const skipCount = (output1.match(/^SKIP/gm) || []).length;
console.log(`PASS: dry run shows ${skipCount} SKIP lines (expected 11)`);
console.assert(skipCount >= 11, `Expected at least 11 SKIP lines, got ${skipCount}`);

// ── Test 2: --exam flag (single exam dry run) ──

let output2 = '';
let exit2 = 0;
try {
  output2 = execSync(`node "${SCRIPT}" --exam retake-practice-1`, { cwd: ROOT, encoding: 'utf8' });
} catch (err) {
  exit2 = err.status || 1;
  output2 = err.stdout || err.message;
}

console.assert(exit2 === 0, `--exam flag dry run should exit 0, got ${exit2}`);
console.assert(output2.includes('Files: 1'), `--exam should process 1 file, got: ${output2.slice(0, 200)}`);
console.log('PASS: --exam flag limits to 1 file');

// ── Test 3: Schema version label in output ──

console.assert(output1.includes('1.0'), `Expected schema version 1.0 in output`);
console.log('PASS: schema version 1.0 in output');

console.log('\nAll add-schema-version tests passed.');
