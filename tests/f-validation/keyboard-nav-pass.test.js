/**
 * keyboard-nav-pass.test.js
 * Static keyboard-navigation guardrails for core pages.
 *
 * Run: node tests/f-validation/keyboard-nav-pass.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const sharedCss = fs.readFileSync(path.join(ROOT, 'shared', 'styles.css'), 'utf-8');
const sharedJs = fs.readFileSync(path.join(ROOT, 'shared', 'scripts.js'), 'utf-8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok, detail = '') {
  total++;
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n🏀 keyboard-nav-pass.test.js\n');

test('focus-visible outline rule exists', sharedCss.includes(':focus-visible') && sharedCss.includes('outline: 3px solid var(--accent-blue-on-dark);'));
test('focus fallback suppression exists', sharedCss.includes(':focus:not(:focus-visible)'));
test('arena toggle has aria-label', sharedJs.includes("btn.setAttribute('aria-label', 'Toggle dark mode');"));
test('shared back link has aria-label', sharedJs.includes("back.setAttribute('aria-label', 'Back to Dashboard');"));
test('timer role/aria contract exists', sharedJs.includes("timerEl.setAttribute('role', 'timer');") && sharedJs.includes("timerEl.setAttribute('aria-label', 'Time remaining');"));
test('index has skip link target', /href=["']#main["']/i.test(indexHtml) || /class=["'][^"']*sr-only/i.test(indexHtml));
test('exam has skip link target', /href=["']#questionsContainer["']/i.test(examHtml) || /class=["'][^"']*sr-only/i.test(examHtml));
test('exam has keyboard-reachable submit button', examHtml.includes('<button class="btn-primary"'));
test('index chart has accessible aria label', indexHtml.includes('aria-label="Score progress chart'));

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);
if (fail > 0) process.exit(1);
