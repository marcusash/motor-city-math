// RP solution steps count test
// Each question must have at least 2 solution_steps (show work, not just answer)
// Math tutor pattern: show the process, not just the final value

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooFew = [], missing = [], totalChecked = 0;
var MIN_STEPS = 2;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalChecked++;
        if (!q.solution_steps || !Array.isArray(q.solution_steps)) {
            missing.push('rp' + i + ' ' + q.id + ': no solution_steps');
        } else if (q.solution_steps.length < MIN_STEPS) {
            tooFew.push('rp' + i + ' ' + q.id + ': only ' + q.solution_steps.length + ' step(s)');
        }
    });
}

console.log('\u2500\u2500 Solution steps count checks \u2500\u2500\n');
console.log('  Questions checked: ' + totalChecked);

if (missing.length) missing.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
if (tooFew.length) tooFew.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

test('No questions missing solution_steps array', missing.length === 0);
test('All questions have >= ' + MIN_STEPS + ' solution steps', tooFew.length === 0);
test('At least 165 questions checked', totalChecked >= 165);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
