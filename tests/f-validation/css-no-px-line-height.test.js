// css-no-px-line-height test
// line-height must not use px units -- use unitless multipliers (1.4-1.6)
// px line-height doesn't scale with user font size changes (WCAG 1.4.4)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-px-line-height.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Match line-height with px value
var pxLineHeights = (css.match(/line-height\s*:\s*[\d.]+px/g) || []);

var MAX_PX_LH = 5; // Allow a small number for specific use cases (icons, badges)
test('CSS has <= ' + MAX_PX_LH + ' px line-height values (actual: ' + pxLineHeights.length + ')', pxLineHeights.length <= MAX_PX_LH);
if (pxLineHeights.length) {
    pxLineHeights.forEach(function(v) { console.log('    ! ' + v + ' -- use unitless multiplier instead'); });
}

console.log('\n' + '='.repeat(50));
console.log('css-no-px-line-height: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
