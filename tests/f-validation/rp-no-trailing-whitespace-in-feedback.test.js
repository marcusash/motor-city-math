// rp-no-trailing-whitespace-in-feedback test
// feedback_correct and feedback_wrong must not have leading/trailing whitespace
// Extra whitespace causes display issues and is a data quality concern

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-trailing-whitespace-in-feedback.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        ['feedback_correct', 'feedback_wrong'].forEach(function(field) {
            if (q[field] && q[field] !== q[field].trim()) {
                violations.push(q.id + '.' + field + ': has leading/trailing whitespace');
            }
        });
    });
}

test('No feedback fields have leading/trailing whitespace (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-trailing-whitespace-in-feedback: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
