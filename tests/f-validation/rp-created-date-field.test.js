// RP exam created date field test
// All RP exams must have a created date in ISO 8601 format
// Tracks when exams were generated for auditing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-created-date-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], badFormat = [], examsChecked = 0;
// ISO 8601: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ
var DATE_REGEX = /^\d{4}-\d{2}-\d{2}/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (!rp.created) {
        missing.push('rp' + i);
    } else if (!DATE_REGEX.test(rp.created)) {
        badFormat.push('rp' + i + ': "' + rp.created + '" is not ISO 8601');
    }
}

console.log('\u2500\u2500 Created date field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missing.length) console.log('  ! Missing created: ' + missing.join(', '));
if (badFormat.length) badFormat.forEach(function(v) { console.log('  ! Bad format: ' + v); });

test('All exams have created date field', missing.length === 0);
test('All created dates match YYYY-MM-DD format', badFormat.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-created-date-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
