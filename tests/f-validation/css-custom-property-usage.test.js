// css-custom-property-usage test
// HTML files should use CSS custom properties (var(--...)) not hardcoded hex colors
// Exceptions allowed: fallback colors in CSS var() second arg, or gradient stops

const fs = require('fs');
const path = require('path');
const glob = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-custom-property-usage.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Count var(--...) usages
var varCount = (stylesSrc.match(/var\(--[a-z]/g) || []).length;

// Count inline hex (#rgb or #rrggbb) NOT in :root declarations or var() fallbacks
var lines = stylesSrc.split('\n');
var hardcoded = [];
lines.forEach(function(line, idx) {
    // Skip :root block lines (these define the tokens -- allowed)
    if (line.includes(':root') || line.trim().startsWith('--')) return;
    // Skip comment lines
    if (line.trim().startsWith('/*') || line.trim().startsWith('*')) return;
    // Skip var() fallback colors (second arg in var())
    var cleaned = line.replace(/var\([^)]+\)/g, '');
    // Check for hex colors remaining
    var hexMatch = cleaned.match(/#([0-9a-fA-F]{3,6})\b/g);
    if (hexMatch) {
        hardcoded.push('line ' + (idx + 1) + ': ' + hexMatch.join(', '));
    }
});

console.log('\u2500\u2500 CSS custom property checks \u2500\u2500\n');
console.log('  CSS var(--...) usages: ' + varCount);
console.log('  Inline hex usages (outside :root/fallbacks): ' + hardcoded.length);
if (hardcoded.length > 0 && hardcoded.length <= 5) {
    hardcoded.forEach(function(h) { console.log('  ! ' + h); });
} else if (hardcoded.length > 5) {
    hardcoded.slice(0, 3).forEach(function(h) { console.log('  ! ' + h); });
    console.log('  ... and ' + (hardcoded.length - 3) + ' more');
}
console.log('');

test('CSS uses >=30 custom property references', varCount >= 30);
// Allow up to 20 hardcoded values (WCAG fallbacks, data URIs, gradients are exceptions)
test('Inline hex count reasonable (<=20 outside :root)', hardcoded.length <= 20);

console.log('\n' + '='.repeat(50));
console.log('css-custom-property-usage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
