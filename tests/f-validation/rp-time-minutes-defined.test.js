// rp-time-minutes-defined test
// Each RP exam JSON must specify time_minutes (exam duration)
// Missing time_minutes causes NaN:NaN timer bug -- Kai sees broken countdown

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-time-minutes-defined.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], invalid = [], found = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var tm = rp.time_minutes;
    found.push('rp' + i + ': time_minutes=' + tm);
    if (tm === undefined || tm === null) {
        missing.push('rp' + i + ': time_minutes missing');
    } else if (typeof tm !== 'number' || tm < 10 || tm > 120) {
        invalid.push('rp' + i + ': time_minutes=' + tm + ' (expected 10-120 minutes)');
    }
}

console.log('\u2500\u2500 Time minutes checks \u2500\u2500\n');
found.forEach(function(v) { console.log('  ' + v); });
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });
if (invalid.length) invalid.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 RP exams have valid time_minutes (10-120)', missing.length === 0 && invalid.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-time-minutes-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
