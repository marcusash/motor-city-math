// rp-question-number-field test
// Every question must have a 'number' field (integer)
// Missing number breaks the tracker display and progress counting

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-number-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        checked++;
        if (q.number === undefined || q.number === null) {
            violations.push('rp' + i + ' ' + q.id + ': missing number field');
        } else if (!Number.isInteger(q.number) || q.number < 1) {
            violations.push('rp' + i + ' ' + q.id + ': invalid number=' + q.number + ' (must be positive integer)');
        }
    });
}

console.log('\u2500\u2500 Question number field checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Questions checked: ' + checked);

test('All questions have valid number field (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-number-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
