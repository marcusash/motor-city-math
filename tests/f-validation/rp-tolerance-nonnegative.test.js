// rp-tolerance-nonnegative test
// Tolerance values in inputs must be >= 0
// Negative tolerances are nonsensical and would cause grading to always fail

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-tolerance-nonnegative.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var negTol = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.tolerance !== undefined && inp.tolerance < 0) {
                negTol.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': tolerance=' + inp.tolerance + ' (negative)');
            }
        });
    });
}

console.log('\u2500\u2500 Tolerance non-negative checks \u2500\u2500\n');
if (negTol.length) negTol.forEach(function(v) { console.log('  ! ' + v); });

test('All tolerance values are >= 0 (' + negTol.length + ' violations)', negTol.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-tolerance-nonnegative: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
