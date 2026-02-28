// exam-per-input-grading test
// exam.html must grade each input independently (no all-or-nothing for multi-input questions)
// FA spec: partial credit grading -- each input has its own check/feedback

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-per-input-grading.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Per-input grading: each input has its own check button or grading call
// Look for: per-input check handler, individual input scoring, or inputs loop with score tracking
var hasPerInputCheck = /forEach.*input|inputs\.forEach|checkInput|gradeInput|per.?input|inputId/.test(html);

// Look for partial credit logic: some inputs correct even if not all
var hasPartialCredit = /partial|partCredit|correct\s*\+\+|score\s*\+\+|numCorrect|correctCount/.test(html);

// Check for individual input feedback (not just a single question-level feedback)
var hasInputFeedback = /input.*feedback|feedback.*input|feedback-.*\d|checkBtn/.test(html);

test('exam.html processes inputs individually (per-input grading)', hasPerInputCheck);
test('exam.html accumulates partial credit', hasPartialCredit);
test('exam.html has per-input feedback mechanism', hasInputFeedback);

console.log('\n' + '='.repeat(50));
console.log('exam-per-input-grading: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
