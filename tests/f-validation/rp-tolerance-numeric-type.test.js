// rp-tolerance-numeric-type test
// tolerance fields in RP JSON inputs must be numeric (not string)
// String tolerance ("0.5") would fail equality check in grading code

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-tolerance-numeric-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var stringTolerance = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!('tolerance' in inp)) return;
            total++;
            if (typeof inp.tolerance !== 'number') {
                stringTolerance.push('rp' + i + ' ' + q.id + '.' + inp.id + ': tolerance=' + JSON.stringify(inp.tolerance) + ' (type=' + typeof inp.tolerance + ')');
            }
        });
    });
}

console.log('\u2500\u2500 Tolerance type checks \u2500\u2500\n');
if (stringTolerance.length) stringTolerance.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' tolerance values are numeric type', stringTolerance.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-tolerance-numeric-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
