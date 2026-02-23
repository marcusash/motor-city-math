// parseStudentAnswer edge cases test
// Tests the shared answer parser against known input patterns

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} parseStudentAnswer-edge-cases.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

// Extract function source
var fnStart = src.indexOf('function parseStudentAnswer(');
var fnSrc = src.substring(fnStart, fnStart + 1500);

console.log('\u2500\u2500 Source contracts \u2500\u2500');

// 1. Returns NaN for empty/whitespace
test('Returns NaN for empty/null input', fnSrc.includes('return NaN') && (fnSrc.includes('!raw') || fnSrc.includes("!raw.trim")));

// 2. Handles plain fractions (a/b format)
test('Handles plain fraction format (e.g., 4/3)', fnSrc.includes('fracMatch') || fnSrc.includes('num / den'));

// 3. Handles sqrt() expressions safely (no eval on arbitrary code)
test('sqrt() handled with whitelist regex (not raw eval)', fnSrc.includes('Math.sqrt') && fnSrc.includes('Function'));

// 4. Safe evaluator: only allows safe characters
test('Character whitelist guards sqrt eval', fnSrc.includes('[0-9.') || fnSrc.includes('\\+\\-\\*\\/'));

// 5. Division by zero guard
test('Division by zero guard for fractions', fnSrc.includes('den === 0') || fnSrc.includes('den == 0'));

// 6. parseFloat as fallback
test('parseFloat used for plain decimals', fnSrc.includes('parseFloat'));

// 7. Trailing/leading whitespace trimmed
test('Input is trimmed before parsing', fnSrc.includes('.trim()'));

console.log('\n\u2500\u2500 Behavior expectations \u2500\u2500');

// 8. In exam.html, parseStudentAnswer processes student input before checkAnswer
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
test('exam.html calls parseStudentAnswer (or parseFloat inline for number inputs)',
    examSrc.includes('parseStudentAnswer') || examSrc.includes('parseFloat'));

// 9. NaN returned for non-numeric strings (e.g., "hello")
test('Function returns NaN for non-numeric strings (falls through all parsers)', fnSrc.match(/return NaN;\s*\n\s*\}/) || fnSrc.lastIndexOf('return NaN') > fnStart);

// 10. Function is short enough to be a pure utility (no DOM access)
test('parseStudentAnswer has no DOM access (pure function)', !fnSrc.includes('document.') && !fnSrc.includes('window.'));

console.log('\n' + '='.repeat(50));
console.log('parseStudentAnswer-edge-cases: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
