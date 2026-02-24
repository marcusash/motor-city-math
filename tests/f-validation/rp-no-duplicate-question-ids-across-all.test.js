// rp-no-duplicate-question-ids-across-all test
// Question IDs must be globally unique across ALL 11 exams
// Each ID encodes the exam number so this should be inherent, but verify

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-duplicate-question-ids-across-all.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var seen = {};
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (seen[q.id]) {
            violations.push(q.id + ' appears in both rp' + seen[q.id] + ' and rp' + i);
        } else {
            seen[q.id] = i;
        }
    });
}

test('Question IDs are globally unique across all 11 exams (' + violations.length + ' collisions)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-duplicate-question-ids-across-all: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
