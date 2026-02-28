// RP feedback em-dash test
// feedback_correct and feedback_wrong must not contain em-dashes
// MCM voice guide bans em-dashes in all copy

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-no-em-dash.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], totalChecked = 0;
var EM_DASH = /\u2014|\u2013/; // actual Unicode em/en-dash only (-- in math is OK)

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        ['feedback_correct', 'feedback_wrong'].forEach(function(field) {
            var txt = q[field] || '';
            totalChecked++;
            if (EM_DASH.test(txt)) {
                violations.push('rp' + i + ' ' + q.id + ' ' + field);
            }
        });
    });
}

console.log('\u2500\u2500 Feedback em-dash checks \u2500\u2500\n');
console.log('  Fields checked: ' + totalChecked);

if (violations.length) violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
test('No em/en-dashes in any feedback fields (MCM voice guide)', violations.length === 0);
test('At least 330 feedback fields checked', totalChecked >= 330);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-no-em-dash: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
