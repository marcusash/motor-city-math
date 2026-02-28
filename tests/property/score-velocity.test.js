/**
 * Test for score-velocity.cjs
 * Verifies script runs without error and produces expected output fields.
 * Run: node tests/property/score-velocity.test.js
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const script = path.join(ROOT, 'scripts', 'score-velocity.cjs');

const result = spawnSync(process.execPath, [script], {
  encoding: 'utf8',
  cwd: ROOT,
  timeout: 30000,
});

if (result.error) {
  console.error(`FAIL: score-velocity.cjs failed to run: ${result.error.message}`);
  process.exit(1);
}

const output = result.stdout + (result.stderr || '');

// Script should exit 0 (either has data or gracefully handles no data)
if (result.status !== 0) {
  console.error(`FAIL: score-velocity.cjs exited ${result.status}`);
  console.error(output.substring(0, 300));
  process.exit(1);
}

// Check for expected output fields
const expectedPatterns = [
  /Score Velocity/i,
];

let pass = 0;
let fail = 0;

for (const pattern of expectedPatterns) {
  if (pattern.test(output)) {
    console.log(`PASS: output contains expected pattern "${pattern}"`);
    pass++;
  } else {
    console.error(`FAIL: output missing expected pattern "${pattern}"`);
    console.error('Got:', output.substring(0, 200));
    fail++;
  }
}

console.log(`\n${pass} checks passed, ${fail} failed`);
if (fail > 0) process.exit(1);
