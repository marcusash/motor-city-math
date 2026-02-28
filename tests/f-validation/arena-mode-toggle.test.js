// Arena mode toggle test
// index.html has arena mode (dark theme for focus sessions)
// FD spec: arena mode = dark palette, no distractions, timer visible

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} arena-mode-toggle.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Arena mode toggle checks \u2500\u2500\n');

// 1. Arena mode class exists in CSS
var hasArenaClass = cssSrc.includes('.arena') || cssSrc.includes('arena-mode') || cssSrc.includes('data-theme');
test('Arena mode CSS class exists (.arena or data-theme)', hasArenaClass);

// 2. Dark background token in arena mode
var hasArenaDark = cssSrc.includes('#0A0E1A') || cssSrc.includes('#161b22') ||
                   cssSrc.includes('0d1117') || (cssSrc.includes('arena') && cssSrc.includes('bg'));
test('Arena mode uses dark background color', hasArenaDark);

// 3. Arena toggle button or mechanism in index.html
var hasToggle = indexSrc.includes('arena') || indexSrc.includes('Arena') || indexSrc.includes('dark-mode');
test('Arena toggle mechanism exists in index.html', hasToggle);

// 4. CSS vars override in arena mode (custom properties)
var hasVarOverride = cssSrc.includes('.arena') && cssSrc.includes('--') ||
                     cssSrc.includes('[data-theme') && cssSrc.includes('--');
test('Arena mode overrides CSS custom properties', hasVarOverride);

// 5. Exam.html also has arena mode context (dark timer/background when in arena)
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var examHasArena = examSrc.includes('arena') || examSrc.includes('Arena') || examSrc.includes('dark');
test('exam.html supports arena mode styling context', examHasArena);

console.log('\n' + '='.repeat(50));
console.log('arena-mode-toggle: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
