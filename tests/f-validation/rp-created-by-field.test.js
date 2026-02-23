// RP exam created_by field test
// All RP exams must have created_by field (attribution, not blank)
// Tracks authorship: who generated/authored this exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-created-by-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], blank = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (!rp.created_by && rp.created_by !== 0) {
        missing.push('rp' + i);
    } else if (typeof rp.created_by === 'string' && rp.created_by.trim() === '') {
        blank.push('rp' + i);
    }
}

console.log('\u2500\u2500 Created-by field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missing.length) console.log('  ! Missing created_by: ' + missing.join(', '));
if (blank.length) console.log('  ! Blank created_by: ' + blank.join(', '));

test('All exams have created_by field', missing.length === 0);
test('No blank created_by fields', blank.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-created-by-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
