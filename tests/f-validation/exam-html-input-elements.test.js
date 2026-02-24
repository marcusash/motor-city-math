// exam-html-input-elements test
// exam.html must render number and radio inputs as proper HTML elements
// The grader reads input values from DOM -- missing elements break scoring

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-html-input-elements.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Input element checks \u2500\u2500\n');

// Number inputs rendered
var hasNumberInput = examSrc.includes('type="number"') || examSrc.includes("type='number'") ||
                     (examSrc.includes('inp.type') && examSrc.includes('number'));
test('Number inputs rendered in exam.html', hasNumberInput);

// Radio inputs rendered
var hasRadioInput = examSrc.includes('type="radio"') || examSrc.includes("type='radio'") ||
                    (examSrc.includes('inp.type') && examSrc.includes('radio'));
test('Radio inputs rendered in exam.html', hasRadioInput);

// Input IDs set dynamically from JSON
var hasInputId = examSrc.includes('inp.id') || examSrc.includes("input.id") || 
                 examSrc.includes('.id =') || examSrc.includes("setAttribute('id'");
test('Input IDs set dynamically from JSON data', hasInputId);

console.log('\n' + '='.repeat(50));
console.log('exam-html-input-elements: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
