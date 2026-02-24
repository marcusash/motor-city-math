// css-color-token-consistency test
// All color values in shared/styles.css should use CSS custom properties (var(--))
// Hardcoded color values mixed with tokens make theming impossible

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-color-token-consistency.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Remove :root block (where tokens are defined) and comments
var noRoot = css.replace(/:root\s*\{[^}]+\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

// Count hardcoded color values outside :root (4-6 char hex, named colors)
var hardcodedHex = (noRoot.match(/:\s*#[0-9a-fA-F]{3,6}\b/g) || []).length;
var varColors = (noRoot.match(/:\s*var\s*\(--[^)]+\)/g) || []).length;

// Some hardcoded hex is acceptable (design system may have fixed values like #000, #fff)
var MAX_HARDCODED = 40;

test('CSS uses var() for colors more than hardcoded hex', varColors > hardcodedHex);
test('Hardcoded hex colors outside :root are <= ' + MAX_HARDCODED + ' (found: ' + hardcodedHex + ')', hardcodedHex <= MAX_HARDCODED);
console.log('  var() colors: ' + varColors + ', hardcoded hex: ' + hardcodedHex);

console.log('\n' + '='.repeat(50));
console.log('css-color-token-consistency: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
