// rp-inputs-parseable-number test
// For numeric inputs, the answer must be parseable as a float
// Answers like "undefined", "null", "NaN", or "" will cause grading failures

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-numeric-answers-parseable.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var totalNumeric = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'number') return;
            totalNumeric++;
            var ans = inp.answer;
            if (ans === undefined || ans === null) {
                violations.push('rp' + i + ' ' + q.id + ' input ' + inp.id + ': answer is ' + ans);
                return;
            }
            var parsed = parseFloat(String(ans));
            if (isNaN(parsed)) {
                violations.push('rp' + i + ' ' + q.id + ' input ' + inp.id + ': answer "' + ans + '" is not a number');
            }
        });
    });
}

console.log('\u2500\u2500 Numeric answer parseability \u2500\u2500\n');
console.log('  Numeric inputs checked: ' + totalNumeric);

test('All numeric inputs have parseable float answers', violations.length === 0);
if (violations.length) violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
test('At least 50 numeric inputs exist across all exams', totalNumeric >= 50);

console.log('\n' + '='.repeat(50));
console.log('rp-numeric-answers-parseable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
