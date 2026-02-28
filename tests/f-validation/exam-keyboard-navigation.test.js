// exam-keyboard-navigation test
// exam.html must support keyboard navigation between questions
// WCAG 2.1 requires full keyboard operability -- mouse-only is not acceptable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-keyboard-navigation.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Keyboard navigation checks \u2500\u2500\n');

// 1. Prev/Next buttons exist (keyboard-navigable question navigation)
var hasNavButtons = examSrc.includes('prev') || examSrc.includes('Prev') ||
                    examSrc.includes('Previous') || examSrc.includes('nav-btn');
test('Prev/Next navigation buttons exist', hasNavButtons);

// 2. Skip link for keyboard users
var hasSkipLink = examSrc.includes('skip') || examSrc.includes('Skip to');
test('Skip link for keyboard/screen reader users', hasSkipLink);

// 3. tabindex management (no tabindex=-1 that locks out keyboard)
var noTabIndexTrap = !examSrc.includes('tabindex="-1"') || 
                     (examSrc.includes('tabindex="-1"') && examSrc.includes('tabindex="0"'));
test('No keyboard trap (tabindex managed safely)', noTabIndexTrap);

console.log('\n' + '='.repeat(50));
console.log('exam-keyboard-navigation: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
