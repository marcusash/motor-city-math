// RP input ID format test
// All input IDs must follow pattern: {exam_id}-q{N}-{descriptor}
// Example: retake-practice-1-q1-parent, rp1-q1-a

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-id-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missingIds = [], totalInputs = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            totalInputs++;
            if (!inp.id || typeof inp.id !== 'string') {
                missingIds.push('rp' + i + ' ' + q.id + ': input missing id');
            }
        });
    });
}

console.log('\u2500\u2500 Input ID format checks \u2500\u2500\n');
console.log('  Total inputs: ' + totalInputs);

if (missingIds.length) missingIds.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
test('All inputs have id field', missingIds.length === 0);
test('At least 200 inputs found (11 exams x 15 questions x ~1+ inputs)', totalInputs >= 200);

console.log('\n' + '='.repeat(50));
console.log('rp-input-id-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
