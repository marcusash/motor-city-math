// rp-solution-steps-strings-only test
// solution_steps must be an array of strings only (no nested objects/arrays)
// Non-string steps crash the step-by-step solution renderer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-strings-only.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!Array.isArray(q.solution_steps)) return;
        q.solution_steps.forEach(function(step, idx) {
            if (typeof step !== 'string') {
                violations.push('retake-practice-' + i + ' ' + q.id + ' step[' + idx + ']: is ' + typeof step + ' (must be string)');
            }
        });
    });
}

test('All solution_steps entries are strings (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-strings-only: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
