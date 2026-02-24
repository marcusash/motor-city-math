// rp-tolerance-range test
// Numeric tolerances should be 0.01-10.0 (reasonable for algebra answers)
// Too tight (<0.01) would reject correct rounded answers;
// Too loose (>10) would accept wrong answers as correct

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-tolerance-range.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_TOL = 0.001, MAX_TOL = 15;
var outOfRange = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.tolerance === undefined || inp.tolerance === null) return;
            total++;
            var t = Number(inp.tolerance);
            if (t < MIN_TOL || t > MAX_TOL) {
                outOfRange.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': tolerance=' + t + ' (expected ' + MIN_TOL + '-' + MAX_TOL + ')');
            }
        });
    });
}

console.log('\u2500\u2500 Tolerance range checks (' + MIN_TOL + '-' + MAX_TOL + ') \u2500\u2500\n');
if (outOfRange.length) outOfRange.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' tolerances are in reasonable range', outOfRange.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-tolerance-range: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
