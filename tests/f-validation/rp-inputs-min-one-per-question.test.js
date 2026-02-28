// rp-inputs-min-one-per-question test
// Every question in RP exams must have at least 1 input
// Questions without inputs cannot be graded or interacted with

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-inputs-min-one-per-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noInputs = [], totalQ = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var inputs = q.inputs || [];
        if (!Array.isArray(inputs) || inputs.length === 0) {
            noInputs.push('rp' + i + ' ' + q.id + ' (section ' + q.section + '): 0 inputs');
        }
    });
}

console.log('\u2500\u2500 Inputs per question checks \u2500\u2500\n');
if (noInputs.length) noInputs.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + totalQ + ' questions have at least 1 input', noInputs.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-inputs-min-one-per-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
