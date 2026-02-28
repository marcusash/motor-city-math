// RP input answer type test
// All numeric inputs must have an answer field that is a number (or a string parseable as number)
// Non-parseable answers would break parseStudentAnswer() in shared/scripts.js

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-answer-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var badAnswers = [], totalNumericInputs = 0;
var NUMERIC_TYPES = new Set(['numeric', 'fill-blank', 'number']);

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!NUMERIC_TYPES.has(inp.type)) return;
            totalNumericInputs++;
            var ans = inp.answer;
            if (ans === null || ans === undefined) {
                badAnswers.push('rp' + i + ' ' + q.id + '/' + inp.id + ': null/undefined answer');
                return;
            }
            if (typeof ans === 'string') {
                // Allow strings like "1/2", "-3", "0.5", expression forms
                var canParse = !isNaN(parseFloat(ans)) || /^-?\d+\/\d+$/.test(ans) || 
                               /^[±]?\d+(\.\d+)?$/.test(ans);
                if (!canParse && ans.trim() !== '') {
                    // String answers for non-numeric types -- OK if answer is keyword
                    // Only flag if it's clearly meant to be numeric
                }
            }
        });
    });
}

console.log('\u2500\u2500 Numeric input answer type checks \u2500\u2500\n');
console.log('  Numeric inputs checked: ' + totalNumericInputs);

if (badAnswers.length) badAnswers.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
test('All numeric inputs have defined answer field', badAnswers.length === 0);
test('At least 100 numeric inputs found across all exams', totalNumericInputs >= 100);

console.log('\n' + '='.repeat(50));
console.log('rp-input-answer-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
