// rp-solution-steps-not-empty-strings test
// No solution_steps entry may be an empty string

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-not-empty-strings.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step, idx) {
            total++;
            if (typeof step !== 'string' || step.trim() === '') {
                violations.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: empty or non-string');
            }
        });
    });
}

console.log('\u2500\u2500 solution_steps content checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total steps checked: ' + total);

test('No solution_steps entries are empty strings (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-not-empty-strings: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
