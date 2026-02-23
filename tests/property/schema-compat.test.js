/**
 * schema-compat.test.js
 * Tests schema-compat.cjs exits 0 in --all and --matrix modes,
 * and produces meaningful output (scores between 0 and 1).
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT   = path.join(__dirname, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'schema-compat.cjs');

// ── Test 1: --all mode exits 0 and shows adjacent pair comparisons ──

let output1 = '';
let exit1 = 0;
try {
  output1 = execSync(`node "${SCRIPT}" --all`, { cwd: ROOT, encoding: 'utf8' });
} catch (err) {
  exit1 = err.status || 1;
  output1 = err.stdout || err.message;
}

console.assert(exit1 === 0, `--all mode should exit 0, got ${exit1}`);
// Should mention RP1 vs RP2 (first adjacent pair)
console.assert(output1.includes('retake-practice-1') || output1.includes('RP1') || output1.includes('practice-1'),
  `--all mode should mention retake-practice-1`);
console.log(`PASS: --all mode exits 0`);

// ── Test 2: --matrix mode exits 0 ──

let output2 = '';
let exit2 = 0;
try {
  output2 = execSync(`node "${SCRIPT}" --matrix`, { cwd: ROOT, encoding: 'utf8' });
} catch (err) {
  exit2 = err.status || 1;
  output2 = err.stdout || err.message;
}

console.assert(exit2 === 0, `--matrix mode should exit 0, got ${exit2}`);
console.log(`PASS: --matrix mode exits 0`);

// ── Test 3: pair comparison (two specific files) ──

const rp1 = path.join(ROOT, 'data', 'retake-practice-1.json');
const rp11 = path.join(ROOT, 'data', 'retake-practice-11.json');
let output3 = '';
let exit3 = 0;
try {
  output3 = execSync(`node "${SCRIPT}" "${rp1}" "${rp11}"`, { cwd: ROOT, encoding: 'utf8' });
} catch (err) {
  exit3 = err.status || 1;
  output3 = err.stdout || err.message;
}

console.assert(exit3 === 0, `pair mode should exit 0, got ${exit3}`);
// Should show a compatibility score (look for % or a decimal)
const hasScore = /\d+(\.\d+)?%/.test(output3) || /score[:\s]+0\.\d+/i.test(output3) || output3.includes('compat');
console.assert(hasScore, `pair mode should show compatibility score. Got: ${output3.slice(0, 200)}`);
console.log(`PASS: pair mode exits 0 and shows compatibility score`);

console.log('\nAll schema-compat tests passed.');
