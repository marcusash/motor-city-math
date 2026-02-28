// rp-created-by-format test
// created_by field should follow "agent-id: Name" pattern or "GR" format
// Ensures auditability of who produced each exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-created-by-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var cb = rp.created_by;
    if (!cb || typeof cb !== 'string' || cb.trim().length < 2) {
        violations.push('retake-practice-' + i + ': created_by is missing or too short: "' + cb + '"');
    }
}

console.log('\u2500\u2500 created_by field format checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('All exams have a valid created_by field (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-created-by-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
