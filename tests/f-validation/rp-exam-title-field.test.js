// RP exam title field test
// Each RP exam must have a non-empty title field
// Title appears in exam picker and browser tab

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-title-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], blank = [], tooLong = [], examsChecked = 0;
var MAX_CHARS = 80;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (!rp.title || typeof rp.title !== 'string') {
        missing.push('rp' + i);
    } else if (rp.title.trim() === '') {
        blank.push('rp' + i);
    } else if (rp.title.length > MAX_CHARS) {
        tooLong.push('rp' + i + ': ' + rp.title.length + ' chars');
    }
}

console.log('\u2500\u2500 Exam title field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missing.length) console.log('  ! Missing title: ' + missing.join(', '));
if (blank.length) console.log('  ! Blank title: ' + blank.join(', '));
if (tooLong.length) console.log('  ! Too long: ' + tooLong.join(', '));

test('All exams have non-blank title field', missing.length === 0 && blank.length === 0);
test('All titles <= ' + MAX_CHARS + ' chars (picker display)', tooLong.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-title-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
