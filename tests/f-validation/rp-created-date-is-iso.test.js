// rp-created-date-is-iso test
// created field must be a valid ISO 8601 date string (YYYY-MM-DD)
// Non-standard dates cause sort/filter failures in the dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-created-date-is-iso.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (!rp.created || !ISO_DATE.test(rp.created)) {
        violations.push('retake-practice-' + i + ': created="' + rp.created + '" (expected YYYY-MM-DD)');
    }
}

test('All exams have ISO 8601 created date (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-created-date-is-iso: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
