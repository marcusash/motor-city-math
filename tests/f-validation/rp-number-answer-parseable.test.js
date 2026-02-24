// rp-number-answer-parseable test
// All numeric answer values must be parseable as numbers (parseFloat != NaN)
// String answers that should be numbers fail silent comparison in the grader

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-number-answer-parseable.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'number') return;
            if (inp.answer === undefined || inp.answer === null) return;
            total++;
            var parsed = parseFloat(String(inp.answer));
            if (isNaN(parsed)) {
                bad.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': answer="' + inp.answer + '" not numeric');
            }
        });
    });
}

console.log('\u2500\u2500 Numeric answer parseability checks \u2500\u2500\n');
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' number-type answers parse as float', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-number-answer-parseable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
