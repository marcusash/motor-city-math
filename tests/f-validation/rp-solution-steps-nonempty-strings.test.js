// rp-solution-steps-nonempty-strings test
// Each solution_step in every RP exam must be a non-empty string
// Empty or whitespace-only steps would show blank lines to Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-nonempty-strings.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var empty = [], totalSteps = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step, idx) {
            totalSteps++;
            if (typeof step !== 'string' || step.trim().length === 0) {
                empty.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: ' + JSON.stringify(step));
            }
        });
    });
}

console.log('\u2500\u2500 Solution step string checks \u2500\u2500\n');
if (empty.length) empty.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + totalSteps + ' solution steps are non-empty strings', empty.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-nonempty-strings: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
