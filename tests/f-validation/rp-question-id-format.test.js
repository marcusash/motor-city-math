// rp-question-id-format test
// Question IDs must follow the pattern qN (e.g., q1, q2, q14, q15)
// Non-standard IDs break exam.html's grading and hint lookup logic

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-id-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var invalid = [], total = 0;
var Q_ID_RE = /^(rp\d+-)?q\d+$/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        if (!Q_ID_RE.test(q.id || '')) {
            invalid.push('rp' + i + ': q.id=' + JSON.stringify(q.id) + ' (expected qN format)');
        }
    });
}

console.log('\u2500\u2500 Question ID format checks \u2500\u2500\n');
if (invalid.length) invalid.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' question IDs match qN format', invalid.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-id-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
