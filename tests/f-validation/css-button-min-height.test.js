// css-button-min-height test
// Buttons must have min-height for touch targets (WCAG 2.5.5: 44x44px)
// Kai uses this on a phone

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-button-min-height.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Touch target checks \u2500\u2500\n');

// min-height defined for buttons
var hasMinHeight = cssSrc.includes('min-height');
test('min-height defined in styles.css (touch targets)', hasMinHeight);

// pointer:coarse media query for touch (existing check from prior tests)
var hasPointerCoarse = cssSrc.includes('pointer: coarse') || cssSrc.includes('pointer:coarse');
test('pointer:coarse media query for touch targets', hasPointerCoarse);

// button-related min-height
var hasButtonHeight = /button[^}]*min-height|min-height[^}]*button|\.btn[^}]*min-height|min-height[^}]*\.btn/s.test(cssSrc) ||
                      cssSrc.includes('min-height: 44') || cssSrc.includes('min-height:44') ||
                      cssSrc.includes('min-height: 3') || cssSrc.includes('min-height: 2.75');
test('Button-specific or 44px+ min-height defined', hasButtonHeight);

console.log('\n' + '='.repeat(50));
console.log('css-button-min-height: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
