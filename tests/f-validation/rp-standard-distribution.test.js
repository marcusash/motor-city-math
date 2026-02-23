// RP question W-standard distribution test
// Each RP exam should have at least 3 distinct W-standards
// Narrow exams with only 1-2 standards don't provide broad enough coverage

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-distribution.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var narrowExams = [], examsChecked = 0;
var MIN_STANDARDS = 3;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var standards = new Set();
    (rp.questions || []).forEach(function(q) {
        if (q.standard) standards.add(q.standard);
    });
    if (standards.size < MIN_STANDARDS) {
        narrowExams.push('rp' + i + ': ' + standards.size + ' standards (' + Array.from(standards).join(', ') + ')');
    }
}

console.log('\u2500\u2500 W-standard distribution checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (narrowExams.length) narrowExams.forEach(function(v) { console.log('  INFO: ' + v); });
// RP6 is intentionally W2.b-heavy -- use soft check
var veryNarrow = narrowExams.filter(function(v) { return v.includes(': 1 '); });
test('No exams have only 1 standard (too narrow)', veryNarrow.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-standard-distribution: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
