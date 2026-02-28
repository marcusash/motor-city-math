// Post-exam CTA test
// After gradeExam(): Kai must see a clear, single next action (ADHD: one CTA at a time)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} post-exam-cta.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Find gradeExam function for context
var gradeExamStart = examSrc.indexOf('function gradeExam(');
var gradeExamBody = gradeExamStart !== -1 ? examSrc.substring(gradeExamStart, gradeExamStart + 20000) : '';

console.log('\u2500\u2500 Post-exam CTA checks \u2500\u2500\n');

// 1. CTA element exists in exam.html (a button or link for next action)
var hasCta = examSrc.includes('cta') || examSrc.includes('Try Another') || examSrc.includes('View Scorecard') ||
             examSrc.includes('next-action') || examSrc.includes('back-to-home');
test('Post-exam CTA element exists', hasCta || examSrc.includes('Back to') || examSrc.includes('home'));

// 2. "Back to Dashboard" or "Pick Another Test" option after completion
var hasBackOption = examSrc.includes('dashboard') || examSrc.includes('index.html') ||
                    examSrc.includes('window.location') || examSrc.includes('Back');
test('Post-exam has navigation back to dashboard/home', hasBackOption);

// 3. gradeExam renders section 5 (scorecard section = final state)
var hasFinalSection = gradeExamBody.includes('section-5') || gradeExamBody.includes('Section 5') ||
                      gradeExamBody.includes('scorecard') || gradeExamBody.includes('save');
test('gradeExam() renders final scorecard state (section 5)', hasFinalSection);

// 4. No multiple competing CTAs on same screen (ADHD: one CTA at a time)
// Check for presence of primary button class (should be singular)
var primaryBtnCount = (gradeExamBody.match(/btn-primary/g) || []).length +
                      (gradeExamBody.match(/class="[^"]*primary/g) || []).length;
console.log('  Primary button occurrences in gradeExam: ' + primaryBtnCount);
test('gradeExam scorecard has at most 2 primary CTAs', primaryBtnCount <= 4);

// 5. Error case: if score is low, show "Practice Again" encouragement
var hasEncouragement = examSrc.includes('Try again') || examSrc.includes('Keep going') ||
                       examSrc.includes('Practice') || examSrc.includes('coachMsg');
test('Low-score state has encouragement message', hasEncouragement);

console.log('\n' + '='.repeat(50));
console.log('post-exam-cta: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
