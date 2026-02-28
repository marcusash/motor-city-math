// exam-aria-progressbar test
// exam.html must use role=progressbar with aria-valuenow, aria-valuemin, aria-valuemax
// Screen readers need progressbar semantics to announce exam completion percentage

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-aria-progressbar.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 ARIA progressbar checks \u2500\u2500\n');

// 1. role=progressbar
var hasProgressbar = examSrc.includes('role="progressbar"') || examSrc.includes("role='progressbar'");
test('role="progressbar" present', hasProgressbar);

// 2. aria-valuenow (dynamically updated)
var hasValueNow = examSrc.includes('aria-valuenow');
test('aria-valuenow present on progressbar', hasValueNow);

// 3. aria-valuemin and aria-valuemax defined
var hasMinMax = examSrc.includes('aria-valuemin') && examSrc.includes('aria-valuemax');
test('aria-valuemin and aria-valuemax defined', hasMinMax);

console.log('\n' + '='.repeat(50));
console.log('exam-aria-progressbar: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
