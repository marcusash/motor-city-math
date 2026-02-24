// rp-tolerance-less-than-answer test
// Each numeric answer's tolerance should be < the absolute value of the answer
// A tolerance >= answer means any value passes, which is a data authoring error

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-tolerance-less-than-answer.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            // Only check numeric inputs with both answer and tolerance defined
            if (inp.type === 'number' && typeof inp.answer === 'number' && typeof inp.tolerance === 'number') {
                var absAns = Math.abs(inp.answer);
                // Skip zero-answer checks (tolerance >= 0 is fine for answer=0)
                if (absAns > 0 && inp.tolerance >= absAns) {
                    violations.push(q.id + '/' + inp.id + ': tolerance=' + inp.tolerance + ' >= |answer|=' + absAns);
                }
            }
        });
    });
}

test('All numeric inputs have tolerance < |answer| (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-tolerance-less-than-answer: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
