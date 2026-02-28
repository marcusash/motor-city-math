// rp-exam-total-questions-field test
// RP exam top-level structure must be navigable -- questions array must exist and be an array
// Missing or non-array questions field causes exam renderer to crash on load

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-questions-array.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var invalid = [];

console.log('\u2500\u2500 Questions array checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var q = rp.questions;
    var isArray = Array.isArray(q);
    var hasLength = isArray && q.length > 0;
    console.log('  rp' + i + ': questions is ' + (isArray ? 'Array(' + q.length + ')' : typeof q) + (hasLength ? ' \u2705' : ' \u274c'));
    if (!isArray || !hasLength) {
        invalid.push('rp' + i + ': questions is not a non-empty array');
    }
}

test('All 11 RP exams have a non-empty questions array', invalid.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-questions-array: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
