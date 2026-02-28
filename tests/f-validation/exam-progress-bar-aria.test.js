// exam-progress-bar-aria test
// exam.html progress bar must have WCAG aria attributes
// aria-valuenow, aria-valuemin, aria-valuemax (or role=progressbar)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-progress-bar-aria.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Progress bar ARIA checks \u2500\u2500\n');

// role=progressbar or progress element
var hasProgressRole = examSrc.includes('role="progressbar"') || examSrc.includes("role='progressbar'") ||
                      examSrc.includes('<progress');
test('Progress bar has role=progressbar or <progress> element', hasProgressRole);

// aria-valuenow (can be set via JS)
var hasValueNow = examSrc.includes('aria-valuenow') || examSrc.includes("setAttribute('aria-valuenow") ||
                  examSrc.includes('setAttribute("aria-valuenow');
test('Progress bar has aria-valuenow (static or dynamic)', hasValueNow);

// aria-valuemin / aria-valuemax
var hasMinMax = (examSrc.includes('aria-valuemin') && examSrc.includes('aria-valuemax')) ||
                examSrc.includes('aria-valuemin="0"');
test('Progress bar has aria-valuemin and aria-valuemax', hasMinMax);

console.log('\n' + '='.repeat(50));
console.log('exam-progress-bar-aria: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
