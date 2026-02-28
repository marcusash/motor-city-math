#!/usr/bin/env node
/**
 * gi-ci-integration-test.test.js
 * Integration test: ci-data-gate exits 0 on the clean exam corpus.
 * Regression guard — if gate starts failing on clean data, catch it immediately.
 * Run: node tests/property/ci-gate-clean.test.js
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const gateScript = path.join(ROOT, 'scripts', 'ci-data-gate.cjs');

console.log('Running ci-data-gate.cjs on clean corpus...');
const result = spawnSync(process.execPath, [gateScript], {
  encoding: 'utf8',
  cwd: ROOT,
  timeout: 60000,
});

if (result.error) {
  console.error(`FAIL: ci-data-gate failed to run: ${result.error.message}`);
  process.exit(1);
}

if (result.status === 0) {
  console.log('PASS: ci-data-gate exited 0 on clean exam corpus');
  const lastLines = (result.stdout || '').split('\n').filter(Boolean).slice(-3);
  for (const line of lastLines) {
    console.log(' ', line);
  }
} else {
  console.error(`FAIL: ci-data-gate exited ${result.status} (expected 0 on clean corpus)`);
  console.error('stdout:', (result.stdout || '').split('\n').slice(-10).join('\n'));
  console.error('stderr:', result.stderr || '');
  process.exit(1);
}
