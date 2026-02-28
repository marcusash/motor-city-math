// exam-answer-field-placeholder test
// Answer input fields in exam.html must have placeholder text
// Placeholders guide Kai on expected format (e.g., "e.g. 3.14" or "e.g. (2,3)")

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-answer-field-placeholder.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Answer field placeholder checks \u2500\u2500\n');

// 1. Placeholder attributes defined in JS or HTML template
var hasPlaceholder = examSrc.includes('placeholder');
test('placeholder attribute used in exam.html answer fields', hasPlaceholder);

// 2. Example format provided (e.g., "e.g." or "Enter")
var hasExampleHint = examSrc.includes('e.g.') || examSrc.includes('Enter your') || 
                     examSrc.includes('Your answer');
test('Placeholder includes example format hint (e.g., "e.g." or "Enter")', hasExampleHint);

console.log('\n' + '='.repeat(50));
console.log('exam-answer-field-placeholder: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
