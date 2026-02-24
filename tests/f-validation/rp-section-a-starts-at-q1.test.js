// rp-section-a-starts-at-q1 test
// Section A must start at question 1 (it is always the first section)
// If A starts elsewhere, the section ordering is broken

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-a-starts-at-q1.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionA = (rp.questions || []).filter(function(q) { return q.section === 'A'; });
    var nums = sectionA.map(function(q) { return q.number; }).sort(function(a, b) { return a - b; });
    if (nums.length > 0 && nums[0] !== 1) {
        violations.push('retake-practice-' + i + ': section A starts at q' + nums[0] + ' (expected q1)');
    }
}

test('Section A starts at question 1 across all exams (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-a-starts-at-q1: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
