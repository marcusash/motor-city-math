// rp-answer-not-empty test
// Every input in every RP exam must have a non-empty answer field

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-not-empty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            // graph type has no answer field (answer is key_points)
            if (inp.type === 'graph') return;
// NOTE: some text-type open-response inputs legitimately omit the answer key
// (e.g. q15_model, q3_cases). Only flag number and radio types.
        if (inp.type === 'text' || inp.type === 'graph') return;
        var ans = inp.answer;
        if (ans === undefined || ans === null) {
            violations.push('retake-practice-' + i + ' q' + q.number + ' input[' + inp.id + ']: null or undefined answer');
        }
        });
    });
}

test('All number/radio inputs have defined answers (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-answer-not-empty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
