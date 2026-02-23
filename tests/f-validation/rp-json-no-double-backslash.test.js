// rp-json-no-double-backslash test
// Backslashes in KaTeX LaTeX strings must be properly escaped for JSON
// A common bug: \\frac in JSON source = \frac in JS = valid LaTeX
// But \\\\frac in JSON = \\frac in JS = BROKEN (renders as \\frac literal text)
// This test catches quadruple-backslash (\\\\) which renders broken KaTeX

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-json-no-double-backslash.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    // Read raw JSON file content (before JSON.parse)
    var raw = fs.readFileSync(f, 'utf-8');
    // In raw JSON, \\\\frac means the value will be \\frac (broken LaTeX)
    // We look for 4+ backslashes before a LaTeX command
    if (/\\\\\\\\[a-zA-Z]/.test(raw)) {
        violations.push('RP' + i + ': quadruple-backslash detected (broken KaTeX)');
    }
}

console.log('\u2500\u2500 JSON backslash format checks \u2500\u2500\n');
console.log('  Files checked: 11');

test('No quadruple-backslash (\\\\\\\\) in any RP JSON (would break KaTeX rendering)', violations.length === 0);

if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

// Also check that LaTeX-style commands exist (\\frac, \\sqrt etc) - confirms questions use KaTeX
var latexCount = 0;
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var raw = fs.readFileSync(f, 'utf-8');
    if (/\\\\(frac|sqrt|pm|cdot|times|left|right)/.test(raw)) latexCount++;
}
test('At least 1 RP exam uses KaTeX LaTeX commands (\\\\frac, \\\\sqrt etc)', latexCount >= 1);

console.log('\n' + '='.repeat(50));
console.log('rp-json-no-double-backslash: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
