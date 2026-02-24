// rp-created-date-format test
// created field must be in YYYY-MM-DD format (ISO 8601 date)
// Inconsistent dates make version tracking unreliable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-created-date-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    total++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (!rp.created) {
        bad.push('rp' + i + ': missing created field');
    } else if (!DATE_RE.test(rp.created)) {
        bad.push('rp' + i + ': created="' + rp.created + '" (must be YYYY-MM-DD)');
    }
}

console.log('\u2500\u2500 created date format checks (YYYY-MM-DD) \u2500\u2500\n');
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' RP exams have created in YYYY-MM-DD format', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-created-date-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
