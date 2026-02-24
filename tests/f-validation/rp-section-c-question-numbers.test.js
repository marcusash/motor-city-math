// rp-section-c-question-numbers test
// Section C questions should be numbered 12-13 (after A=1-3, B=4-11)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-c-question-numbers.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionC = (rp.questions || []).filter(function(q) { return q.section === 'C'; });
    var nums = sectionC.map(function(q) { return q.number; }).sort(function(a, b) { return a - b; });
    if (nums.length > 0 && nums[0] !== 12) {
        violations.push('retake-practice-' + i + ': section C starts at q' + nums[0] + ' (expected q12)');
    }
}

test('Section C starts at question 12 across all exams (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-c-question-numbers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
