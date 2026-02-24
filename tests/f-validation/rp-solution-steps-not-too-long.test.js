// rp-solution-steps-not-too-long test
// Individual solution steps must be readable -- max 250 chars each
// Walls of text in solution steps don't work for Kai's ADHD

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-not-too-long.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MAX_STEP_LEN = 250;
var tooLong = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step, idx) {
            total++;
            if (typeof step === 'string' && step.length > MAX_STEP_LEN) {
                tooLong.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: ' + step.length + ' chars (max ' + MAX_STEP_LEN + ')');
            }
        });
    });
}

console.log('\u2500\u2500 Solution step length checks (max ' + MAX_STEP_LEN + ' chars) \u2500\u2500\n');
if (tooLong.length) tooLong.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' solution steps within ' + MAX_STEP_LEN + ' chars', tooLong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-not-too-long: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
