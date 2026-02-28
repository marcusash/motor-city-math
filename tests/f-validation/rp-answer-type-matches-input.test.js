// rp-answer-type-matches-input test
// The answer field type must be compatible with the input type
// dropdown/radio: answer should be string; number/numeric: answer should be number

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-type-matches-input.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var mismatches = [], totalChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            totalChecked++;
            var t = inp.type;
            var a = inp.answer;
            if (t === 'number' || t === 'numeric') {
                if (typeof a !== 'number') {
                    mismatches.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': type=number but answer=' + JSON.stringify(a));
                }
            } else if (t === 'dropdown' || t === 'radio' || t === 'multiple-choice') {
                if (typeof a !== 'string') {
                    mismatches.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': type=' + t + ' but answer=' + JSON.stringify(a));
                }
            }
        });
    });
}

console.log('\u2500\u2500 Answer type compatibility checks \u2500\u2500\n');
if (mismatches.length) mismatches.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('Inputs checked: ' + totalChecked, totalChecked >= 300);
test('All answer types match input types', mismatches.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-answer-type-matches-input: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
