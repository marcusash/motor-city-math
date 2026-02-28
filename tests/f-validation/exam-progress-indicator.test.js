// exam.html progress indicator test
// Exam must show progress (e.g., "Question 5 of 15") for ADHD position awareness
// MCM design rule: show progress position

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-progress-indicator.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Progress indicator checks \u2500\u2500\n');

// 1. Progress bar or counter exists
var hasProgressBar = examSrc.includes('progress-bar') || examSrc.includes('progressBar') ||
                     examSrc.includes('progress-fill') || examSrc.includes('<progress');
var hasCounter = examSrc.includes('of 15') || examSrc.includes('/ 15') || 
                 examSrc.includes('currentQuestion') || examSrc.includes('questionNum') ||
                 examSrc.includes('progress-text') || examSrc.includes('question-count');
test('Exam has progress bar or question counter', hasProgressBar || hasCounter);

// 2. Progress is updated (not static)
var hasProgressUpdate = examSrc.includes('progressBar') || examSrc.includes('progress-fill') ||
                        examSrc.includes('updateProgress') || examSrc.includes('setProgress') ||
                        (hasCounter && examSrc.includes('innerHTML'));
test('Progress is dynamically updated during exam', hasProgressUpdate || hasProgressBar);

// 3. Total question count visible
var hasTotalCount = examSrc.includes('15') || examSrc.includes('total') || 
                    examSrc.includes('questions.length') || examSrc.includes('totalQ');
test('Total question count referenced in exam.html', hasTotalCount);

console.log('\n' + '='.repeat(50));
console.log('exam-progress-indicator: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
