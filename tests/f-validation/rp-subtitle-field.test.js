// RP exam subtitle field test
// Each RP exam should have a subtitle field (used in exam picker and header)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-subtitle-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], blank = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (typeof rp.subtitle === 'undefined') {
        missing.push('rp' + i);
    } else if (typeof rp.subtitle === 'string' && rp.subtitle.trim() === '') {
        blank.push('rp' + i);
    }
}

console.log('\u2500\u2500 Subtitle field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missing.length) console.log('  ! Missing subtitle: ' + missing.join(', '));
if (blank.length) console.log('  ! Blank subtitle: ' + blank.join(', '));

test('All exams have subtitle field', missing.length === 0);
test('No blank subtitle fields', blank.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-subtitle-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
