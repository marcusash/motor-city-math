#!/usr/bin/env node
// gp-run-all-tests.js — runs ALL gp-*.test.js files and reports pass/fail summary

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TESTS_DIR = path.join(__dirname, '..', 'tests');
const gpTests = fs.readdirSync(TESTS_DIR)
  .filter(f => /^gp-.*\.test\.js$/.test(f))
  .sort();

console.log(`=== GP TEST SUITE RUN (${gpTests.length} tests) ===\n`);
const start = Date.now();

let passed = 0;
let failed = 0;
let errored = 0;
const failures = [];

for (const testFile of gpTests) {
  const testPath = path.join(TESTS_DIR, testFile);
  try {
    const output = execSync(`node "${testPath}"`, { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
    });
    const firstLine = output.split('\n')[0];
    passed++;
    process.stdout.write(`  ✅ ${testFile.padEnd(55)} ${firstLine}\n`);
  } catch (e) {
    const code = e.status;
    if (code === 1) {
      failed++;
      failures.push({ file: testFile, output: e.stdout || '', err: e.stderr || '' });
      const firstLine = (e.stdout || '').split('\n')[0];
      process.stdout.write(`  ❌ ${testFile.padEnd(55)} FAIL\n`);
    } else {
      errored++;
      process.stdout.write(`  ⚠️  ${testFile.padEnd(55)} ERROR (exit ${code})\n`);
    }
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log(`\n${'='.repeat(70)}`);
console.log(`RESULTS: ${passed} passed, ${failed} failed, ${errored} errored / ${gpTests.length} total`);
console.log(`Time: ${elapsed}s`);

if (failures.length > 0) {
  console.log('\nFAILURES:');
  for (const f of failures) {
    console.log(`\n  ${f.file}:`);
    f.output.split('\n').filter(Boolean).slice(0, 5).forEach(l => console.log(`    ${l}`));
  }
  process.exit(1);
}

console.log('\n✅ ALL GP TESTS PASSED');
