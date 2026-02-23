/**
 * inline-script-syntax-check.test.js
 * GF gf-delivery-05: Parse-failure detection gate.
 *
 * Extracts the main <script> block from index.html and runs node --check on it.
 * A JS block-level parse failure silently kills all functions in the block at runtime
 * with zero console errors (see postmortem-20260222-mcm-dashboard-failure.md).
 * This test catches that class of failure in CI, not just pre-deploy.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..', '..');

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

function extractScripts(html) {
  const blocks = [];
  const re = /<script(?:\s[^>]*)?>([^]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const body = m[1].trim();
    if (body.length > 100) blocks.push(body);
  }
  return blocks;
}

function syntaxCheck(label, scriptBody) {
  const tmp = path.join(os.tmpdir(), `mcm-syntax-${Date.now()}-${Math.random().toString(36).slice(2)}.js`);
  fs.writeFileSync(tmp, scriptBody, 'utf8');
  try {
    execSync(`node --check "${tmp}"`, { stdio: 'pipe' });
    pass(`${label}: syntax OK`);
  } catch (e) {
    const stderr = e.stderr ? e.stderr.toString() : '';
    fail(`${label}: syntax error — ${stderr.split('\n')[0]}`);
  } finally {
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
}

console.log('\nInline Script Syntax Check\n');

const targets = [
  'index.html',
  'exam.html',
  'final_exam_251123.html',
];

for (const rel of targets) {
  const fullPath = path.join(ROOT, rel);
  if (!fs.existsSync(fullPath)) {
    fail(`${rel}: file not found`);
    continue;
  }
  const html = fs.readFileSync(fullPath, 'utf8');
  const blocks = extractScripts(html);
  if (blocks.length === 0) {
    fail(`${rel}: no inline script blocks found`);
    continue;
  }
  blocks.forEach((block, i) => {
    syntaxCheck(`${rel} block[${i + 1}]`, block);
  });
}

console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}
