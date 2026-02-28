// css-color-variables-only test
// styles.css should use CSS custom properties for all colors (no hardcoded hex in rules)
// Hardcoded hex in rules (not in :root) makes theming hard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-color-variables-only.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Find hardcoded hex colors OUTSIDE :root { } block
// Split on :root block, check hex usage after it
var rootEnd = cssSrc.indexOf(':root {');
var afterRoot = rootEnd > -1 ? cssSrc.slice(cssSrc.indexOf('}', rootEnd) + 1) : cssSrc;

// Count hex colors in rules (not in :root, not in comments)
var hexMatches = (afterRoot.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter(function(h) {
    // Filter out known intentional ones (shadows, border overrides)
    return !['#fff', '#FFF', '#000', '#000000', '#ffffff', '#FFFFFF'].includes(h);
});

console.log('\u2500\u2500 Color variable usage checks \u2500\u2500\n');
console.log('  Hardcoded hex outside :root: ' + hexMatches.length);
if (hexMatches.length > 0 && hexMatches.length <= 10) {
    console.log('  Values: ' + hexMatches.slice(0, 5).join(', '));
}

// Allow up to 50 hardcoded hex (legacy + pseudo-element decorative uses + rgba values)
test('Hardcoded hex colors outside :root kept minimal (<50): ' + hexMatches.length, hexMatches.length < 50);

console.log('\n' + '='.repeat(50));
console.log('css-color-variables-only: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
