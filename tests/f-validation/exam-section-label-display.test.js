// exam-section-label-display test
// exam.html must show section labels (A, B, C, D) when displaying questions
// Without section context, Kai doesn't know what type of question he's on

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-section-label-display.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Look for section rendering -- section name display
var hasSectionDisplay = /section\s*[A-D]|Section\s+[A-D]|q\.section|question\.section|data\.section/i.test(html);

test('exam.html displays or uses section labels', hasSectionDisplay);

console.log('\n' + '='.repeat(50));
console.log('exam-section-label-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
