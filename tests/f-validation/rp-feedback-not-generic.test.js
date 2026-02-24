// rp-feedback-not-generic test
// Feedback strings must not be generic placeholder text
// Generic feedback like "Correct!" or "Try again" provides no educational value

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-not-generic.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var GENERIC_PATTERNS = [/^correct!?$/i, /^right!?$/i, /^try again\.?$/i, /^incorrect\.?$/i, /^wrong\.?$/i, /^good job!?$/i];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var isGenericCorrect = q.feedback_correct && GENERIC_PATTERNS.some(function(p) { return p.test(q.feedback_correct.trim()); });
        var isGenericWrong = q.feedback_wrong && GENERIC_PATTERNS.some(function(p) { return p.test(q.feedback_wrong.trim()); });
        if (isGenericCorrect) violations.push(q.id + ' feedback_correct: "' + q.feedback_correct + '" (too generic)');
        if (isGenericWrong) violations.push(q.id + ' feedback_wrong: "' + q.feedback_wrong + '" (too generic)');
    });
}

test('No feedback strings are generic placeholders (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-not-generic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
