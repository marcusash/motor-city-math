// rp-no-solution-step-placeholder test
// solution_steps must not contain placeholder text like "TODO", "FIXME", "TBD", or "..."

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-solution-step-placeholder.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var BAD = /\bTODO\b|\bFIXME\b|\bTBD\b|^\.\.\.$|^placeholder$/i;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step, idx) {
            if (BAD.test(step)) {
                violations.push(q.id + ' step[' + idx + ']: "' + step.substring(0, 40) + '"');
            }
        });
    });
}

test('No solution_steps contain placeholder text (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-solution-step-placeholder: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
