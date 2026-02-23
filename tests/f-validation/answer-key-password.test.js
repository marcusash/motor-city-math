// Answer key password test
// exam.html answer key is password-protected (GD spec: Kai must not see answers during exam)
// Password must be present in showAnswerKey() function

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} answer-key-password.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Answer key password protection checks \u2500\u2500\n');

// 1. showAnswerKey function exists
var hasShowAnswerKey = examSrc.includes('showAnswerKey') || sharedSrc.includes('showAnswerKey');
test('showAnswerKey function exists', hasShowAnswerKey);

// 2. Password prompt used (prompt() call)
var hasPrompt = examSrc.includes('prompt(') || sharedSrc.includes('prompt(');
test('Password prompt() call exists in showAnswerKey', hasPrompt);

// 3. Answer key modal has role=dialog (in any exam HTML file)
var finalExamSrc = fs.readFileSync(path.join(__dirname, '../../final_exam_251123.html'), 'utf-8');
var hasDialog = examSrc.includes('role="dialog"') || examSrc.includes("role='dialog'") ||
                finalExamSrc.includes('role="dialog"') || finalExamSrc.includes("role='dialog'");
test('Answer key modal has role=dialog (in exam files)', hasDialog);

// 4. Answer key access is gated by password in showAnswerKey
var showKeyBody = sharedSrc.indexOf('function showAnswerKey') !== -1 ?
    sharedSrc.substring(sharedSrc.indexOf('function showAnswerKey'), sharedSrc.indexOf('function showAnswerKey') + 1000) : '';
var hasGated = showKeyBody.includes('prompt') || showKeyBody.includes('password');
test('showAnswerKey gates access via password prompt', hasGated);

// 5. Wrong password shows alert or error (not silent fail)
var hasWrongPwFeedback = examSrc.includes('incorrect') || examSrc.includes('wrong') ||
                         sharedSrc.includes('incorrect') || sharedSrc.includes('wrong');
test('Wrong password shows feedback (not silent fail)', hasWrongPwFeedback);

console.log('\n' + '='.repeat(50));
console.log('answer-key-password: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
