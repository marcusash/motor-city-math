// RP exam time_minutes field test
// All exams must have time_minutes as a positive number (15-120 typical range)
// Used to initialize the countdown timer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-time-minutes-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], badValues = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (typeof rp.time_minutes === 'undefined') {
        missing.push('rp' + i);
    } else {
        var val = rp.time_minutes;
        if (typeof val !== 'number' || val <= 0 || val > 180) {
            badValues.push('rp' + i + ': time_minutes = ' + JSON.stringify(val) + ' (expected 1-180)');
        }
    }
}

console.log('\u2500\u2500 Time minutes field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missing.length) console.log('  ! Missing time_minutes: ' + missing.join(', '));
if (badValues.length) badValues.forEach(function(v) { console.log('  ! ' + v); });

test('All exams have time_minutes field', missing.length === 0);
test('All time_minutes values are 1-180 minutes', badValues.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-time-minutes-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
