// css-transition-cubic-bezier test
// Smooth transitions can use cubic-bezier for natural easing
// At least one transition should use a non-linear easing function

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-transition-cubic-bezier.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Either cubic-bezier, ease-in-out, ease-in, ease-out (not just linear)
var nonLinearEasing = (css.match(/cubic-bezier|ease-in-out|ease-in|ease-out/g) || []).length;
var hasEasing = nonLinearEasing > 0;

test('CSS uses non-linear easing in transitions (count: ' + nonLinearEasing + ')', hasEasing);

console.log('\n' + '='.repeat(50));
console.log('css-transition-cubic-bezier: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
