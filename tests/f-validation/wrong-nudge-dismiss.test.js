// Wrong nudge dismiss test
// After a wrong answer: "Next up: Q{N+1}" nudge appears
// Nudge dismisses when Kai scrolls past the question (IntersectionObserver)
// GD spec: do not let the nudge persist forever

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} wrong-nudge-dismiss.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Post-wrong nudge dismiss checks \u2500\u2500\n');

// 1. Wrong nudge element created with class wrong-nudge
var hasWrongNudge = examSrc.includes('wrong-nudge');
test('wrong-nudge class used in post-wrong nudge', hasWrongNudge);

// 2. Nudge text references next question ("Next up: Q{N}")
var hasNextUp = examSrc.includes('Next up:') || examSrc.includes('next up');
test('Nudge copy says "Next up: Q{N}"', hasNextUp);

// 3. IntersectionObserver used to dismiss nudge on scroll
var hasIO = examSrc.includes('IntersectionObserver');
test('IntersectionObserver used to dismiss nudge on scroll', hasIO);

// 4. Nudge removed from DOM when not intersecting
var hasRemoveChild = examSrc.includes('removeChild') || examSrc.includes('remove()');
test('Nudge removed from DOM via removeChild or .remove()', hasRemoveChild);

// 5. Nudge has aria-live=polite (so screen reader announces it)
var hasAriaLive = examSrc.includes('wrong-nudge') && examSrc.includes("aria-live");
test('Nudge has aria-live for screen reader announcement', hasAriaLive);

console.log('\n' + '='.repeat(50));
console.log('wrong-nudge-dismiss: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
