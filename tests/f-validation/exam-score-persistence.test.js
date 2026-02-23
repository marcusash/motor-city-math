// Exam score persistence test
// After gradeExam(), results must be saved to localStorage
// saveResults() must be called with exam ID and results object

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-persistence.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Score persistence checks \u2500\u2500\n');

// 1. saveResults called in exam.html (after gradeExam)
var hasSaveResultsCall = examSrc.includes('saveResults');
test('saveResults() called in exam.html', hasSaveResultsCall);

// 2. saveResults defined in shared/scripts.js
var hasSaveResultsDef = sharedSrc.includes('function saveResults') || sharedSrc.includes('saveResults =');
test('saveResults() defined in shared/scripts.js', hasSaveResultsDef);

// 3. saveResults writes score and attempts to localStorage
var saveResultsBody = (sharedSrc.match(/function saveResults[\s\S]*?(?=\nfunction |\nvar |\n\/\*)/m) || [''])[0];
var hasSaveToStorage = saveResultsBody.includes('localStorage') || sharedSrc.includes('localStorage.setItem');
test('saveResults writes to localStorage', hasSaveToStorage);

// 4. Score includes pct (percentage) and total
var hasPctTotal = examSrc.includes('pct') && examSrc.includes('total');
test('Score object includes pct and total fields', hasPctTotal);

// 5. Attempt history saved (multiple attempts tracked in exam.html)
var hasAttempts = examSrc.includes('attempts') && (examSrc.includes('.push') || examSrc.includes('attempts:'));
test('Attempt history saved in exam.html (attempts array tracked)', hasAttempts);

console.log('\n' + '='.repeat(50));
console.log('exam-score-persistence: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
