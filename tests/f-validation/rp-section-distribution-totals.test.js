// rp-section-distribution-totals test
// All 11 RP exams: Section totals must add up to 15 (3+8+2+2)
// Distribution: A=3, B=8, C=2, D=2

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-distribution-totals.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var EXPECTED = { A: 3, B: 8, C: 2, D: 2 };

console.log('\u2500\u2500 Section distribution checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var counts = { A: 0, B: 0, C: 0, D: 0 };
    (rp.questions || []).forEach(function(q) { if (counts[q.section] !== undefined) counts[q.section]++; });
    
    var matches = Object.keys(EXPECTED).every(function(s) { return counts[s] === EXPECTED[s]; });
    if (!matches) {
        var actual = Object.keys(counts).map(function(s) { return s + '=' + counts[s]; }).join(', ');
        var expected = Object.keys(EXPECTED).map(function(s) { return s + '=' + EXPECTED[s]; }).join(', ');
        console.log('  ! rp' + i + ': [' + actual + '] expected [' + expected + ']');
    }
    test('rp' + i + ': A=3, B=8, C=2, D=2', matches);
}

console.log('\n' + '='.repeat(50));
console.log('rp-section-distribution-totals: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
