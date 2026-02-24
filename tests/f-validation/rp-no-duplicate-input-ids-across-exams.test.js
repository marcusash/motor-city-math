// rp-no-duplicate-input-ids-across-exams test
// Input IDs should be unique WITHIN each exam (already tested per-question)
// This test also ensures no exam reuses input IDs from its own questions
// (global cross-question uniqueness within one exam file)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-duplicate-input-ids-across-exams.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var seen = {};
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!inp.id) return;
            if (seen[inp.id]) {
                violations.push('rp' + i + ': duplicate input id=' + inp.id + ' in ' + q.id + ' (also in ' + seen[inp.id] + ')');
            } else {
                seen[inp.id] = q.id;
            }
        });
    });
}

console.log('\u2500\u2500 Cross-question input ID uniqueness checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('No duplicate input IDs across questions within any exam (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-duplicate-input-ids-across-exams: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
