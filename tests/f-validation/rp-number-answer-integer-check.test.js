// rp-number-answer-integer-check test
// Number inputs with integer answers should not have unnecessary decimals
// "3.0" and "3" are both correct -- verify consistency of clean integers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-number-answer-integer-check.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var unnecessaryDecimals = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'number') return;
            if (inp.answer === undefined) return;
            var ans = parseFloat(inp.answer);
            if (!isNaN(ans) && Number.isInteger(ans)) {
                var asStr = String(inp.answer);
                // Flag "3.0" or "3.00" -- these are integer values with unnecessary decimals
                if (asStr.includes('.') && !asStr.match(/\.[1-9]/)) {
                    unnecessaryDecimals.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': answer=' + asStr);
                }
            }
        });
    });
}

console.log('\u2500\u2500 Integer answer format checks \u2500\u2500\n');
if (unnecessaryDecimals.length) unnecessaryDecimals.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('No unnecessary ".0" decimals on integer answers (' + unnecessaryDecimals.length + ' found)', unnecessaryDecimals.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-number-answer-integer-check: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
