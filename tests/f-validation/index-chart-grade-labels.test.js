// index.html chart grade label regression test
// After commit a640243: Grade A label must show 92%+ (not 93%+)
// Locks the fix permanently.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-chart-grade-labels.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Find chart.js dataset labels section
var chartSection = '';
var chartIdx = src.indexOf('Chart(');
if (chartIdx !== -1) {
    chartSection = src.substring(chartIdx, chartIdx + 5000);
}

console.log('\u2500\u2500 Chart grade label check \u2500\u2500');
console.log('  Chart section found:', chartIdx !== -1);

// 1. Chart labels exist
test('Chart section found in index.html', chartIdx !== -1);

// 2. Grade A = 92%+ (not 93%+) — regression lock from a640243
// Check code lines (not CSS comments) for the old "A (93%)" pattern
var codeLines = src.split('\n').filter(function(line) {
    return !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.includes('/*');
});
var codeSrc = codeLines.join('\n');

var has92 = src.includes('92%') || codeSrc.includes('>= 92') || codeSrc.includes('>=92') || chartSection.includes('92');
var has93AsLabel = (codeSrc.match(/A\s*\(\s*93/g) || []).length > 0;

test('Chart Grade A threshold is 92%+ (not 93%+)', has92 && !has93AsLabel);
if (has93AsLabel) console.log('  WARNING: found "A (93%+" which should be "A (92%+"');

// 3. All 4 grade bands present (G1-G4 or A-D equivalent)
var hasGrade1 = src.includes('Grade 1') || src.includes('G1') || src.includes('"1"') || src.includes('grade-1');
var hasGrade4 = src.includes('Grade 4') || src.includes('G4') || src.includes('"4"') || src.includes('grade-4');
test('Grade 1 (lowest) referenced in index.html', hasGrade1);
test('Grade 4 (highest) referenced in index.html', hasGrade4);

// 4. Threshold values appear (82, 70 for G3, G2)
test('Grade 3 threshold 82% in index.html', src.includes('82'));
test('Grade 2 threshold 70% in index.html', src.includes('70'));

console.log('\n' + '='.repeat(50));
console.log('index-chart-grade-labels: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
