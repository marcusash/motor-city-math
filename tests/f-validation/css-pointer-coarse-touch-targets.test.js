// css-pointer-coarse-touch-targets test
// CSS should define larger touch targets for pointer: coarse (touch devices)
// Kai uses this on iPad/phone; small targets cause mis-taps (ADHD frustration)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-pointer-coarse-touch-targets.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasPointerCoarse = /@media[^{]*pointer\s*:\s*coarse/.test(css);

test('CSS has @media (pointer: coarse) for touch targets', hasPointerCoarse);

console.log('\n' + '='.repeat(50));
console.log('css-pointer-coarse-touch-targets: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
