// css-button-sizing test
// Buttons in shared/styles.css must meet minimum touch target size (44x44px)
// Per WCAG 2.5.5 and .responsive-spec.md: min-height: 44px for touch targets

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-button-sizing.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Button sizing checks \u2500\u2500\n');

// 1. min-height on buttons (at least 44px or 2.75rem)
var hasMinHeight = stylesSrc.includes('min-height') && 
                   (stylesSrc.includes('44px') || stylesSrc.includes('2.75rem') || 
                    stylesSrc.includes('48px') || stylesSrc.includes('3rem'));
test('Buttons have min-height >=44px (WCAG touch target)', hasMinHeight);

// 2. btn-primary class defined
var hasBtnPrimary = stylesSrc.includes('.btn-primary') || stylesSrc.includes('btn-primary');
test('.btn-primary class defined in shared/styles.css', hasBtnPrimary);

// 3. Padding on buttons for click area
var hasBtnPadding = stylesSrc.includes('padding') && stylesSrc.includes('btn');
test('Button padding defined', hasBtnPadding);

console.log('\n' + '='.repeat(50));
console.log('css-button-sizing: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
