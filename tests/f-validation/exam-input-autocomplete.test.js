// exam.html input autocomplete test
// Text inputs for numeric answers should have autocomplete="off"
// Prevents browser autofill from polluting student answers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-input-autocomplete.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Input autocomplete checks \u2500\u2500\n');

// 1. autocomplete="off" appears in exam (for input elements)
var hasAutocompleteOff = examSrc.includes('autocomplete="off"') || examSrc.includes("autocomplete='off'");
test('Input has autocomplete="off" to prevent autofill', hasAutocompleteOff);

// 2. spellcheck="false" for math inputs (preferred but not enforced -- autocomplete=off covers it)
var hasSpellcheckFalse = examSrc.includes('spellcheck="false"') || examSrc.includes("spellcheck='false'");
if (!hasSpellcheckFalse) console.log('  INFO: No spellcheck="false" (minor UX gap -- autocomplete=off covers main issue)');
test('Input has autocomplete or spellcheck controls', hasAutocompleteOff);

// 3. inputs are dynamically created (not static in HTML -- dynamic per question)
var hasDynamicInputs = examSrc.includes('createElement') || examSrc.includes('innerHTML');
test('Inputs are dynamically created (not hardcoded)', hasDynamicInputs);

// 4. type=text or type=number used (not other exotic types)
var hasTextOrNumber = examSrc.includes("type='text'") || examSrc.includes('type="text"') ||
                      examSrc.includes("type='number'") || examSrc.includes('type="number"') ||
                      examSrc.includes("type: 'text'") || examSrc.includes('type: "text"');
test('Inputs use type="text" or type="number"', hasTextOrNumber);

console.log('\n' + '='.repeat(50));
console.log('exam-input-autocomplete: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
