// rp-inputs-have-answers test
// Every input in every RP exam must have a non-null, non-empty answer field
// Missing answer = exam.html can't grade that input, Kai gets wrong feedback

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-inputs-have-answers.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noAnswer = [], totalInputs = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            totalInputs++;
            var ans = inp.answer;
            // Open-ended text inputs (student shows work, no single expected answer) are OK
            if (inp.type === 'text' && (ans === undefined || ans === null)) return;
            var missing = ans === undefined || ans === null || String(ans).trim() === '';
            if (missing) {
                noAnswer.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': answer=' + JSON.stringify(ans));
            }
        });
    });
}

console.log('\u2500\u2500 Input answer presence checks \u2500\u2500\n');
if (noAnswer.length) noAnswer.forEach(function(v) { console.log('  ! ' + v); });

test('Total inputs checked: ' + totalInputs, totalInputs >= 200);
test('All inputs have non-empty answer field', noAnswer.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-inputs-have-answers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
