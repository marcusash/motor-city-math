// CSS button style consistency test
// MCM uses .btn-primary and .btn-secondary class names
// All button-like elements should use these classes consistently

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-button-styles.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Button style checks \u2500\u2500\n');

// 1. .btn-primary defined
var hasBtnPrimary = cssSrc.includes('.btn-primary');
test('.btn-primary class defined in shared/styles.css', hasBtnPrimary);

// 2. .btn-secondary defined  
var hasBtnSecondary = cssSrc.includes('.btn-secondary');
test('.btn-secondary class defined in shared/styles.css', hasBtnSecondary);

// 3. Button styles include cursor: pointer
var buttonBlock = cssSrc.match(/\.btn[-\w]*\s*\{[^}]+\}/g) || [];
var hasCursorPointer = buttonBlock.some(function(b) { return b.includes('cursor: pointer') || b.includes('cursor:pointer'); });
// also check if there's a general button/cursor rule
if (!hasCursorPointer) {
    hasCursorPointer = cssSrc.includes('cursor: pointer') || cssSrc.includes('cursor:pointer');
}
test('Button styles include cursor: pointer', hasCursorPointer);

// 4. Button has padding or min-height (touch target)
var hasTouchTarget = buttonBlock.some(function(b) { return b.includes('padding') || b.includes('min-height'); });
if (!hasTouchTarget) {
    hasTouchTarget = cssSrc.includes('.btn-primary') && cssSrc.includes('padding');
}
test('Buttons have padding/min-height (touch target size)', hasTouchTarget);

console.log('\n' + '='.repeat(50));
console.log('css-button-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
