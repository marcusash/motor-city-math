// RP JSON feedback no em dash test
// MCM voice rule: feedback_correct/wrong strings must not contain em dashes (— or –)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-no-emdash.test.js\n');

var EM_DASH = '\u2014';
var EN_DASH = '\u2013';

var dataDir = path.join(__dirname, '../../data');
var examFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/retake-practice-\d+\.json/);
}).sort();

var feedbackFields = ['feedback_correct', 'feedback_wrong', 'feedback_wrong_parent',
                      'feedback_wrong_intercepts', 'feedback_wrong_other'];

var emDashViolations = [];
var totalFeedback = 0;

examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    (data.questions || []).forEach(function(q) {
        feedbackFields.forEach(function(field) {
            if (q[field]) {
                totalFeedback++;
                if (q[field].includes(EM_DASH) || q[field].includes(EN_DASH)) {
                    emDashViolations.push(file + ':' + q.id + ':' + field);
                }
            }
        });
    });
});

console.log('\u2500\u2500 Feedback strings: ' + totalFeedback + ' total \u2500\u2500\n');
test('Total feedback strings > 0 (data loaded)', totalFeedback > 0);
test('No em dashes in any feedback string (MCM voice rule)', emDashViolations.length === 0);
if (emDashViolations.length > 0) {
    console.log('\n  Violations:');
    emDashViolations.forEach(function(v) { console.log('    ' + v); });
}

// Also check hint strings
var hintEmDash = [];
examFiles.forEach(function(file) {
    var data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    (data.questions || []).forEach(function(q) {
        if (q.hint && (q.hint.includes(EM_DASH) || q.hint.includes(EN_DASH))) {
            hintEmDash.push(file + ':' + q.id + ':hint');
        }
        (q.solution_steps || []).forEach(function(step, i) {
            if (step.includes(EM_DASH) || step.includes(EN_DASH)) {
                hintEmDash.push(file + ':' + q.id + ':solution_steps[' + i + ']');
            }
        });
    });
});
test('No em dashes in hint or solution_steps strings', hintEmDash.length === 0);
if (hintEmDash.length > 0) {
    console.log('\n  Hint violations:');
    hintEmDash.forEach(function(v) { console.log('    ' + v); });
}

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-no-emdash: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
