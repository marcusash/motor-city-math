// exam-progress-counter-present test
// exam.html should display a question progress counter (e.g., "Question 3 of 15")
// Progress counters reduce ADHD anxiety by showing how far along Kai is

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-progress-counter-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// progress counter (text or element) - "X of Y" pattern or progress element
var hasOfPattern     = /of\s+\d+|of\s+total|\bof\b.*question/i.test(html);
var hasProgressClass = /class="[^"]*progress[^"]*"/.test(html);
var hasProgressEl    = /<progress\b/.test(html);
var hasCurrentOf     = /currentQuestion|questionNumber|questionIndex/i.test(html);

test('exam.html has question progress indicator', hasOfPattern || hasProgressClass || hasProgressEl || hasCurrentOf);

console.log('\n' + '='.repeat(50));
console.log('exam-progress-counter-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
