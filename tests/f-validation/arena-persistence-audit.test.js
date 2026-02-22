/**
 * arena-persistence-audit.test.js
 * Static audit of Arena Mode persistence + toggle wiring across active pages.
 *
 * Run: node tests/f-validation/arena-persistence-audit.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ACTIVE_PAGES = [
  'index.html',
  'exam.html',
  'nonlinear_exam_mvp.html',
  'final_exam_251123.html',
  'final_exam_251123_mini.html',
];

let total = 0, pass = 0, fail = 0;
const findings = [];
function test(name, ok, detail = '') {
  total++;
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
    findings.push({ name, detail });
  }
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf-8');
}

console.log('\n🏀 arena-persistence-audit.test.js\n');

// Global shared script checks
const shared = read(path.join('shared', 'scripts.js'));
test('shared: arena storage key exists', shared.includes("localStorage.setItem('mcm-arena-mode'"));
test('shared: restore stored arena preference', shared.includes("localStorage.getItem('mcm-arena-mode')"));
test('shared: arena toggle insertion logic exists', shared.includes("btn.id = 'arenaToggle'"));

console.log('\n── Per-page audit ──');
for (const file of ACTIVE_PAGES) {
  const html = read(file);
  const usesSharedScripts = html.includes('shared/scripts.js');
  const hasHeader = /<header[\s>]/i.test(html);
  const hasHardcodedArenaClass = /class\s*=\s*["'][^"']*arena-mode[^"']*["']/i.test(html);
  const hasLegacyToggle = html.includes('id="arenaToggle"') || html.includes('class="arena-toggle"');

  test(`${file}: includes shared/scripts.js`, usesSharedScripts);
  test(`${file}: has <header> for injected toggle`, hasHeader);
  test(`${file}: no hardcoded arena-mode class`, !hasHardcodedArenaClass, 'hardcoded body class can bypass toggle behavior');

  // Informational consistency check
  if (!usesSharedScripts && hasLegacyToggle) {
    findings.push({
      name: `${file}: legacy arena toggle`,
      detail: 'page defines local toggle but skips shared persistence logic',
    });
    console.log(`  ⚠️ ${file}: legacy arena toggle without shared/scripts.js`);
  }
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);

if (findings.length) {
  console.log('\nFindings:');
  findings.forEach(f => console.log(`  - ${f.name}${f.detail ? `: ${f.detail}` : ''}`));
}

if (fail > 0) process.exit(1);
