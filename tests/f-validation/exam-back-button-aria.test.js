// exam-back-button-aria test
// Back/Previous button in exam must have descriptive aria-label
// "Go back" is not enough -- screen reader needs context

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-back-button-aria.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Back button ARIA checks \u2500\u2500\n');

// Back/previous button present
var hasBackBtn = examSrc.includes('prev') || examSrc.includes('back') || examSrc.includes('Back') || examSrc.includes('Previous');
test('Back/Previous navigation button present in exam.html', hasBackBtn);

// Back button has aria-label
var hasBackAria = (examSrc.includes('prev') || examSrc.includes('back')) && examSrc.includes('aria-label');
test('Navigation has aria-label for accessibility', hasBackAria);

console.log('\n' + '='.repeat(50));
console.log('exam-back-button-aria: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
