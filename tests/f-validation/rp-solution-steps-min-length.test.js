// rp-solution-steps-min-length test
// Each solution step must be at least 5 characters
// Very short steps (like "x=5") are not useful worked examples

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-min-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var MIN_LEN = 5;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.solution_steps || []).forEach(function(step, idx) {
            if (typeof step === 'string' && step.trim().length < MIN_LEN) {
                violations.push(q.id + ' step[' + idx + ']: "' + step + '" (too short, min ' + MIN_LEN + ' chars)');
            }
        });
    });
}

test('All solution steps are >= ' + MIN_LEN + ' chars (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-min-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
