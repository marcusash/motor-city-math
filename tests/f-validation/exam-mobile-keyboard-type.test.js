// exam-mobile-keyboard-type test
// Number inputs should have inputmode="numeric" or type="number" for mobile keyboard
// Kai on phone needs the number pad, not the full keyboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-mobile-keyboard-type.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Mobile keyboard type checks \u2500\u2500\n');

// inputmode="numeric" used for number-type inputs
var hasInputMode = examSrc.includes('inputmode') || examSrc.includes('inputMode');
test('inputmode attribute used for number inputs', hasInputMode);

// type="number" or input with numeric inputmode
var hasTypeNumber = examSrc.includes('type="number"') || examSrc.includes("type='number'");
test('type=number or inputmode=numeric in exam.html', hasTypeNumber || hasInputMode);

console.log('\n' + '='.repeat(50));
console.log('exam-mobile-keyboard-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
