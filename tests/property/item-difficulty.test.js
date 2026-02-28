/**
 * Test for compute-item-difficulty.cjs
 * Verifies script runs without error and produces expected output.
 * Run: node tests/property/item-difficulty.test.js
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const script = path.join(ROOT, 'scripts', 'compute-item-difficulty.cjs');

const result = spawnSync(process.execPath, [script], {
  encoding: 'utf8',
  cwd: ROOT,
  timeout: 30000,
});

if (result.error) {
  console.error(`FAIL: compute-item-difficulty.cjs failed to run: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`FAIL: compute-item-difficulty.cjs exited ${result.status}`);
  console.error((result.stdout + result.stderr).substring(0, 300));
  process.exit(1);
}

const output = result.stdout;
const checks = [
  { pattern: /Item Difficulty/i, desc: 'report header present' },
  { pattern: /Q1\s+.*%/, desc: 'Q1 difficulty row present' },
  { pattern: /(EASY|MODERATE|HARD|VERY HARD)/i, desc: 'difficulty rating label present' },
];

let pass = 0;
let fail = 0;

for (const { pattern, desc } of checks) {
  if (pattern.test(output)) {
    console.log(`PASS: ${desc}`);
    pass++;
  } else {
    console.error(`FAIL: ${desc}`);
    console.error('Output excerpt:', output.substring(0, 300));
    fail++;
  }
}

console.log(`\n${pass} checks passed, ${fail} failed`);
if (fail > 0) process.exit(1);
