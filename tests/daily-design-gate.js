/**
 * GF Daily Design Gate (gf-queue-daily-design-gate)
 *
 * Run every morning before Kai studies. Checks design token contracts,
 * dark/light mode integrity, responsive CSS, and type scale.
 *
 * Pure static analysis — no browser/Playwright required.
 *
 * Usage:
 *   node tests/daily-design-gate.js
 *   node tests/daily-design-gate.js --verbose   # show pass lines too
 *
 * Exit 0 = all design gates green.
 * Exit 1 = one or more design failures.
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const VERBOSE = process.argv.includes('--verbose');
const ROOT = path.join(__dirname, '..');
const SUITES_DIR = path.join(__dirname, 'f-validation');

const DESIGN_SUITES = [
  { file: 'color-token-enforcement.test.js', label: 'Color tokens' },
  { file: 'font-token-enforcement.test.js',  label: 'Font tokens' },
  { file: 'type-scale-contract.test.js',     label: 'Type scale lock (GD)' },
  { file: 'arena-dark-mode-qa.test.js',      label: 'Arena/dark mode CSS' },
  { file: 'light-mode-checklist.test.js',    label: 'Light mode :root tokens' },
  { file: 'responsive-375-768.test.js',      label: 'Responsive 375/768px' },
];

const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const WARN = '\x1b[33m⚠\x1b[0m';

let passed = 0;
let failed = 0;
const failures = [];

console.log('\n╔══════════════════════════════════════╗');
console.log('║    GF Daily Design Gate              ║');
console.log(`║    ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC              ║`);
console.log('╚══════════════════════════════════════╝\n');

for (const { file, label } of DESIGN_SUITES) {
  const suite = path.join(SUITES_DIR, file);
  if (!fs.existsSync(suite)) {
    console.log(`  ${WARN} ${label}: suite not found (${file})`);
    continue;
  }
  try {
    const out = execSync(`node "${suite}"`, { cwd: ROOT, timeout: 30000 }).toString();
    const m = out.match(/Tests:\s*(\d+)\s*total,\s*(\d+)\s*passed,\s*(\d+)\s*failed/) ||
              out.match(/Total:\s*(\d+)[\s\S]*?Passed:\s*(\d+)[\s\S]*?Failed:\s*(\d+)/) ||
              out.match(/(\d+)\s+checks:\s+(\d+)\s+passed/);
    const total = m ? parseInt(m[1]) : '?';
    const p = m ? parseInt(m[2]) : '?';
    console.log(`  ${PASS} ${label}: ${p}/${total}`);
    passed++;
    if (VERBOSE) process.stdout.write(out.split('\n').map(l => '    ' + l).join('\n') + '\n');
  } catch (e) {
    const out = (e.stdout || '').toString();
    const m = out.match(/Tests:\s*(\d+)\s*total,\s*(\d+)\s*passed,\s*(\d+)\s*failed/) ||
              out.match(/Total:\s*(\d+)[\s\S]*?Passed:\s*(\d+)[\s\S]*?Failed:\s*(\d+)/) ||
              out.match(/(\d+)\s+checks:\s+(\d+)\s+passed/);
    const total = m ? parseInt(m[1]) : '?';
    const p = m ? parseInt(m[2]) : '?';
    console.log(`  ${FAIL} ${label}: ${p}/${total}`);
    failed++;
    failures.push({ label, file, out });
    if (VERBOSE) process.stdout.write(out.split('\n').map(l => '    ' + l).join('\n') + '\n');
  }
}

console.log('\n' + '─'.repeat(42));
console.log(`Design Gate: ${passed}/${passed + failed} suites green\n`);

if (failures.length > 0) {
  console.log(`${FAIL} DESIGN DRIFT DETECTED — ${failures.length} suite(s) failing:\n`);
  for (const { label, file } of failures) {
    console.log(`  • ${label} (${file})`);
    console.log(`    Run: node tests/f-validation/${file}`);
  }
  console.log('');
  process.exit(1);
} else {
  console.log(`${PASS} Design is clean. No drift detected.\n`);
  process.exit(0);
}
