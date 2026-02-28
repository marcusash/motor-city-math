// rp-solution-steps-min-2 test
// Questions should have at least 2 solution steps
// A single step is usually insufficient for Kai to understand the full process

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-min-2.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.section === 'B' || q.section === 'C'; }).forEach(function(q) {
        var steps = q.solution_steps || [];
        if (steps.length === 0) return; // missing steps handled by other test
        checked++;
        if (steps.length < 2) {
            violations.push('rp' + i + ' ' + q.id + ': only ' + steps.length + ' solution step (min 2)');
        }
    });
}

console.log('\u2500\u2500 Solution steps minimum count checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  B/C questions with solution steps checked: ' + checked);

test('All B/C questions have >= 2 solution steps (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-min-2: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
