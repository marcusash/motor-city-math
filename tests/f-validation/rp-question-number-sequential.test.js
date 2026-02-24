// rp-question-number-sequential test
// Question numbers 1-15 must appear exactly once per exam (no gaps, no repeats)
// Gaps confuse Kai's sense of progress; duplicates cause grading overwrite

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-number-sequential.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Sequential question number checks \u2500\u2500\n');

var allGood = true;
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var nums = (rp.questions || []).map(function(q) { return q.number; }).sort(function(a, b) { return a - b; });
    var expected = Array.from({length: nums.length}, function(_, k) { return k + 1; });
    var ok = JSON.stringify(nums) === JSON.stringify(expected);
    if (!ok) {
        console.log('  ! rp' + i + ': expected [1..15], got ' + JSON.stringify(nums));
        allGood = false;
    }
    test('rp' + i + ': question numbers sequential 1-' + nums.length, ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-question-number-sequential: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
