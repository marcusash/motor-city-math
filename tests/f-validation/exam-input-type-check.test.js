// exam-input-type-check test
// All input elements in exam.html must have appropriate type attributes
// Correct input types enable mobile keyboard (number pad for numeric answers)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-input-type-check.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Input type checks \u2500\u2500\n');

// 1. input type="text" or type="number" used for answer fields
var hasInputType = examSrc.includes('type="text"') || examSrc.includes('type="number"');
test('input elements have type="text" or type="number"', hasInputType);

// 2. radio inputs typed correctly
var hasRadio = examSrc.includes('type="radio"') || examSrc.includes("type='radio'");
test('radio input type used for multiple-choice questions', hasRadio);

// 3. No bare <input> without type (defaults to type=text but bad practice)
var bareInput = (examSrc.match(/<input(?![^>]*type=)[^>]*>/g) || []).length;
test('No bare <input> elements without type attribute: ' + bareInput, bareInput === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-input-type-check: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
