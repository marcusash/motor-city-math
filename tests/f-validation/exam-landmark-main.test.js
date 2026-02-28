// Static analysis: WCAG landmark - exam.html must have role=main
// Per WCAG 1.3.6 / ARIA best practice: page must have main landmark

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-landmark-main.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// ── exam.html: role=main ───────────────────────────────────────
console.log('\u2500\u2500 exam.html landmarks \u2500\u2500');
test('exam.html has role=main', examSrc.includes('role="main"') || examSrc.includes("role='main'") || examSrc.includes('<main'));
test('exam.html main is a div or main element', examSrc.includes('role="main"') || examSrc.includes('<main'));

// ── index.html: main landmark ─────────────────────────────────
console.log('\n\u2500\u2500 index.html landmarks \u2500\u2500');
test('index.html has main landmark', indexSrc.includes('<main') || indexSrc.includes('role="main"') || indexSrc.includes("role='main'"));

// ── exam.html: nav landmark ───────────────────────────────────
console.log('\n\u2500\u2500 exam.html nav landmark \u2500\u2500');
// exam.html is a single-page test form: no repeated nav block needed
// Previous/next are form controls, not site navigation
test('exam.html has no site nav (single-page form, expected)', !examSrc.includes('<nav'));
test('exam.html uses btn-class controls instead of nav landmark', examSrc.includes('nav-btn') || examSrc.includes('btn-primary') || examSrc.includes('submit-btn'));

// ── Skip link / bypass block ───────────────────────────────────
console.log('\n\u2500\u2500 WCAG 2.4.1 Bypass Blocks \u2500\u2500');
var hasSkipLink = examSrc.includes('skip') && (examSrc.includes('#main') || examSrc.includes('#content'));
var hasOnlyOneBlock = !examSrc.includes('<nav'); // if no nav, no bypass needed
test('exam.html bypass mechanism present or nav absent', hasSkipLink || !examSrc.includes('<nav'));
test('index.html has skip link or no nav', indexSrc.includes('skip') || !indexSrc.includes('<nav'));

console.log('\n' + '='.repeat(50));
console.log('exam-landmark-main: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
