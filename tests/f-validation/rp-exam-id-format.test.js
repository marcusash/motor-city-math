// RP exam ID format test
// Each exam must have a valid id field (non-empty string)
// Exam ID is used as URL parameter and localStorage key

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-id-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var badIds = [], examsChecked = 0;
// Valid: alphanumeric + hyphens, starts with letter
var VALID_ID = /^[a-z][a-z0-9-]+$/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (!rp.exam_id || typeof rp.exam_id !== 'string') {
        badIds.push('rp' + i + ': missing or invalid exam_id field');
    } else if (!VALID_ID.test(rp.exam_id)) {
        badIds.push('rp' + i + ': exam_id "' + rp.exam_id + '" does not match pattern [a-z][a-z0-9-]+');
    }
}

console.log('\u2500\u2500 Exam ID format checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (badIds.length) badIds.forEach(function(v) { console.log('  ! ' + v); });

test('All exams have valid exam_id field (a-z0-9 hyphen, starts with letter)', badIds.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-id-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
