// rp-exam-time-minutes-nonzero test
// time_minutes must be a positive integer (> 0), not zero or negative
// Exam with 0 minutes would display a broken timer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-time-minutes-nonzero.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

console.log('\u2500\u2500 time_minutes positive integer checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var t = rp.time_minutes;
    if (t === undefined || t === null || t <= 0 || !Number.isInteger(t)) {
        violations.push('retake-practice-' + i + ': time_minutes=' + t);
    }
}

if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('All exams have time_minutes as positive integer (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-time-minutes-nonzero: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
