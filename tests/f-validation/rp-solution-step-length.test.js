// rp-solution-step-length test
// Each solution step should be concise (ADHD: max ~25 words per step)
// Long monolithic steps defeat the purpose of the step-by-step approach

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-step-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooLong = [], totalSteps = 0;
var MAX_WORDS = 30;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step, idx) {
            totalSteps++;
            var words = step.trim().split(/\s+/).length;
            if (words > MAX_WORDS) {
                tooLong.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: ' + words + ' words');
            }
        });
    });
}

console.log('\u2500\u2500 Solution step length checks \u2500\u2500\n');
if (tooLong.length) {
    tooLong.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
    if (tooLong.length > 5) console.log('  ... and ' + (tooLong.length - 5) + ' more');
}

test('Solution steps checked: ' + totalSteps, totalSteps >= 400);
test('All solution steps <=30 words (concise per ADHD rule)', tooLong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-step-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
