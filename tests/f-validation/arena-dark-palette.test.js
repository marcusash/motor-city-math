// Arena mode dark palette test
// Arena mode must use dark colors only: bg-page must be dark, text must be light
// Checks that arena CSS overrides use MCM dark palette values

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} arena-dark-palette.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Arena dark palette checks \u2500\u2500\n');

// 1. Arena class/selector exists in CSS
var hasArenaSelector = cssSrc.includes('.arena') || cssSrc.includes('[data-theme="arena"]');
test('.arena or [data-theme="arena"] selector exists in CSS', hasArenaSelector);

// 2. Arena uses dark background (0A0E1A or similar very dark color)
var hasArenaBackground = cssSrc.includes('0A0E1A') || cssSrc.includes('0a0e1a') ||
                         (cssSrc.includes('.arena') && cssSrc.includes('--bg-page'));
test('Arena mode has dark background override (0A0E1A or --bg-page override)', hasArenaBackground);

// 3. Arena uses MCM dark palette (navy/black tone, not light gray)
var hasNightTone = cssSrc.includes('0A0E1A') || cssSrc.includes('0D1117') ||
                   cssSrc.includes('111827') || cssSrc.includes('1a1a2e');
test('Arena palette has night/dark tone (deep navy or black)', hasNightTone);

// 4. Arena toggle or activation exists (JS or CSS class)
var hasArenaToggle = indexSrc.includes('arena') && (indexSrc.includes('classList') || indexSrc.includes('toggle') || indexSrc.includes('arena-mode'));
test('Arena toggle logic exists in index.html', hasArenaToggle);

// 5. arena class is used in exam.html too
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var hasExamArena = examSrc.includes('arena') && (examSrc.includes('.arena') || examSrc.includes('arena-mode'));
test('Arena styling referenced in exam.html', hasExamArena);

console.log('\n' + '='.repeat(50));
console.log('arena-dark-palette: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
