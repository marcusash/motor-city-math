// rp-tolerance-values-reasonable test
// Tolerance fields in RP exam inputs should be reasonable (0.01 to 1.0)
// Tolerance < 0.001 is too strict; tolerance > 5 is too lenient

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-tolerance-values-reasonable.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooStrict = [], tooLenient = [], withTolerance = 0;
var MIN_TOL = 0.001, MAX_TOL = 5.0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.tolerance === undefined || inp.tolerance === null) return;
            withTolerance++;
            var tol = parseFloat(inp.tolerance);
            if (tol < MIN_TOL) tooStrict.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': tol=' + tol);
            if (tol > MAX_TOL) tooLenient.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': tol=' + tol);
        });
    });
}

console.log('\u2500\u2500 Tolerance value checks \u2500\u2500\n');
console.log('  Inputs with tolerance: ' + withTolerance);
if (tooStrict.length) tooStrict.forEach(function(v) { console.log('  ! Too strict: ' + v); });
if (tooLenient.length) tooLenient.forEach(function(v) { console.log('  ! Too lenient: ' + v); });

test('Tolerance values checked: ' + withTolerance, withTolerance >= 1);
test('All tolerance values reasonable (0.001-5.0)', tooStrict.length === 0 && tooLenient.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-tolerance-values-reasonable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
