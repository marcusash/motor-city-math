// css-focus-visible-not-outline-none test
// :focus-visible must not have outline:none unless another visible indicator is present
// Removing focus outline breaks keyboard navigation for all users

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-focus-visible-not-outline-none.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Check that :focus-visible is defined
var hasFocusVisible = /:focus-visible/.test(css);

// Extract :focus-visible blocks
var focusBlocks = css.match(/:focus-visible\s*\{[^}]+\}/g) || [];
var hasOutlineNoneAlone = focusBlocks.some(function(block) {
    return /outline\s*:\s*none/.test(block) && !/box-shadow\s*:/.test(block);
});

test(':focus-visible styles are defined', hasFocusVisible);
test(':focus-visible does not use outline:none without box-shadow fallback', !hasOutlineNoneAlone);

console.log('\n' + '='.repeat(50));
console.log('css-focus-visible-not-outline-none: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
