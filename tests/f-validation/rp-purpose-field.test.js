// RP exam purpose field test
// Each RP exam should have a purpose field (one-sentence description)
// Purpose field drives context in exam picker and coach feedback

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-purpose-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], blank = [], tooLong = [], examsChecked = 0;
var MAX_WORDS = 60; // purpose can be multi-sentence with details

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (typeof rp.purpose === 'undefined') {
        missing.push('rp' + i);
    } else if (typeof rp.purpose === 'string') {
        if (rp.purpose.trim() === '') {
            blank.push('rp' + i);
        } else {
            var wordCount = rp.purpose.trim().split(/\s+/).length;
            if (wordCount > MAX_WORDS) {
                tooLong.push('rp' + i + ': ' + wordCount + ' words');
            }
        }
    }
}

console.log('\u2500\u2500 Purpose field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missing.length) console.log('  ! Missing purpose: ' + missing.join(', '));
if (blank.length) console.log('  ! Blank purpose: ' + blank.join(', '));
if (tooLong.length) console.log('  ! Too long: ' + tooLong.join(', '));

test('All exams have purpose field', missing.length === 0);
test('No blank or too-long purpose fields', blank.length === 0 && tooLong.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-purpose-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
