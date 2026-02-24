// rp-tolerance-per-input test
// Number inputs that expect decimals should have a tolerance >= 0.01

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-tolerance-per-input.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'number') return;
            if (inp.tolerance === undefined || inp.tolerance === null) return;
            total++;
            var tol = parseFloat(inp.tolerance);
            if (tol < 0) {
                violations.push('rp' + i + ' ' + q.id + '/' + inp.id + ': tolerance=' + inp.tolerance + ' (negative)');
            }
        });
    });
}

console.log('\u2500\u2500 Per-input tolerance checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Inputs with tolerance checked: ' + total);

test('All per-input tolerances are non-negative (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-tolerance-per-input: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
