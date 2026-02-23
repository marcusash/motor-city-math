// focus-visible styles test
// WCAG 2.4.7: keyboard focus must be visible. :focus-visible must be defined.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} focus-visible-styles.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 :focus-visible rules \u2500\u2500');

// 1. :focus-visible selector defined (not just :focus)
test(':focus-visible selector defined', src.includes(':focus-visible'));

// 2. :focus-visible has outline property (visible ring)
var focusVisibleBlock = src.substring(src.indexOf(':focus-visible'), src.indexOf(':focus-visible') + 200);
test(':focus-visible block defines outline', focusVisibleBlock.includes('outline'));

// 3. :focus:not(:focus-visible) suppresses outline for mouse users
test(':focus:not(:focus-visible) removes outline for mouse', src.includes(':focus:not(:focus-visible)'));

// 4. Skip link has :focus-visible rule (keyboard nav entry point)
test('Skip link has :focus-visible rule', src.includes('.skip-link:focus-visible') || src.includes('.skip-link:focus'));

// 5. Check for dangerous outline:none: only flag if no compensating border/box-shadow
// :focus:not(:focus-visible) { outline:none } is intentional for mouse users
// input:focus { outline:none; border-color:...; box-shadow:... } is OK (compensated)
var lines = src.split('\n');
var dangerousOutlineNone = false;
for (var i = 0; i < lines.length; i++) {
    if (lines[i].includes('outline: none') || lines[i].includes('outline:none')) {
        // Find the enclosing block
        var blockEnd = src.indexOf('}', src.indexOf(lines[i]));
        var blockStart = src.lastIndexOf('{', src.indexOf(lines[i]));
        var block = src.substring(blockStart, blockEnd);
        var selectorStart = src.lastIndexOf('\n', blockStart);
        var selector = src.substring(selectorStart, blockStart).trim();
        // Flag only if: no :focus-visible context AND no border/box-shadow compensation
        var isFocusVisible = selector.includes('focus-visible');
        var hasCompensation = block.includes('border-color') || block.includes('box-shadow');
        if (!isFocusVisible && !hasCompensation) {
            console.log('  DANGER: outline:none without compensation in: ' + selector);
            dangerousOutlineNone = true;
        }
    }
}
test('outline:none in :focus rules always has compensation (border or box-shadow)', !dangerousOutlineNone);

// 6. Input elements have visible focus style (border or outline change)
var inputFocusSrc = src.match(/input:focus\s*\{([^\}]+)\}/g) || [];
var inputHasFocusStyle = inputFocusSrc.some(function(block) {
    return block.includes('outline') || block.includes('border') || block.includes('box-shadow');
});
test('input:focus has visible style (outline, border, or box-shadow)', inputHasFocusStyle);

// 7. exam.html has skip link element
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
test('exam.html has skip link (.skip-link)', examSrc.includes('skip-link'));

console.log('\n' + '='.repeat(50));
console.log('focus-visible-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
