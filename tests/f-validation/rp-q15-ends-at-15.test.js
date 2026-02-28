// rp-q15-ends-at-15 test
// The last question in every exam must have number 15 (15-question format)
// Fewer or more questions breaks the grading percentage (out of 15)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-q15-ends-at-15.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var nums = (rp.questions || []).map(function(q) { return q.number; });
    var maxNum = Math.max.apply(null, nums);
    if (maxNum !== 15) {
        violations.push('retake-practice-' + i + ': last question is #' + maxNum + ' (expected #15)');
    }
}

test('All exams end at question 15 (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-q15-ends-at-15: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
