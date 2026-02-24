// rp-solution-steps-strings test
// Each element in solution_steps must be a non-empty string
// Null/undefined steps would break exam.html step renderer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-strings.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var badSteps = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!Array.isArray(q.solution_steps)) return;
        q.solution_steps.forEach(function(step, idx) {
            if (typeof step !== 'string' || step.trim().length === 0) {
                badSteps.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: not a non-empty string');
            }
        });
    });
}

console.log('\u2500\u2500 solution_steps element type checks \u2500\u2500\n');
if (badSteps.length) badSteps.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All solution_steps elements are non-empty strings (' + badSteps.length + ' violations)', badSteps.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-strings: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
