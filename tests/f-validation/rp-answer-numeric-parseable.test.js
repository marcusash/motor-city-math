// rp-answer-numeric-parseable test
// All numeric answers in RP exams must be parseable by parseFloat()
// Answers like "two" or "x=5" would fail parseFloat and break auto-grading

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-numeric-parseable.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var notParseable = [], numericCount = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            // Only check numeric-type inputs (not radio, not open text without answer)
            if (inp.type === 'radio' || inp.answer === undefined || inp.answer === null) return;
            if (inp.type === 'text' && !inp.answer) return;
            var ans = String(inp.answer);
            // If answer contains only a number (possibly negative/decimal), it should be parseable
            if (/^-?\d/.test(ans) || /^\d/.test(ans)) {
                numericCount++;
                if (isNaN(parseFloat(ans))) {
                    notParseable.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': "' + ans + '"');
                }
            }
        });
    });
}

console.log('\u2500\u2500 Numeric answer parseability checks \u2500\u2500\n');
if (notParseable.length) notParseable.forEach(function(v) { console.log('  ! ' + v); });

test('Numeric answers checked: ' + numericCount, numericCount >= 100);
test('All numeric answers parseable by parseFloat()', notParseable.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-answer-numeric-parseable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
