// exam-footer-present test
// exam.html should have a footer or bottom nav area
// Provides context (test name, exam source) below the question area

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-footer-present.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Footer/bottom nav checks \u2500\u2500\n');

// Footer element or nav-bottom or exam-footer
var hasFooter = examSrc.includes('<footer') || examSrc.includes('class="footer') || 
                examSrc.includes("class='footer") || examSrc.includes('exam-footer') ||
                examSrc.includes('nav-bottom') || examSrc.includes('footer-bar');
test('Footer or bottom nav area present in exam.html', hasFooter);

// Submit/done button at bottom (end of exam action)
var hasSubmitBottom = examSrc.includes('submit') || examSrc.includes('Submit') || 
                      examSrc.includes('done') || examSrc.includes('Done');
test('Submit or Done action present in exam.html', hasSubmitBottom);

console.log('\n' + '='.repeat(50));
console.log('exam-footer-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
