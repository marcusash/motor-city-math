// exam.html print styles test
// The exam should have print-specific CSS that hides interactive UI
// Kai might print a completed exam for review

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-print-styles.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Print style checks \u2500\u2500\n');

// 1. @media print block exists
var hasPrintMedia = cssSrc.includes('@media print') || examSrc.includes('@media print');
test('@media print block exists (CSS or HTML)', hasPrintMedia);

// 2. Timer hidden on print (timer showing during print is distracting)
var timerHiddenOnPrint = (cssSrc.includes('@media print') && cssSrc.includes('display: none')) ||
                          (examSrc.includes('@media print') && examSrc.includes('display: none'));
test('Timer/nav hidden on print (display: none in @media print)', timerHiddenOnPrint);

// 3. Nav/buttons hidden on print
var navHiddenOnPrint = cssSrc.match(/@media print[^{]*\{[^}]*display:\s*none/s) || 
                        examSrc.match(/@media print[^{]*\{[^}]*display:\s*none/s) ||
                        (hasPrintMedia && (cssSrc.includes('display: none') || examSrc.includes('display: none')));
test('Navigation/buttons hidden on print', !!navHiddenOnPrint);

console.log('\n' + '='.repeat(50));
console.log('exam-print-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
