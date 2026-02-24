// css-overflow-x-hidden test
// shared/styles.css should prevent horizontal scroll on mobile
// body or html should have overflow-x: hidden or similar

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-overflow-x-hidden.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Overflow-X checks \u2500\u2500\n');

var hasOverflowXHidden = css.includes('overflow-x: hidden') || css.includes('overflow-x:hidden');
var hasOverflowHidden = css.includes('overflow: hidden') || css.includes('overflow:hidden');

test('CSS prevents horizontal scroll (overflow-x: hidden or overflow: hidden)', hasOverflowXHidden || hasOverflowHidden);
test('CSS defines overflow-x: hidden specifically', hasOverflowXHidden);

console.log('\n' + '='.repeat(50));
console.log('css-overflow-x-hidden: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
