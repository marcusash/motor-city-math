// rp-section-b-question-numbers test
// Section B questions should be numbered sequentially after Section A (4-11)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-question-numbers.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionBQs = (rp.questions || []).filter(function(q) { return q.section === 'B'; });
    var nums = sectionBQs.map(function(q) { return q.number; }).sort(function(a, b) { return a - b; });
    // Section B should start at 4 (after 3 section A questions)
    if (nums.length > 0 && nums[0] !== 4) {
        violations.push('retake-practice-' + i + ': section B starts at q' + nums[0] + ' (expected q4)');
    }
}

test('Section B starts at question 4 across all exams (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-question-numbers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
