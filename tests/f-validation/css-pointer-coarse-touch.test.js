// css-pointer-coarse-touch test
// shared/styles.css must have @media (pointer:coarse) rules for mobile touch targets

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-pointer-coarse-touch.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Touch target media query checks \u2500\u2500\n');

var hasPointerCoarse = css.includes('pointer:coarse') || css.includes('pointer: coarse');
var hasTouchSizeRule = hasPointerCoarse && /pointer[^}]+min-height|pointer[^}]+padding/s.test(css);

test('CSS defines @media (pointer:coarse) for touch targets', hasPointerCoarse);
test('pointer:coarse block contains size/padding rules', hasTouchSizeRule || (hasPointerCoarse && css.slice(css.indexOf('pointer:coarse') - 10, css.indexOf('pointer:coarse') + 300).includes('min-height')));

console.log('\n' + '='.repeat(50));
console.log('css-pointer-coarse-touch: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
