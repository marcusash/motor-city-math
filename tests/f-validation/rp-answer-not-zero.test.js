// rp-answer-not-zero test
// Correct answers for numeric inputs should not be zero (suspicious data)
// Zero answers are usually an unset placeholder, not a real math answer in this context

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-not-zero.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var zeroAnswers = [], totalChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'number' || inp.type === 'numeric') {
                totalChecked++;
                // 0 is suspicious in algebra -- usually a placeholder
                // Note: some valid answers could be 0 (x-intercept at origin etc.)
                // We flag but don't fail -- report as INFO
                if (inp.answer === 0) {
                    zeroAnswers.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': answer=0 (verify)');
                }
            }
        });
    });
}

console.log('\u2500\u2500 Zero answer checks \u2500\u2500\n');
if (zeroAnswers.length) {
    console.log('  INFO: ' + zeroAnswers.length + ' zero-answer numeric inputs (may be valid):');
    zeroAnswers.slice(0, 5).forEach(function(v) { console.log('    ' + v); });
    if (zeroAnswers.length > 5) console.log('    ... and ' + (zeroAnswers.length - 5) + ' more');
    console.log('');
}

test('Numeric inputs checked: ' + totalChecked, totalChecked > 0);
// Allow up to 10 zero answers (real math sometimes has 0 as answer)
test('Suspicious zero-answer count reasonable (<=10)', zeroAnswers.length <= 10);

console.log('\n' + '='.repeat(50));
console.log('rp-answer-not-zero: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
