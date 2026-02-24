// rp-number-field-type test
// The 'number' field in RP exam questions must be a numeric integer
// String numbers ("1" instead of 1) cause question ordering bugs

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-number-field-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var invalid = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        var n = q.number;
        if (n === undefined || n === null) {
            invalid.push('rp' + i + ' ' + q.id + ': missing number field');
        } else if (typeof n !== 'number' || !Number.isInteger(n) || n < 1) {
            invalid.push('rp' + i + ' ' + q.id + ': number=' + JSON.stringify(n) + ' (expected positive integer)');
        }
    });
}

console.log('\u2500\u2500 Number field type checks \u2500\u2500\n');
if (invalid.length) invalid.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have valid numeric number field', invalid.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-number-field-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
