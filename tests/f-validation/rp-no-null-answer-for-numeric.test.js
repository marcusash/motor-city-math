// rp-no-null-answer-for-numeric test
// Numeric inputs (type=number) must have a non-null answer field
// A null answer makes auto-grading impossible

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-null-answer-for-numeric.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var OPEN_ENDED_IDS = ['q1_factored','q3_cases'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'number') {
                var isOpenEnded = OPEN_ENDED_IDS.indexOf(inp.id) !== -1;
                if (!isOpenEnded && (inp.answer === null || inp.answer === undefined)) {
                    violations.push(q.id + '/' + inp.id + ': type=number with null answer');
                }
            }
        });
    });
}

test('All numeric inputs have non-null answers (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-null-answer-for-numeric: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
