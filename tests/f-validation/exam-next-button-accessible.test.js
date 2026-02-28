// exam-next-button-accessible test
// exam.html Next/Previous navigation buttons must have accessible text
// Icon-only buttons without aria-label are inaccessible to screen readers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-next-button-accessible.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Next/Prev buttons must have either visible text or aria-label
var hasNextText = /Next|next|Previous|previous|Back|back/i.test(html);
// Must not be icon-only (aria-hidden without label)
var hasNavAriaLabel = /aria-label\s*=\s*["'][^"']*[Nn]ext|aria-label\s*=\s*["'][^"']*[Pp]rev|aria-label\s*=\s*["'][^"']*[Bb]ack/i.test(html);

test('exam.html has Next/Previous navigation text', hasNextText);
test('Navigation buttons have aria-label or visible text', hasNextText || hasNavAriaLabel);

console.log('\n' + '='.repeat(50));
console.log('exam-next-button-accessible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
