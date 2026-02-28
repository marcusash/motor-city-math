// rp-feedback-no-trailing-space test
// Feedback strings must not have leading or trailing whitespace
// Trailing spaces cause visual inconsistency and indicate copy-paste errors

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-no-trailing-space.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var totalChecked = 0;
var fields = ['hint', 'feedback_correct', 'feedback_wrong'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        fields.forEach(function(field) {
            var val = q[field];
            if (typeof val !== 'string') return;
            totalChecked++;
            if (val !== val.trim()) {
                violations.push('rp' + i + ' ' + q.id + '.' + field + ': has leading/trailing whitespace');
            }
        });
        // Check solution_steps too
        (q.solution_steps || []).forEach(function(step, idx) {
            if (typeof step === 'string' && step !== step.trim()) {
                violations.push('rp' + i + ' ' + q.id + '.solution_steps[' + idx + ']: has whitespace');
            }
        });
    });
}

console.log('\u2500\u2500 Feedback trailing whitespace checks \u2500\u2500\n');
console.log('  Fields checked: ' + totalChecked);

test('All feedback/hint fields have no leading/trailing whitespace', violations.length === 0);
if (violations.length) violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-no-trailing-space: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
