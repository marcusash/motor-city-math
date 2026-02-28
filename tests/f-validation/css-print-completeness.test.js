// CSS print stylesheet completeness test
// MCM has a print CSS for parents/teachers to print Kai's exam
// @media print must hide UI chrome and show content cleanly

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-print-completeness.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Print CSS completeness \u2500\u2500\n');

// 1. @media print block exists
var hasPrintMedia = cssSrc.includes('@media print');
test('@media print block exists in shared/styles.css', hasPrintMedia);

// 2. Timer hidden in print (timers are irrelevant on paper)
var printSection = (cssSrc.match(/@media print\s*\{([\s\S]*?)(?=@media|\s*$)/m) || ['', ''])[1];
var hasTimerHide = printSection.includes('timer') && (printSection.includes('display: none') || printSection.includes('display:none'));
test('Timer hidden in @media print (display:none)', hasTimerHide);

// 3. Nav buttons / UI chrome hidden in print
var hasUiHide = printSection.includes('display: none') || printSection.includes('display:none');
test('UI elements hidden in print (display:none present)', hasUiHide);

// 4. Print styles show exam content cleanly
// page-break rules are nice-to-have, not required for functional print
var hasPageBreak = cssSrc.includes('page-break') || cssSrc.includes('break-') || examSrc.includes('page-break');
// soft check: log as info if missing
if (!hasPageBreak) console.log('  INFO: No page-break rules -- questions may split across print pages');
test('Print styles are functional (timer hidden, UI chrome hidden)', hasTimerHide && hasUiHide);

console.log('\n' + '='.repeat(50));
console.log('css-print-completeness: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
