// exam-h1-count test
// exam.html must have exactly one <h1> element
// Multiple h1s confuse screen reader navigation; zero h1s fails WCAG 2.4.6

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-h1-count.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Count <h1 or <h1> tags (not in template literals or comments ideally)
var h1Count = (html.match(/<h1[\s>]/gi) || []).length;

test('exam.html has exactly 1 <h1> element (actual: ' + h1Count + ')', h1Count === 1);
if (h1Count === 0) console.log('    ! No <h1> found. Screen readers need a page heading.');
if (h1Count > 1)  console.log('    ! Multiple <h1> found. Only one <h1> allowed per page.');

console.log('\n' + '='.repeat(50));
console.log('exam-h1-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
