// exam-error-state-css test
// exam.html or shared CSS must have error state styles
// Input error states (wrong answer) must be visually distinguishable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-error-state-css.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var combined = css + html;

// Check for error/incorrect class or aria-invalid style hooks
var hasErrorClass = /\.error|\.incorrect|\.wrong|\[aria-invalid/i.test(combined);
var hasErrorColor = /--accent-red|--color-error|--error|#C8102E|crimson|red/i.test(css);

test('CSS or HTML defines error state styles (.error/.incorrect/[aria-invalid])', hasErrorClass);
test('Error state uses a red accent color', hasErrorColor);

console.log('\n' + '='.repeat(50));
console.log('exam-error-state-css: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
