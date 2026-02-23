// Question number sequence test
// All retake-practice-N.json questions must have sequential number fields 1..15

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-number-sequence.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var rpFiles = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) rpFiles.push({ file: 'retake-practice-' + i + '.json', data: JSON.parse(fs.readFileSync(f, 'utf-8')) });
}

console.log('\u2500\u2500 Question number field sequence checks \u2500\u2500\n');

test('All 11 RP files loaded', rpFiles.length === 11);

var allSequential = true;
var missingNumber = true;
var violations = [];

rpFiles.forEach(function(rp) {
    var qs = rp.data.questions || [];
    qs.forEach(function(q, idx) {
        if (q.number === undefined && q.num === undefined) {
            // number field optional -- skip if not present
        } else {
            var num = q.number !== undefined ? q.number : q.num;
            if (num !== idx + 1) {
                violations.push(rp.file + ' idx=' + idx + ' expected number=' + (idx+1) + ' got ' + num);
                allSequential = false;
            }
        }
    });
    // Check IDs are sequential (rp{N}-q{N})
    qs.forEach(function(q, idx) {
        var expectedSuffix = '-q' + (idx + 1);
        if (q.id && !q.id.endsWith(expectedSuffix)) {
            violations.push(rp.file + ' idx=' + idx + ' id=' + q.id + ' expected to end with ' + expectedSuffix);
            allSequential = false;
        }
    });
});

if (violations.length) {
    violations.slice(0, 5).forEach(function(v) { console.log('    ' + v); });
}
test('All question IDs follow sequential rp{N}-q{1..15} pattern', allSequential);

// All 11 files have exactly 15 questions
var allFifteen = rpFiles.every(function(rp) { return (rp.data.questions || []).length === 15; });
test('All 11 RP files have exactly 15 questions (sequence is complete)', allFifteen);

console.log('\n' + '='.repeat(50));
console.log('rp-question-number-sequence: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
