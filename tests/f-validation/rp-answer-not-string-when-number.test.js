// rp-answer-not-string-when-number test
// Inputs with type='number' should have answer as a JavaScript number, not a string
// String answers break parseFloat comparison in the grader

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-not-string-when-number.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'number' || inp.answer === undefined || inp.answer === null) return;
            checked++;
            if (typeof inp.answer === 'string') {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': answer is string "' + inp.answer + '" (should be number)');
            }
        });
    });
}

console.log('\u2500\u2500 Number input answer type checks \u2500\u2500\n');
if (violations.length) violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
if (violations.length > 5) console.log('  ... and ' + (violations.length - 5) + ' more');
console.log('  Number inputs with answer checked: ' + checked);

test('All number-type inputs have numeric (not string) answers (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-answer-not-string-when-number: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
