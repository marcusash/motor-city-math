// css-min-width-not-used test
// CSS should avoid min-width on text containers (breaks narrow viewport wrapping)
// Prefer max-width with width:100% for responsive containers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-min-width-not-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var minWidthCount = (css.match(/min-width\s*:\s*\d/g) || []).length;
var MAX_MIN_WIDTH = 5;

test('CSS uses min-width sparingly (<= ' + MAX_MIN_WIDTH + ' times, actual: ' + minWidthCount + ')', minWidthCount <= MAX_MIN_WIDTH);

console.log('\n' + '='.repeat(50));
console.log('css-min-width-not-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
