// rp-solution-steps-array test
// solution_steps must be an array of strings, not a single string
// Exam renderer iterates over steps -- a bare string would break rendering

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-array.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var nonArray = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.solution_steps === undefined) return;
        if (!Array.isArray(q.solution_steps)) {
            nonArray.push('rp' + i + ' ' + q.id + ': solution_steps is ' + typeof q.solution_steps + ' (expected array)');
        }
    });
}

console.log('\u2500\u2500 solution_steps type checks \u2500\u2500\n');
if (nonArray.length) nonArray.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All solution_steps are arrays (' + nonArray.length + ' violations)', nonArray.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-array: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
