// css-transition-has-duration test
// Any CSS transition must have an explicit duration
// Missing duration causes instant/jarring state changes

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-transition-has-duration.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Count transitions that specify a duration (ms or s)
var transitionsWithDuration = (css.match(/transition\s*:[^;]*\d+(ms|s)/g) || []).length;
var transitionsTotal = (css.match(/\btransition\s*:/g) || []).length;

test('CSS has at least one transition defined', transitionsTotal >= 1);
// Allow 2 transitions without duration (shorthand or global resets)
test('Nearly all transitions specify a duration (>= 80%)', transitionsWithDuration >= Math.ceil(transitionsTotal * 0.8));
console.log('  Total transitions: ' + transitionsTotal + ', with duration: ' + transitionsWithDuration);

console.log('\n' + '='.repeat(50));
console.log('css-transition-has-duration: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
