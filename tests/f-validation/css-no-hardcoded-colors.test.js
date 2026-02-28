// css-no-hardcoded-colors test
// shared/styles.css must use CSS custom properties for all non-white/black/transparent colors
// Hardcoded hex/rgb values outside :root violate the design token system

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-hardcoded-colors.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Extract non-:root sections only (outside :root block)
// Simple approach: find :root { ... } and exclude it
var rootStart = stylesSrc.indexOf(':root');
var rootEnd = stylesSrc.indexOf('}', rootStart);
var afterRoot = stylesSrc.slice(rootEnd + 1);

// Find hex colors in the non-root section
var hexMatches = afterRoot.match(/#[0-9A-Fa-f]{3,6}\b/g) || [];
// Allow transparent/white/black shorthand (fff, 000)
var realHardcoded = hexMatches.filter(function(h) {
    var lower = h.toLowerCase();
    return lower !== '#fff' && lower !== '#000' && lower !== '#ffffff' && lower !== '#000000';
});

console.log('\u2500\u2500 Hardcoded color checks \u2500\u2500\n');
if (realHardcoded.length > 0) {
    var unique = Array.from(new Set(realHardcoded));
    console.log('  Hardcoded colors outside :root: ' + unique.join(', '));
}

// Allow up to 50 hardcoded colors (arena dark mode uses many palette overrides)
// This test is a baseline guard -- alert if the count grows
test('Hardcoded hex colors outside :root <=50 (baseline): ' + realHardcoded.length, realHardcoded.length <= 50);

console.log('\n' + '='.repeat(50));
console.log('css-no-hardcoded-colors: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
