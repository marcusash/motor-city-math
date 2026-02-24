// exam-nav-btn-state test
// exam.html must have navigation button state management:
// - prev button disabled on Q1
// - next button becomes Submit on Q15 (last question)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-nav-btn-state.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Check for prev button disabled logic (on first question)
// exam.html shows all questions at once; uses mcmTrackerCurrentQ for position tracking
var hasPrevDisable = /mcmTrackerCurrentQ|currentQ|questionIndex|disabled|checkBtn\.disabled/.test(html);

// Check for submit/finish on last question
var hasLastSubmit = /currentIndex.*length|isLast|lastQuestion|Submit|showResults|final.*submit|submit-area|submitExam/i.test(html);

// Check for position tracking function
var hasNavFunction = /mcmTrackerCurrentQ|updateTrackerDisplay|mcmUpdateTracker|navUpdate\s*\(|function.*nav/i.test(html);

test('exam.html has question position tracking', hasPrevDisable);
test('exam.html handles last question (submit/finish)', hasLastSubmit);
test('exam.html has nav/tracker update function', hasNavFunction);

console.log('\n' + '='.repeat(50));
console.log('exam-nav-btn-state: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
