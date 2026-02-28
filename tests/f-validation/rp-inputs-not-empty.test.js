// RP inputs array count test
// Each question must have at least 1 input defined
// Zero inputs means the question can't be answered

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-inputs-not-empty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noInputs = [], emptyInputs = [], totalChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalChecked++;
        if (!q.inputs) {
            noInputs.push('rp' + i + ' ' + q.id);
        } else if (!Array.isArray(q.inputs) || q.inputs.length === 0) {
            emptyInputs.push('rp' + i + ' ' + q.id);
        }
    });
}

console.log('\u2500\u2500 Inputs array checks \u2500\u2500\n');
console.log('  Questions checked: ' + totalChecked);

if (noInputs.length) console.log('  ! No inputs field: ' + noInputs.slice(0,5).join(', '));
if (emptyInputs.length) console.log('  ! Empty inputs array: ' + emptyInputs.slice(0,5).join(', '));

test('All questions have an inputs field', noInputs.length === 0);
test('All questions have at least 1 input in inputs[]', emptyInputs.length === 0);
test('At least 165 questions found', totalChecked >= 165);

console.log('\n' + '='.repeat(50));
console.log('rp-inputs-not-empty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
