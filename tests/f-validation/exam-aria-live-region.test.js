// exam-aria-live-region test
// exam.html must have aria-live regions for dynamic content
// Score announcements and feedback must be read by screen readers automatically

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-aria-live-region.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 ARIA live region checks \u2500\u2500\n');

// 1. aria-live present
var hasAriaLive = examSrc.includes('aria-live');
test('aria-live region present in exam.html', hasAriaLive);

// 2. aria-live="assertive" for immediate announcements (feedback)
var hasAssertive = examSrc.includes('aria-live="assertive"') || examSrc.includes("aria-live='assertive'");
test('aria-live="assertive" for immediate feedback announcements', hasAssertive);

// 3. aria-atomic for full re-read
var hasAtomic = examSrc.includes('aria-atomic');
test('aria-atomic present for complete region re-read', hasAtomic);

console.log('\n' + '='.repeat(50));
console.log('exam-aria-live-region: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
