// rp-no-trailing-whitespace-in-answers test
// Input answer fields should not have leading/trailing whitespace
// Trimming is done in grader but clean data is preferred

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-trailing-whitespace-in-answers.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.answer === undefined || inp.answer === null) return;
            var ans = String(inp.answer);
            if (ans !== ans.trim()) {
                violations.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': answer has whitespace "' + JSON.stringify(ans) + '"');
            }
        });
    });
}

console.log('\u2500\u2500 Answer whitespace checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('No answer fields have leading/trailing whitespace (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-trailing-whitespace-in-answers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
