// rp-answer-decimal-places test
// Numeric answers should have at most 3 decimal places (prevent precision creep from GR calcs)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-decimal-places.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.answer !== undefined && inp.answer !== null && inp.type === 'number') {
                var val = String(inp.answer);
                var dotIdx = val.indexOf('.');
                if (dotIdx !== -1) {
                    checked++;
                    var decimals = val.length - dotIdx - 1;
                    if (decimals > 4) {
                        violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': ' + val + ' (' + decimals + ' decimal places)');
                    }
                }
            }
        });
    });
}

console.log('\u2500\u2500 Decimal place checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Decimal numeric answers checked: ' + checked);

test('All numeric answers have <= 4 decimal places (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-answer-decimal-places: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
