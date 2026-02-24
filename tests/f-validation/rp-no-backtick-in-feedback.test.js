// rp-no-backtick-in-feedback test
// Feedback strings must not contain backtick characters
// Backticks appearing as literal text in feedback look like code and confuse students

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-backtick-in-feedback.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.feedback_correct && q.feedback_correct.indexOf('`') !== -1) {
            violations.push(q.id + ' feedback_correct: contains backtick');
        }
        if (q.feedback_wrong && q.feedback_wrong.indexOf('`') !== -1) {
            violations.push(q.id + ' feedback_wrong: contains backtick');
        }
    });
}

test('No feedback strings contain backtick characters (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-backtick-in-feedback: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
