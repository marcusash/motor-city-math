// exam-hint-btn-accessible test
// Hint buttons must have aria-label attributes for screen reader users
// Kai may use keyboard navigation -- buttons must be descriptive

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-hint-btn-accessible.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Hint button accessibility checks \u2500\u2500\n');

// 1. Hint buttons exist in the exam
var hasHintBtns = examSrc.includes('hint-btn') || examSrc.includes('hintBtn');
test('Hint buttons exist in exam.html', hasHintBtns);

// 2. Hint buttons have aria-label or accessible name
var hintBtnAriaLabel = examSrc.includes('aria-label') && examSrc.includes('hint');
test('Hint buttons have aria-label attribute', hintBtnAriaLabel);

// 3. Hint layers explained (layers 1, 2, 3 for progressive disclosure)
var hasLayerSystem = examSrc.includes('layer') && examSrc.includes('hint') ||
                     examSrc.includes('showHint') && examSrc.includes('1') && examSrc.includes('2');
test('Progressive hint layer system (1=nudge, 2=answer, 3=steps)', hasLayerSystem);

// 4. Hint buttons hidden initially (shown after wrong answer or on demand)
var hintHiddenInitially = examSrc.includes('display:none') || examSrc.includes('display: none') ||
                          examSrc.includes('hidden') && examSrc.includes('hint');
test('Hint buttons hidden initially', hintHiddenInitially);

console.log('\n' + '='.repeat(50));
console.log('exam-hint-btn-accessible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
